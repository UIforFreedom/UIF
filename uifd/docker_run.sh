#!/usr/bin/env bash

# 启用 IP 路由转发
sysctl -w net.ipv4.ip_forward=1
sysctl -w net.ipv6.ip_forward=1

/usr/bin/uif/uif
