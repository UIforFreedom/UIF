package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"time"

	// "github.com/getlantern/elevate"
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
	allowedDomain := "http://127.0.0.1:*"
	if uif.IsNeedKey() {
		allowedDomain = "*"
	} else {
		webPort, err := uif.GetWebAddressPort()
		if err == nil {
			allowedDomain = "http://127.0.0.1:" + webPort
		}
		if strings.Contains(r.Header.Get("Origin"), "uiforfreedom.github.io") {
			allowedDomain = "https://uiforfreedom.github.io"
		}
	}
	return allowedDomain
}

func Service(w http.ResponseWriter, r *http.Request) {
	// {{{
	serviceMutext.Lock()

	// Protection.
	w.Header().Set("Access-Control-Allow-Origin", BuildAllowedDomain(r))
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS,GET")
	w.Header().Set("Access-Control-Allow-Headers", "accept,x-requested-with,Content-Type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("content-type", "application/json")

	p := r.URL.Query()
	token := p.Get("key")
	if token == "" {
		r.ParseForm()
		token = r.FormValue("key")
	}

	if uif.IsNeedKey() {
		if token != uif.GetKey() {
			if token != "" {
				time.Sleep(3 * time.Second) // security.
			}
			fmt.Fprint(w, "{\"status\": -1}") // empty means no
			serviceMutext.Unlock()
			return
		}
	}

	path := r.URL.Path
	res := "{}"
	if path == "/get_uif_config" {
		res = uif.ReadUIFConfig()
	} else if path == "/save_uif_config" {
		config := r.FormValue("config")
		uif.SaveUIFConfig(config)
		uif.SetCoreAutoRestartTicker()
	} else if path == "/run_core" {
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
		CloseServer()
		serviceMutext.Unlock() // use bug to close UIF.
	} else if path == "/proxy_get" {
		serviceMutext.Unlock()
		dst := r.FormValue("dst")
		res = uif.ProxyGet(dst)
		fmt.Fprint(w, res)
		return
	} else if path == "/ping" {
		serviceMutext.Unlock()
		address := r.FormValue("address")
		res := uif.Ping(address)
		fmt.Fprint(w, res)
		return
	} else if path == "/share" {
		res = uif.ReadCoreConfig()
	} else if path == "/update_uif" {
		res = uif.Update()
	} else if path == "/check_update" {
		res = uif.CheckUpdateReq()
	}

	fmt.Fprint(w, res)
	serviceMutext.Unlock()
	// }}}
}

func CheckPort() error {
	port, err := uif.GetWebAddressPort()
	if err != nil {
		return err
	}
	res, err := uif.TCPPortCheck(port)
	if err != nil {
		return err
	}
	if !res {
		return errors.New("web Port is in used.")
	}

	port, err = uif.GetAPIAddressPort()
	if err != nil {
		return err
	}
	res, err = uif.TCPPortCheck(port)
	if err != nil {
		return err
	}
	if !res {
		return errors.New("api Port is in used.")
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

	api := http.HandlerFunc(Service)
	APIServer = http.Server{
		Addr:    uif.GetAPIAddress(),
		Handler: api,
	}
	go APIServer.ListenAndServe()
	return nil
}

func CloseServer() {
	err := WebServer.Shutdown(context.Background())
	if err != nil {
		panic(err)
	}
	err = APIServer.Shutdown(context.Background())
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
	}

	if uif.IsAutoUpdateUIF() {
		uif.Update()
	}
}

func Elevate() {
	if !uif.IsWindows() || uif.IsAdmin() || !uif.IsNeedAdmin() {
		// TODO: Support macos
		return
	}
	fmt.Println("Is not Admin. Will relaunch.")
	err := uif.SetAdmin()
	if err != nil {
		fmt.Println(err)
	}
	os.Exit(0)
}

func CheckAndInit() error {
	if err := CheckPort(); err != nil {
		return err
	}
	if ip := uif.GetDefaultInterface(); ip == nil {
		uif.WriteLog("missing network interface.")
		// return errors.New("missing interface.")
	}
	return nil
}

func main() {
	if err := CheckAndInit(); err != nil {
		uif.WriteLog(err.Error())
		return
	}

	Elevate()
	RunServer()
	go StartupCore()

	uif.WriteLog("<<<< UIF running >>>>")

	if uif.IsOpenBrowser() {
		err := uif.OpenBrowser("http://" + uif.GetWebAddress())
		if err != nil {
			uif.WriteLog("Can not open broswer.")
			uif.WriteLog(err.Error())
		}
	}

	WaitQuitSnignal() // block at here.
	uif.CloseCore()
	CloseServer()
}
