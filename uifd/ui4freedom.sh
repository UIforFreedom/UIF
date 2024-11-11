#!/bin/sh /etc/rc.common


START=95
STOP=01
USE_PROCD=1

APP_PATH="/usr/bin/uif/uif"

start_service() {
    procd_open_instance
    procd_set_param command $APP_PATH
    procd_set_param respawn
    procd_close_instance
}

stop_service() {
    killall uif_service
    killall uif
}

restart() {
    stop_service
    start_service
}

reload() {
    restart
}
