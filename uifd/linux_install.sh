#!/usr/bin/env bash

quit_with_error(){
  echo ""
  echo $1
  exit -1
}

if ! [ -x "$(command -v systemctl)" ]; then
  quit_with_error 'Missing "systemd"'
fi

if [ -x "$(command -v yum)" ]; then
  manager="rpm"
elif [ -x "$(command -v apt)" ]; then
  manager="deb"
else
  quit_with_error 'required yum or apt'
fi

ARCH_NAME="uif-linux-amd64.$manager"
PACKAGE_NAME="uif"
CACHE_PATH="./$ARCH_NAME"

download() {
  DOWNLOAD_LINK="https://github.com/UIforFreedom/UIF/releases/latest/download/$ARCH_NAME"
  echo "Downloading from: $DOWNLOAD_LINK"
  if ! curl -R -L -H 'Cache-Control: no-cache' -o "$1"  "$DOWNLOAD_LINK"; then
    quit_with_error 'Download failed! Please check your network or try again.'
  fi
}

sudo systemctl stop $PACKAGE_NAME
download $CACHE_PATH

if manager=="deb"; then
  sudo apt remove $PACKAGE_NAME
  if ! sudo apt install $CACHE_PATH; then
    quit_with_error "Failed to install by apt."
  fi
else
  sudo yum remove $PACKAGE_NAME
  if ! sudo yum localinstall $CACHE_PATH; then
    quit_with_error "Failed to install by yum."
  fi
fi


if ! sudo systemctl start $PACKAGE_NAME; then
  quit_with_error "Failed to execute systemctl"
fi

chmod -R 755 /usr/bin/uif/

echo ""
echo " "
echo "Installed."
