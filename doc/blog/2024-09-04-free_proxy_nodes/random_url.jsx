import React from "react";
import Link from "@docusaurus/Link";
import { message, Button } from "antd";
import copy2Clipboard from "copy-to-clipboard";

const App = (props) => {
  var randomText = Math.floor(Math.random() * 10);
  var url = `${props.domain}/subs/${randomText}.json`;
  const [messageApi, contextHolder] = message.useMessage();

  var copyToClipboard = () => {
    try {
      copy2Clipboard(url);
      messageApi.success(
        <>
          {url}
          <br />
          已复制到剪切板
        </>,
      );
    } catch (err) {
      console.log(err);
      messageApi.error("复制失败，请手动操作！");
    }
  };

  var quicImport = () => {
    window.open(
      `sing-box://import-remote-profile?url=${encodeURIComponent(url)}#${encodeURIComponent("ab")}`,
      "_blank",
    );
  };

  return (
    <div>
      {contextHolder}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to={url}>{url}</Link>

        <div style={{ marginTop: 10 }}>
          <Button onClick={copyToClipboard}>点击复制</Button>

          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={quicImport}
          >
            快速导入
          </Button>
        </div>
      </div>
    </div>
  );
};
export default App;
