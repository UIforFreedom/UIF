#!/usr/bin/env bash


init_uif_dir(){
  UIF_DIR="/usr/bin/uif"
  mkdir -p $UIF_DIR || true
  chmod -R 755 $UIF_DIR # 确保都有权限
}

# 打印带颜色的文本的函数
print_colored_text() {
  local color=$1
  local style=$2
  shift 2
  local text="$@"

  case $color in
    "black")   color=0;;
    "red")     color=1;;
    "green")   color=2;;
    "yellow")  color=3;;
    "blue")    color=4;;
    "magenta") color=5;;
    "cyan")    color=6;;
    "white")   color=7;;
    *)         color=9;;
  esac

  case $style in
    "normal")    style=0;;
    "bold")      style=1;;
    "underline") style=4;;
    "reverse")   style=7;;
    *)           style=0;;
  esac

  echo -e "\033[${style};3${color}m${text}\033[0m"
}

check_url() {
  local url=$1
  local timeout=5 # 5 seconds

  curl --head --silent --max-time $timeout $url > /dev/null

  # 检查 curl 的退出状态码
  if [ $? -eq 0 ]; then
    return 0
  else
    return 1
  fi
}

get_random_available_port() {
  while true; do
    # 生成一个随机端口号，范围在1024到65535之间
    port=$((1024 + RANDOM % 64512))

    # 检查该端口是否可用
    if ! ss -tuln | grep -q ":$port"; then
        echo $port
        return 0
    fi
  done
}

get_public_ip() {
  local temp=$(curl -s https://api.ipify.org)

  if [ -z "$temp" ]; then
    echo "{YourIPAddress}" 
  else
    echo "$temp"
  fi
}

quit_with_error(){
  echo ""
  echo "UIF Install Error: "
  print_colored_text "red" "normal" "$1"
  echo ""
  exit 1
}

check_arch(){
  arch=$(uname -m)

  if [[ $arch == "x86_64" || $arch == "x64" || $arch == "amd64" ]]; then
      UIFARCH="amd64"
  elif [[ $arch == "aarch64" || $arch == "arm64" ]]; then
      UIFARCH="arm64"
  elif [[ $arch == "armv7l" || $arch == "armv8l" || $arch == "arm32" ]]; then
      UIFARCH="armv7"
  else
    quit_with_error "Unknow arch: ${arch}"
  fi

  print_colored_text "green" "bold" "Arch: ${UIFARCH}"
}

download_and_install_system_service(){
  if is_docker; then
    return
  fi

  GITHUB_CONTENT_LINK1="https://cdn.jsdelivr.net/gh/UIforFreedom/UIF@master/uifd"
  GITHUB_CONTENT_LINK2="https://raw.githubusercontent.com/UIforFreedom/UIF/master/uifd"
  GITHUB_CONTENT_LINK3="https://ui4freedom.org/UIF_help/assets/release"

  if check_url "$GITHUB_CONTENT_LINK1"; then
    service_download_url=$GITHUB_CONTENT_LINK1
  elif check_url "$GITHUB_CONTENT_LINK2"; then
    service_download_url=$GITHUB_CONTENT_LINK2
  elif check_url "$GITHUB_CONTENT_LINK3"; then
    service_download_url=$GITHUB_CONTENT_LINK3
  else
    quit_with_error "can not found available url to download system service."
  fi

  if [[ $system_service == "systemd" ]]; then
    service_download_path="$service_download_url/ui4freedom.service"
    service_save_path="/etc/systemd/system/ui4freedom.service"
  else
    service_download_path="$service_download_url/ui4freedom.sh"
    service_save_path="/etc/init.d/ui4freedom.sh"
  fi

  print_colored_text "green" "bold" "Downloading from: $service_download_path"

  if ! curl -R -L -H 'Cache-Control: no-cache' -o "$service_save_path"  "$service_download_path"; then
    quit_with_error 'Download system service failed! Please check your network or try again.'
  fi

  chmod 755 $service_save_path # 确保都有权限
}

run_uif(){
  chmod -R 755 $UIF_DIR # 确保都有权限

  if is_docker; then
    return
  fi

  if [[ $system_service == "systemd" ]]; then
    systemctl restart ui4freedom
  else
    /etc/init.d/ui4freedom.sh start
  fi
}

stop_uif(){
  if is_docker; then
    return
  fi

  if [[ $system_service == "systemd" ]]; then
    systemctl stop ui4freedom || true
  else
    /etc/init.d/ui4freedom.sh stop || true
  fi
}

clear_uif(){
  stop_uif
  rm -R $UIF_DIR
}

check_sudo(){
  # check sudo
  if [[ "$(id -u)" != "0" ]]; then
    quit_with_error "Run this in root! Please do 'sudo -i' first."
  fi
}

check_curl(){
  if ! command -v curl &> /dev/null; then
    print_colored_text "green" "bold" "curl is not installed. try installing..."
    if [ -f /etc/debian_version ]; then
      apt update || true
      apt install -y curl
    elif [ -f /etc/redhat-release ]; then
      yum update || true
      yum install -y curl
    else
      quit_with_error "Please Install curl by yourself."
    fi
  fi
}

check_tar(){
  if ! command -v tar &> /dev/null; then
    print_colored_text "green" "bold" "tar is not installed. try installing..."
    if [ -f /etc/debian_version ]; then
      apt update || true
      apt install -y tar
    elif [ -f /etc/redhat-release ]; then
      yum update || true
      yum install -y tar
    else
      quit_with_error "Please Install tar by yourself."
    fi
  fi
}

check_system_service(){
  if is_docker; then
    system_service="docker"
  elif command -v systemctl &> /dev/null; then
    system_service="systemd"
  elif command -v procd &> /dev/null; then
    system_service="procd"
  else
    quit_with_error "Missing 'systemd' or 'procd'!"
  fi
  print_colored_text "green" "bold" "System service: $system_service"
}

check_kmodtun(){
  if ! lsmod | grep -q "^tun "; then
    quit_with_error "Need 'kmod-tun'"
  fi
}

extract_port_from_file() {
  local file_path="$1"

  # 检查文件是否存在
  if [ -e "$file_path" ]; then
    local file_content=$(cat "$file_path")

    # 使用awk提取端口号
    local port=$(echo "$file_content" | awk -F: '{print $2}')

    echo "$port"
    return 0
  else
    # 文件不存在时返回空值
    return 1
  fi
}

download_uif() {
  FILE_NAME="uif-linux-$UIFARCH.tar.gz"
  GITHUB_RELEASE_LINK1="https://ui4freedom.org/UIF_help/assets/release"
  GITHUB_RELEASE_LINK2="https://github.com/UIforFreedom/UIF/releases/latest/download"

  if check_url "$GITHUB_RELEASE_LINK1"; then
    UIF_DOWNLOAD_LINK="$GITHUB_RELEASE_LINK1/$FILE_NAME"
  elif check_url "$GITHUB_RELEASE_LINK2"; then
    UIF_DOWNLOAD_LINK="$GITHUB_RELEASE_LINK2/$FILE_NAME"
  else
    quit_with_error "can not found available url to download UIF."
  fi

  UIF_TAR_SAVE_PATH="./$FILE_NAME"
  print_colored_text "green" "bold" "Downloading from: $UIF_DOWNLOAD_LINK"
  if ! curl -R -L -H 'Cache-Control: no-cache' -o "$UIF_TAR_SAVE_PATH"  "$UIF_DOWNLOAD_LINK"; then
    quit_with_error 'Download failed! Please check your network or try again.'
  fi
}

get_uif_newest_version() {
  VERSION_LINK1="https://ui4freedom.org/UIF_help/assets/release/version/uif.txt"
  VERSION_LINK2="https://github.com/UIforFreedom/UIF/releases/latest/download/version/uif.txt"

  if check_url "$VERSION_LINK1"; then
    VERSION_LINK=$VERSION_LINK1
  elif check_url "$VERSION_LINK2"; then
    VERSION_LINK=$VERSION_LINK2
  fi

  local temp=$(curl -s $VERSION_LINK)
  print_colored_text "green" "bold" "Using UIF Version: v$temp"
}

install_or_update_uif() {
  local UNTAR_PATH="./uif_download_temp"
  rm -R $UNTAR_PATH || true
  mkdir -p $UNTAR_PATH || true

  tar -xzf "$UIF_TAR_SAVE_PATH" -C "$UNTAR_PATH"
  if [ $? -ne 0 ]; then
    quit_with_error "Failed to tar UIF."
  fi
  cp -rf "$UNTAR_PATH/uif-linux-$UIFARCH/"* "$UIF_DIR"
  rm -R $UNTAR_PATH || true

  if [ $? -eq 0 ]; then
    print_colored_text "green" "bold" "UIF saved to '$UIF_DIR'"
  else
    quit_with_error "failed to untar UIF to '$UIF_DIR'"
  fi
}

init_api_port(){
  # 初始化API端口
  API_ADDRESS_PATH="$UIF_DIR/uif_api_address.txt"
  api_port=$(extract_port_from_file "$API_ADDRESS_PATH")
  if [ $? -eq 0 ]; then
    print_colored_text "yellow" "bold" "Extracted api port: $api_port"
  else
    api_port=$(get_random_available_port)
  fi

  if is_docker; then
    api_port="9413"
  fi

  # 写API address 配置
  echo "0.0.0.0:$api_port" | tee $API_ADDRESS_PATH > /dev/null
}

init_web_port(){
  # 初始化API端口
  WEB_ADDRESS_PATH="$UIF_DIR/uif_web_address.txt"
  web_port=$(extract_port_from_file "$WEB_ADDRESS_PATH")
  if [ $? -eq 0 ]; then
    print_colored_text "yellow" "bold" "Extracted web port: $web_port"
  else
    web_port=$(get_random_available_port)
  fi

  if is_docker; then
    web_port="9527"
  fi

  # 写API address 配置
  echo "0.0.0.0:$web_port" | tee $WEB_ADDRESS_PATH > /dev/null
}

check_ipv4_forwarding() {
  local status=$(cat /proc/sys/net/ipv4/ip_forward)
  if [ "$status" -eq 1 ]; then
    print_colored_text "yellow" "normal" "ip_forward enabled."
  else
    print_colored_text "yellow" "normal" "ip_forward disabled, Core can not toke over public traffic."
  fi
}

is_docker() {
  # 检查 /proc/1/cgroup 文件中是否有 docker 或 lxc 的标记
  if grep -qE '(docker|lxc)' /proc/1/cgroup 2>/dev/null; then
    return 0
  fi

  # 检查 /.dockerenv 文件是否存在
  if [ -f /.dockerenv ]; then
    return 0
  fi

  if [ -f /.dockerenv ]; then
    return 0
  fi

  if grep -q '/docker/' /proc/1/cgroup; then
    return 0
  fi

  if check_file_exists "./use_docker"; then
    return 0
  fi

  return 1
}

generate_uuid() {
  # 生成一个简单的随机字符串，包含横线
  uuid="$RANDOM$RANDOM-$RANDOM-$RANDOM-$RANDOM$RANDOM$RANDOM"
  echo "$uuid"
}

check_file_exists() {
  if [ -f "$1" ]; then
    return 0
  else
    return 1
  fi
}

init_uif_key() {
  uuid=$(generate_uuid)
  echo "$uuid" > "$UIF_DIR/uif_key.txt"
}



check_sudo
check_arch
check_system_service
check_curl
check_tar
# check_ipv4_forwarding
# check_kmodtun

get_uif_newest_version
download_uif # 下载最新版
stop_uif # 先尝试关掉
init_uif_dir
install_or_update_uif # 安装或更新（不会覆盖已有配置）
download_and_install_system_service
init_api_port
init_web_port
# init_uif_key
run_uif

if is_docker; then
  print_colored_text "green" "bold" "Docker Build OK.\nRun: docker run -d --name UIF_container --network host UIF_image\n"
else
  print_colored_text "green" "bold" "\nWeb Address:\thttp://$(get_public_ip):$web_port\nAPI Address:\thttp://$(get_public_ip):$api_port\nPassword:\t$(cat "$UIF_DIR/uif_key.txt")\n"
fi

