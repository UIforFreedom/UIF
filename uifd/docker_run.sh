#!/usr/bin/env bash

# 启用 IP 路由转发
echo "Enabling IP forwarding..."
sysctl -w net.ipv4.ip_forward=1

# 设置默认策略为 ACCEPT 以确保所有流量都被允许
echo "Setting default policies to ACCEPT..."
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

/usr/bin/uif/uif
