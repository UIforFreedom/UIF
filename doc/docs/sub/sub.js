import React from "react";
import { Badge, Descriptions, Button } from "antd";
const user = [
  {
    key: "1",
    label: "用户",
    children: "免费用户",
    span: {
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2,
      xl: 2,
      xxl: 2,
    },
  },
  {
    key: "6",
    label: "状态",
    children: <Badge status="processing" text="可用" />,
    span: {
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2,
      xl: 2,
      xxl: 2,
    },
  },
  {
    key: "5",
    label: "订阅链接",
    children: "http://127.0.0.1:4544/#/home",
  },
];

const used = [
  {
    key: "4",
    label: "已用流量",
    children: "100MB",
  },
  {
    key: "5",
    label: "剩余流量",
    children: "200MB",
  },
  {
    key: "2",
    label: "最后在线",
    children: "2024-07-29 00:49",
  },
  {
    key: "9",
    label: "更新时间",
    children: "2024-07-29 00:49",
  }
];
const App = () => (
  <div style={{ display: "grid", placeItems: "center" }}>
  <Descriptions
    title="专属订阅信息"
    bordered
    items={user}
    extra={<Button type="primary">生成订阅</Button>}
  />

  <Descriptions
    bordered
    items={used}
  />
  </div>
);
export default App;
