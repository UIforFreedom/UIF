#!/usr/bin/env bash

# 启用 IP 路由转发
echo "Enabling IP forwarding..."
sysctl -w net.ipv4.ip_forward=1

# 清空所有防火墙规则
echo "Clearing all iptables rules..."
iptables -F
iptables -t nat -F
iptables -t mangle -F
iptables -X

# 设置默认策略为 ACCEPT 以确保所有流量都被允许
echo "Setting default policies to ACCEPT..."
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

/usr/bin/uif/uif
