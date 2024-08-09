import React from "react";
import Link from "@docusaurus/Link";
import { message, Button } from "antd";
import copy2Clipboard from 'copy-to-clipboard';

const App = (props) => {
  var randomText = Math.floor(Math.random() * 10);
  var url = `${props.domain}/subs/${randomText}.json`;
  const [messageApi, contextHolder] = message.useMessage();

  const copyToClipboard = () => {
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
      console.log(err)
      messageApi.error("复制失败，请手动操作！");
    }
  };

  return (
    <div>
      {contextHolder}
      <Link to={url}>{url}</Link>
      <Button
        type="primary"
        style={{ marginLeft: 20 }}
        onClick={copyToClipboard}
      >
        点击复制
      </Button>
    </div>
  );
};
export default App;
