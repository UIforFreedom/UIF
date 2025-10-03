package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/getlantern/elevate"
	"github.com/gorilla/websocket"
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
	isPass := false
	allowedDomain := BuildAllowedDomain(r)
	// Protection.
	defer func() {
		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", allowedDomain)
		w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS,GET")
		if !isPass {
			return
		}
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", "accept,x-requested-with,Content-Type,Extra-Info")
		w.Header().Set("Access-Control-Expose-Headers", "Content-Type, Extra-Info")
	}()

	token := r.URL.Query().Get("key")
	if token == "" {
		err := r.ParseForm()
		if err == nil {
			token = r.FormValue("key")
		}
	}

	if uif.IsNeedKey() {
		if token != uif.GetKey() {
			if token != "" {
				time.Sleep(3 * time.Second) // security.
			}
			fmt.Fprint(w, "{\"status\": -1}") // empty means no
		} else {
			isPass = true
		}
	} else {
		isPass = allowedDomain == "*"
	}
	return isPass
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
		if uif.IsMacos() && uif.IsUseTun() {
			uif.SetOsDNS(false, "")
		}
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
		go CleanAndQuit()
	} else if path == "/proxy_get" || path == "/http_mutiple" {
		serviceMutext.Unlock()
		dst := r.FormValue("dst")
		proxyFirst := r.FormValue("proxy_first") == "true"
		ExtraInfo := ""
		res, ExtraInfo = uif.ProxyGet(dst, proxyFirst, path == "/http_mutiple")
		w.Header().Set("Extra-Info", ExtraInfo)
		fmt.Fprint(w, res)
		return
	} else if path == "/proxy_get2" || path == "/http_with_port" {
		serviceMutext.Unlock()
		ExtraInfo := ""
		res, ExtraInfo, _ = uif.HTTPWithProxyPort(r.FormValue("dst"),
			r.FormValue("http_proxy_port"),
			r.FormValue("authorization"),
			r.FormValue("method"),
			r.FormValue("data"))
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
		// uif.AllowPort(apiPort, "tcp")
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

	api := http.NewServeMux()
	api.HandleFunc("/delay", TestNode)
	api.HandleFunc("/", Service)

	APIServer = http.Server{
		Addr:    uif.GetAPIAddress(),
		Handler: api,
	}
	go APIServer.ListenAndServe()
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

func StartupCore() {
	if !uif.IsFirstTime() && !uif.HasFlutter() {
		err := uif.RunCore()
		if err != nil {
			uif.WriteLog(err.Error())
		}
	} else if !uif.HasFlutter() {
		SetQuicLink()
	}

	if uif.IsAutoUpdateUIF() {
		time.Sleep(10 * time.Second) // let core to be ready
		uif.Update()
	}
}

func CheckAndInit() error {
	uif.WriteLog("Password: " + uif.GetKey()) // init
	if err := CheckPort(); err != nil {
		return err
	}
	uif.ParseApiPort()
	return nil
}

func main() {
	err := Entry()
	if err != nil {
		uif.WriteLog(err.Error())
		fmt.Fprintf(os.Stderr, "UIF Error: %v\n", err)
		os.Exit(1)
	}
	if uif.HasFlutter() {
		uif.WaitQuitSnignal()
	} else {
		TrayInit()
	}
	CleanAndQuit()
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

func CleanAndQuit() { // close all
	os.WriteFile(uif.GetWorkSpace()+"/version/abc.txt", []byte("1"), 0644)
	uif.CloseCore()
	CloseServer()
	uif.WriteLog("UIF Service Closed.")
	os.Exit(0)
}

func Elevate() {
	if !uif.IsWindows() {
		uif.UnixChmod()
		return
	}
	isElevated := flag.Bool("is_elevated", false, "not for user.")
	flag.Parse()

	if !uif.IsNeedAdmin() || *isElevated {
		return
	}
	path, _ := os.Executable()
	cmd := elevate.Command(path, "--is_elevated")
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()
	os.Exit(0)
}

func Entry() error {
	Elevate()
	if err := CheckAndInit(); err != nil {
		if !CheckAction() {
			uif.NormalOpenWeb()
		}
		uif.WriteLog(err.Error())
		return err
	}
	PrintPortInfo()
	RunServer()
	go StartupCore()
	uif.WriteLog("<<<< UIF running >>>>")

	if CheckAction() {
		return nil
	}
	uif.ListenOSQuit()
	if uif.IsOpenBrowser() {
		err := uif.NormalOpenWeb()
		if err != nil {
			uif.WriteLog("Can not open broswer. " + err.Error())
		}
	} else {
		uif.WriteLog("Setting not to open web.")
	}
	return nil // will not block
}

func printPortInfo(address string, t string) {
	_, port1, err := net.SplitHostPort(address)
	if err != nil {
		uif.WriteLog("Wrong " + t + " Address. " + err.Error())
		return
	}
	uif.WriteLog(t + " Address: " + uif.GetOutboundIP() + ":" + port1)
}

func PrintPortInfo() {
	printPortInfo(uif.GetAPIAddress(), "API")
	printPortInfo(uif.GetWebAddress(), "Web")

	outboundIP := uif.GetOutboundIP()
	_, webPort, _ := net.SplitHostPort(uif.GetWebAddress())
	_, apiPort, _ := net.SplitHostPort(uif.GetAPIAddress())
	a := url.QueryEscape(fmt.Sprintf(`http://%s:%s`, outboundIP, apiPort))
	p := url.QueryEscape(uif.GetKey())
	quicLink := fmt.Sprintf(`Quic Open Link:  http://%s:%s?a=%s&p=%s`, outboundIP, webPort, a, p)
	uif.WriteLog(quicLink)
}
