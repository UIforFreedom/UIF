package uif

import "net/url"

func ParseURL(rawURL string) string {
	// 解析 URL
	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		WriteLog("Error parsing URL: " + err.Error())
		return ""
	}

	// 根据不同的协议路径或查询参数执行操作
	switch parsedURL.Host {
	case "import-remote-profile":
		urlLink := parsedURL.Query().Get("url")
		name := parsedURL.Fragment
		if urlLink == "" {
			return ""
		}
		return "?action=add_subcription&data=" + url.QueryEscape(urlLink) + "&import_type=link&tag=" + url.QueryEscape(name)
	default:
		WriteLog("Unknown command: " + parsedURL.Host)
	}
	return ""
}
