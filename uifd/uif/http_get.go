package uif

import (
	"encoding/json"
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
	return "uif/sing-box/" + GetCurrentUIFVersion() + " (Prefer ClashMeta Format)"
}

func ProxyHTTP2(dst string, proxyPort string) (string, error) {
	proxyUrl, err := url.Parse("http://127.0.0.1:" + proxyPort)
	httpProxyAddress := http.ProxyURL(proxyUrl)
	if err != nil || proxyPort == "" {
		// not to use proxy
		httpProxyAddress = nil
	}
	client := &http.Client{Transport: &http.Transport{Proxy: httpProxyAddress}, Timeout: 8 * time.Second}

	req, err := http.NewRequest("GET", dst, nil)
	if err != nil {
		return "", err
	}

	req.Header.Set("User-Agent", GetProxyHTTPUA())
	req.Header.Set("Content-Type", "text/plain; charset=utf-8")

	resp, err := client.Do(req)
	if err != nil {
		return "", err
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
		return "", fmt.Errorf("Error getting encoding: %s", err)
	}

	// 解码响应体为 UTF-8
	utf8Reader := transform.NewReader(resp.Body, enc.NewDecoder())
	utf8Data, err := io.ReadAll(utf8Reader)
	if err != nil {
		return "", fmt.Errorf("Error decoding response body: %s", err)
	}
	utf8String := string(utf8Data)
	return utf8String, nil
}

func HTTPGetProxy(dst string) (string, error) {
	return ProxyHTTP2(dst, GetHttpApiPort())
}

func HTTPGetDirect(dst string) (string, error) {
	return ProxyHTTP2(dst, GetHttpApiPortDirect())
}

// require sing-box is running.
func ProxyGet(dst string, proxyFirst bool) string {
	res := ReqInfo{Status: 0}
	if dst == "" {
		res.Status = 2
		res.Res = "dst can not be empty."
	} else {
		var err error
		if proxyFirst {
			res.Res, err = HTTPGetProxy(dst)
		} else {
			res.Res, err = HTTPGetDirect(dst)
		}
		if err != nil {
			WriteLog(err.Error())
			res.Status = 1
			if proxyFirst {
				res.Res, err = HTTPGetDirect(dst)
			} else {
				res.Res, err = HTTPGetProxy(dst)
			}
			WriteLog(err.Error())
			WriteLog(res.Res)
			if err == nil {
				res.Status = 0
			} else {
				res.Res = err.Error() + "\n" + err.Error()
			}
		}
	}
	temp, _ := json.Marshal(res)
	return string(temp)
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
			WriteLog("cached UIFAPI port: " + GetHttpApiPort())
		} else if v.Tag == "UIFAPIDirect" {
			ApiPortDirect = v.Port
			WriteLog("cached UIFAPIDirect port: " + GetHttpApiPortDirect())
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
