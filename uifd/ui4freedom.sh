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
    for proc in uif_service uif; do
        pids="$(pidof "$proc")"
        if [ -n "$pids" ]; then
            kill -TERM $pids
            sleep 2
            pids2="$(pidof "$proc")"
            [ -n "$pids2" ] && kill -KILL $pids2
        fi
    done
}

restart() {
    stop_service
    start_service
}

reload() {
    restart
}
