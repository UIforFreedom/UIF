package uif

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"golang.org/x/text/encoding"
	"golang.org/x/text/encoding/unicode"
	"golang.org/x/text/transform"
)

// 根据字符集名称返回相应的编码解码器
func getEncoding(charset string) (encoding.Encoding, error) {
	switch strings.ToLower(charset) {
	case "utf-16":
		return unicode.UTF16(unicode.LittleEndian, unicode.ExpectBOM), nil
	case "utf-16le":
		return unicode.UTF16(unicode.LittleEndian, unicode.IgnoreBOM), nil
	case "utf-16be":
		return unicode.UTF16(unicode.BigEndian, unicode.IgnoreBOM), nil
	default:
		return unicode.UTF8, nil
	}
}

func GetProxyHTTPUA() string {
	return "uif/clash-meta/mihomo/clash/sing-box/" + GetCurrentUIFVersion()
}

type ExtraMsg struct {
	ContentDisposition   string `json:"content-disposition,omitempty"`
	SubscriptionUserinfo string `json:"subscription-userinfo,omitempty"`
	ProfileWebPageUrl    string `json:"profile-web-page-url,omitempty"`
}

type HTTPRes struct {
	Res       string
	Error     error
	ExtraMsg  string
	IsTimeout bool
}

func HTTPWithProxyPort(dst string, proxyPort string,
	authorization string, method string, data string) (string, string, error) {
	proxyUrl, err := url.Parse("http://127.0.0.1:" + proxyPort)
	httpProxyAddress := http.ProxyURL(proxyUrl)
	if err != nil || proxyPort == "" {
		// not to use proxy
		httpProxyAddress = nil
	}
	client := &http.Client{Transport: &http.Transport{Proxy: httpProxyAddress}, Timeout: 12 * time.Second}
	if data == "" {
		data = "{}"
	}
	if method == "" {
		method = "GET"
	}

	// 针对 GET 和 HEAD 请求，不传递请求体
	var body io.Reader
	if method != "GET" && method != "HEAD" {
		if data == "" {
			data = "{}"
		}
		body = bytes.NewBuffer([]byte(data))
	}
	req, err := http.NewRequest(method, dst, body)
	if err != nil {
		return "", "", err
	}

	if authorization != "" {
		req.Header.Set("Authorization", "Bearer "+authorization)
	}
	req.Header.Set("User-Agent", GetProxyHTTPUA())
	req.Header.Set("Content-Type", "text/plain; charset=utf-8")
	// req.Header.Set("Content-Type", "application/json; charset=utf-8")

	resp, err := client.Do(req)
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()

	// 提取 Content-Type 头中的编码信息
	contentType := resp.Header.Get("Content-Type")
	charset := "utf-8" // 默认编码为 UTF-8

	// 通过 Split 提取 charset
	for _, part := range strings.Split(contentType, ";") {
		part = strings.TrimSpace(part)
		if strings.HasPrefix(part, "charset=") {
			charset = strings.TrimPrefix(part, "charset=")
			break
		}
	}

	// 获取相应的编码解码器
	enc, err := getEncoding(charset)
	if err != nil {
		return "", "", fmt.Errorf("Error getting encoding: %s", err)
	}

	// 解码响应体为 UTF-8
	utf8Reader := transform.NewReader(resp.Body, enc.NewDecoder())
	utf8Data, err := io.ReadAll(utf8Reader)
	if err != nil {
		return "", "", fmt.Errorf("Error decoding response body: %s", err)
	}
	extraMsg := &ExtraMsg{}
	extraMsg.ContentDisposition = resp.Header.Get("content-disposition")
	extraMsg.SubscriptionUserinfo = resp.Header.Get("subscription-userinfo")
	extraMsg.ProfileWebPageUrl = resp.Header.Get("profile-web-page-url")
	extraMsgByte, _ := json.Marshal(extraMsg)

	return string(utf8Data), string(extraMsgByte), nil
}

func HTTPGetProxy(dst string) (string, string, error) {
	return HTTPWithProxyPort(dst, GetHttpApiPort(), "", "", "")
}

func HTTPGetDirect(dst string) (string, string, error) {
	return HTTPWithProxyPort(dst, GetHttpApiPortDirect(), "", "", "")
}

// require sing-box is running.
func ProxyGet(dst string, proxyFirst bool, isMutiple bool) (string, string) {
	extraMsg := ""
	res := ReqInfo{Status: 0}
	if dst == "" {
		res.Status = 2
		res.Res = "dst can not be empty."
	} else if isMutiple {
		r := HTTPMutiple(dst)
		extraMsg = r.ExtraMsg
		res.Res = r.Res
		if r.Error != nil {
			res.Status = 1
			res.Res = r.Error.Error()
		}
	} else {
		var err error
		if proxyFirst {
			res.Res, extraMsg, err = HTTPGetProxy(dst)
		} else {
			res.Res, extraMsg, err = HTTPGetDirect(dst)
		}
		if err != nil {
			WriteLog(err.Error())
			res.Status = 1
			if proxyFirst {
				res.Res, extraMsg, err = HTTPGetDirect(dst)
			} else {
				res.Res, extraMsg, err = HTTPGetProxy(dst)
			}
			WriteLog(res.Res)
			if err == nil {
				res.Status = 0
			} else {
				res.Res = err.Error() + "\n" + err.Error()
				WriteLog(err.Error())
			}
		}
	}
	temp, _ := json.Marshal(res)
	return string(temp), extraMsg
}

func HTTPMutiple(dst string) *HTTPRes {
	ch := make(chan *HTTPRes, 3)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// 超时 goroutine
	go func() {
		select {
		case <-time.After(20 * time.Second):
			select {
			case ch <- &HTTPRes{Error: errors.New("Timeout! Failed to get data"), IsTimeout: true}:
			case <-ctx.Done():
			}
		case <-ctx.Done():
		}
	}()

	// 尝试直连
	go func() {
		res := &HTTPRes{}
		res.Res, res.ExtraMsg, res.Error = HTTPGetDirect(dst)
		select {
		case ch <- res:
		case <-ctx.Done():
		}
	}()

	// 尝试代理
	go func() {
		res := &HTTPRes{}
		res.Res, res.ExtraMsg, res.Error = HTTPGetProxy(dst)
		select {
		case ch <- res:
		case <-ctx.Done():
		}
	}()

	tryCount := 0
	for i := 0; i < 3; i++ {
		select {
		case res := <-ch:
			if !res.IsTimeout {
				tryCount++
			}
			if res.Error == nil || res.IsTimeout || tryCount >= 2 {
				cancel()
				return res
			}
		case <-ctx.Done():
			return &HTTPRes{Error: errors.New("request cancelled")}
		}
	}

	return &HTTPRes{Error: errors.New("empty res")}
}

type inboundItem struct {
	Port int    `json:"listen_port"`
	Tag  string `json:"tag"`
}

type inbounds struct {
	Inbounds []inboundItem `json:"inbounds"`
}

func ParseApiPort2(config string) {
	if ApiPort != 0 && ApiPortDirect != 0 {
		return
	}
	j := &inbounds{}

	err := json.Unmarshal([]byte(config), j)
	if err != nil {
		return
	}
	for _, v := range j.Inbounds {
		if v.Tag == "UIFAPI" {
			ApiPort = v.Port
		} else if v.Tag == "UIFAPIDirect" {
			ApiPortDirect = v.Port
		}
	}
}

func ParseApiPort() {
	ParseApiPort2(ReadCoreConfig())
}

var ApiPort int
var ApiPortDirect int

func GetHttpApiPort() (port string) {
	var err error
	if ApiPort == 0 {
		ApiPort, err = GetUnusedPort()
		if err != nil {
			ApiPort = 11454
		}
	}
	return fmt.Sprintf("%d", ApiPort)
}

func GetHttpApiPortDirect() (port string) {
	var err error
	if ApiPortDirect == 0 {
		ApiPortDirect, err = GetUnusedPort()
		if err != nil {
			ApiPortDirect = 11455
		}
	}
	return fmt.Sprintf("%d", ApiPortDirect)
}
