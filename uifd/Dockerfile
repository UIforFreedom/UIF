FROM alpine:latest

WORKDIR /uif
RUN apk update
RUN apk add --no-cache curl tar bash nftables iproute2 iptables kmod sudo

COPY linux_install.sh linux_install.sh
RUN chmod +x linux_install.sh
RUN echo "true" > "./use_docker"

RUN bash linux_install.sh

COPY docker_run.sh docker_run.sh
RUN chmod +x docker_run.sh

# 设置容器启动时执行的命令
CMD ["bash", "docker_run.sh"]
# CMD ["/usr/bin/uif/uif"]
