package uif

import (
	"bytes"
	"crypto/sha256"
	"encoding/base64"

	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"fmt"
	"golang.org/x/crypto/hkdf"
	"io"
)

type Protection struct {
	Key []byte
}

// 使用 HKDF 从输入密钥（UTF8编码），然后生成长度分别为 32 字节的子密钥
func NewKey(ikm string) *Protection {
	hash := sha256.New
	length := 32
	res := &Protection{}

	// 初始化 HKDF；salt(nil), ikm, 和 info(nil)
	hkdf := hkdf.New(hash, []byte(ikm), nil, nil)

	okm := make([]byte, length)
	_, err := io.ReadFull(hkdf, okm)
	if err != nil {
		return res
	}
	res.Key = okm
	return res
}

func (k *Protection) GetKeyString() string {
	r := base64.StdEncoding.EncodeToString(k.Key)
	return r
}

// 输入用 base64 编码后的密钥
func (k *Protection) CheckKey(input string) bool {
	r, err := base64.StdEncoding.DecodeString(input)
	if err != nil {
		return false
	}
	return bytes.Equal(r, k.Key)
}

// 加密函数，使用 AES-GCM 模式
func (k *Protection) Aes256Encrypt(plainText string) (string, error) {

	// 创建 AES 加密块
	block, err := aes.NewCipher(k.Key)
	if err != nil {
		return "", err
	}

	// 使用 AES-GCM 封装器
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	// 创建随机的 nonce，长度为 gcm.NonceSize()
	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	// 使用 GCM 加密并附带认证标签
	cipherText := gcm.Seal(nonce, nonce, []byte(plainText), nil)

	// 返回 Base64 编码后的密文
	return base64.StdEncoding.EncodeToString(cipherText), nil
}

// 解密函数，使用 AES-GCM 模式
func (k *Protection) Aes256Decrypt(cipherTextBase64 string) (string, error) {
	// Base64 解码密文
	cipherText, err := base64.StdEncoding.DecodeString(cipherTextBase64)
	if err != nil {
		return "", err
	}

	// 创建 AES 加密块
	block, err := aes.NewCipher(k.Key)
	if err != nil {
		return "", err
	}

	// 使用 AES-GCM 封装器
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	// 获取 nonce 大小并分离 nonce 和真正的密文
	nonceSize := gcm.NonceSize()
	if len(cipherText) < nonceSize {
		return "", fmt.Errorf("cipherText too short")
	}
	nonce, cipherText := cipherText[:nonceSize], cipherText[nonceSize:]

	// 使用 GCM 解密并认证
	plainText, err := gcm.Open(nil, nonce, cipherText, nil)
	if err != nil {
		return "", err
	}

	return string(plainText), nil
}
