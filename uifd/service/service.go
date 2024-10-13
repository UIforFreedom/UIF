package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"sync"
	"time"

	"github.com/getlantern/elevate"
	"github.com/gorilla/websocket"
	"github.com/kardianos/service"
	"github.com/uif/uifd/uif"
)

var serviceMutext sync.Mutex

var APIServer http.Server
var WebServer http.Server

type ConnectInfo struct {
	Path      string `json:"path,omitempty"`
	Version   string `json:"version,string,omitempty"`
	StartTime string `json:"startTime,string,omitempty"`
}

func BuildAllowedDomain(r *http.Request) string {
	if uif.IsNeedKey() {
		return "*"
	}
	domain := r.Header.Get("Origin")
	if domain == "" {
		domain = r.Header.Get("Referer")
		if domain == "" {
			return ""
		}
	}
	url, err := url.Parse(domain)
	if err != nil {
		return ""
	}
	trustedDomain := []string{"uiforfreedom.github.io", "127.0.0.1", "localhost", "ui4freedom.org"}
	for _, v := range trustedDomain {
		if strings.HasSuffix(url.Hostname(), v) {
			return "*"
		}
	}
	return ""
}

func CheckPassword(w http.ResponseWriter, r *http.Request) bool {
	allowedDomain := BuildAllowedDomain(r)
	// Protection.
	w.Header().Set("Access-Control-Allow-Origin", allowedDomain)
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS,GET")
	w.Header().Set("Access-Control-Allow-Headers", "accept,x-requested-with,Content-Type,Extra-Info")
	w.Header().Set("Access-Control-Expose-Headers", "Content-Type, Extra-Info")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("content-type", "application/json")

	token := r.URL.Query().Get("key")
	if token == "" {
		err := r.ParseForm()
		if err == nil {
			token = r.FormValue("key")
		}
	}

	if !uif.IsNeedKey() {
		return allowedDomain == "*"
	}

	if token != uif.GetKey() {
		if token != "" {
			time.Sleep(3 * time.Second) // security.
		}
		fmt.Fprint(w, "{\"status\": -1}") // empty means no
		return false
	}
	return true
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func TestNode(w http.ResponseWriter, r *http.Request) {
	serviceMutext.Lock()
	if !CheckPassword(w, r) {
		serviceMutext.Unlock()
		return
	}
	serviceMutext.Unlock()
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		uif.WriteLog(err.Error())
		return
	}
	defer conn.Close()
	uif.TestMultipleNode(conn)
}

func TryOpenPort(i string) {
	var inboudPorts []string
	json.Unmarshal([]byte(i), &inboudPorts)
	for _, v := range inboudPorts {
		uif.AllowPort(v, "tcp")
		uif.AllowPort(v, "udp")
	}
}

func Service(w http.ResponseWriter, r *http.Request) {
	// {{{
	serviceMutext.Lock()
	if !CheckPassword(w, r) {
		serviceMutext.Unlock()
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	path := r.URL.Path
	res := "{}"

	if path == "/get_uif_config" {
		res = uif.ReadUIFConfig()
	} else if path == "/save_uif_config" {
		config := r.FormValue("config")
		shareConfig := r.FormValue("shareConfig")
		uif.SaveUIFConfig(config)
		uif.SaveShareConfig(shareConfig)
		uif.SetCoreAutoRestartTicker()
	} else if path == "/run_core" {
		TryOpenPort(r.FormValue("inboudPorts"))
		config := r.FormValue("config")
		uif.SaveCoreConfig(config)
		uif.RunCore()
	} else if path == "/close_core" {
		uif.CloseCore()
	} else if path == "/auto_startup" {
		enable := r.FormValue("isInstall")
		if enable == "true" {
			res = uif.SetAutoStartup(true)
		} else {
			res = uif.SetAutoStartup(false)
		}
	} else if path == "/connect" {
		res = uif.GetInfo()
	} else if path == "/close_uif" {
		uif.CloseCore()
		defer os.Exit(0)
	} else if path == "/proxy_get" {
		serviceMutext.Unlock()
		dst := r.FormValue("dst")
		proxyFirst := r.FormValue("proxy_first") == "true"
		ExtraInfo := ""
		res, ExtraInfo = uif.ProxyGet(dst, proxyFirst)
		w.Header().Set("Extra-Info", ExtraInfo)
		fmt.Fprint(w, res)
		return
	} else if path == "/proxy_get2" {
		serviceMutext.Unlock()
		ExtraInfo := ""
		res, ExtraInfo, _ = uif.ProxyHTTP2(r.FormValue("dst"),
			r.FormValue("http_proxy_port"),
			r.FormValue("authorization"))
		w.Header().Set("Extra-Info", ExtraInfo)
		fmt.Fprint(w, res)
		return
	} else if path == "/ping" {
		serviceMutext.Unlock()
		address := r.FormValue("address")
		res = uif.Ping(address)
		fmt.Fprint(w, res)
		return
	} else if path == "/share" {
		res = uif.ReadUIFShareConfig()
	} else if path == "/update_uif" {
		res = uif.Update()
	} else if path == "/check_update" {
		res = uif.CheckUpdateReq()
	} else if path == "/get_warp" {
		serviceMutext.Unlock()
		fmt.Fprint(w, uif.BuildWgcfRes())
		return
	}

	fmt.Fprint(w, res)
	serviceMutext.Unlock()
	// }}}
}

func CheckPort() error {
	webPort, err := uif.GetWebAddressPort()
	if err != nil {
		return err
	}
	_, err = uif.TCPPortCheck(webPort)
	if err != nil {
		return err
	}

	apiPort, err := uif.GetAPIAddressPort()
	if err != nil {
		return err
	}
	_, err = uif.TCPPortCheck(apiPort)
	if err != nil {
		return err
	}

	// open port if it is public
	if uif.IsNeedKey() {
		uif.AllowPort(apiPort, "tcp")
	}
	return nil
}

func RunServer() error {
	web := http.FileServer(http.Dir(uif.GetWebPath()))
	WebServer = http.Server{
		Addr:    uif.GetWebAddress(),
		Handler: web,
	}
	go WebServer.ListenAndServe()
	uif.WriteLog("Web Address: " + uif.GetWebAddress())

	api := http.NewServeMux()
	api.HandleFunc("/delay", TestNode)
	api.HandleFunc("/", Service)

	APIServer = http.Server{
		Addr:    uif.GetAPIAddress(),
		Handler: api,
	}
	go APIServer.ListenAndServe()
	uif.WriteLog("API Address: " + uif.GetAPIAddress())
	return nil
}

func CloseServer() {
	err := WebServer.Close()
	if err != nil {
		panic(err)
	}
	err = APIServer.Close()
	if err != nil {
		panic(err)
	}
}

func WaitQuitSnignal() {
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)

	// Waiting for SIGINT (kill -2)
	<-stop
}

func StartupCore() {
	if !uif.IsFirstTime() {
		err := uif.RunCore()
		if err != nil {
			uif.WriteLog(err.Error())
		}
	} else {
		SetQuicLink()
	}

	if uif.IsAutoUpdateUIF() {
		time.Sleep(10 * time.Second) // let core to be ready
		uif.Update()
	}
}

func Elevate() {
	isElevated := flag.Bool("is_elevated", false, "not for user.")
	flag.Parse()

	if uif.IsLinux() || !uif.IsNeedAdmin() || *isElevated {
		return
	}
	// err := uif.SetAdmin()
	path, err := os.Executable()
	cmd := elevate.Command(path, "--is_elevated")
	err = cmd.Run()
	if err != nil {
		fmt.Println(err)
	}
	os.Exit(0)
}

func CheckAndInit() error {
	uif.WriteLog("Password: " + uif.GetKey()) // init
	if err := CheckPort(); err != nil {
		return err
	}
	uif.UnixChmod()
	uif.ParseApiPort()
	return nil
}

func main() {
	// SetupService()
	err := Entry()
	if err != nil {
		uif.WriteLog(err.Error())
		fmt.Fprintf(os.Stderr, "UIF Error: %v\n", err)
		os.Exit(1)
	}
	TrayInit()
}

type program struct{}

var logger service.Logger

func NormalOpenWeb() error {
	return uif.OpenBrowser("http://" + uif.GetWebAddress())
}

func CheckAction() bool {
	action := ""
	if uif.IsActionExists() {
		rawURL := uif.ReadFile(uif.GetActionPath())
		uif.DeleteFile(uif.GetActionPath())
		if rawURL != "" {
			action = uif.ParseURL(rawURL)
		}
		uif.OpenBrowser("http://" + uif.GetWebAddress() + action)
		return true
	}
	return false
}

func Entry() error {
	if err := CheckAndInit(); err != nil {
		if !CheckAction() {
			NormalOpenWeb()
		}
		uif.WriteLog(err.Error())
		return err
	}
	Elevate()
	RunServer()
	go StartupCore()
	uif.WriteLog("<<<< UIF running >>>>")

	if CheckAction() {
		return nil
	}
	if uif.IsOpenBrowser() {
		err := NormalOpenWeb()
		if err != nil {
			uif.WriteLog("Can not open broswer. " + err.Error())
		}
	} else {
		uif.WriteLog("Setting not to open web.")
	}
	return nil // will not block
}

func (p *program) Start(s service.Service) error {
	return Entry()
}

func (p *program) run() {
}

func (p *program) Stop(s service.Service) error {
	uif.CloseCore()
	CloseServer()
	uif.WriteLog("UIF service closed.")
	return nil
}

func SetupService() {
	opts := make(service.KeyValue)
	opts["UserService"] = true
	svcConfig := &service.Config{
		Name:        "UIforFreedom",
		DisplayName: "UIforFreedom",
		Description: "Checkout 'https://github.com/UIforFreedom/UIF' for more info.",
		Executable:  uif.GetUIFPath(),
		Option:      opts,
	}

	p := &program{}
	var err error
	uif.Uif_service, err = service.New(p, svcConfig)
	if err != nil {
		uif.WriteLog(err.Error())
	}
	logger, err = uif.Uif_service.Logger(nil)
	if err != nil {
		uif.WriteLog(err.Error())
	}
	err = uif.Uif_service.Run()
	if err != nil {
		uif.WriteLog(err.Error())
	}
}
