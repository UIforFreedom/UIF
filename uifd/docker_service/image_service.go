package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"time"
)

const (
	imageName   = "ui4freedom/uif:latest"  // Docker Hub 仓库的镜像名称
	tarFilePath = "uif-docker-latest.tar"  // 保存为 tar 文件的路径
	port        = ":8080"                  // HTTP 服务的端口
	fileName    = "/uif-docker-latest.tar" // HTTP 服务的端口
)

// 拉取 Docker 镜像并保存为 tar 文件
func pullDockerImage() error {
	fmt.Println("Pulling Docker image:", imageName)

	// 运行 `docker pull` 拉取镜像
	cmd := exec.Command("docker", "pull", imageName)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to pull image: %v", err)
	}

	fmt.Println("Saving Docker image as tar...")

	// 运行 `docker save` 保存为 tar 文件
	cmd = exec.Command("docker", "save", "-o", tarFilePath, imageName)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to save image: %v", err)
	}

	fmt.Println("Docker image saved as:", tarFilePath)
	return nil
}

// 定期拉取镜像
func periodicPull(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for {
		<-ticker.C
		if err := pullDockerImage(); err != nil {
			log.Println("Error pulling image:", err)
		}
	}
}

// HTTP 处理程序，提供下载 tar 文件
func downloadHandler(w http.ResponseWriter, r *http.Request) {
	file, err := os.Open(tarFilePath)
	if err != nil {
		http.Error(w, "File not found.", http.StatusNotFound)
		return
	}
	defer file.Close()

	w.Header().Set("Content-Disposition", "attachment; filename="+fileName)
	w.Header().Set("Content-Type", "application/x-tar")
	w.Header().Set("Content-Length", fmt.Sprintf("%d", getFileSize(tarFilePath)))

	io.Copy(w, file)
}

// 获取文件大小
func getFileSize(filePath string) int64 {
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		return 0
	}
	return fileInfo.Size()
}

func main() {
	pullDockerImage()
	// 设置定期任务，每 24 小时拉取一次镜像
	go periodicPull(24 * time.Hour)

	// 启动 HTTP 服务
	http.HandleFunc("/"+fileName, downloadHandler)
	fmt.Println("Starting server on port", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
