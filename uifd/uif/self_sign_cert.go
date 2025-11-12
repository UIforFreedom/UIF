package uif

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"math/big"
	"time"
)

func GenerateCertificateAndKey(sni string) (string, string, error) {
	now := time.Now()
	// 2 years
	startDate := now.Add(time.Hour * -24)
	endDate := now.AddDate(2, 0, 0)

	key, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return "", "", err
	}

	serialNumber, err := rand.Int(rand.Reader, new(big.Int).Lsh(big.NewInt(1), 128))
	if err != nil {
		return "", "", err
	}

	template := &x509.Certificate{
		NotBefore: startDate,
		NotAfter:  endDate,

		BasicConstraintsValid: true,
		SerialNumber:          serialNumber,

		KeyUsage:    x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature,
		ExtKeyUsage: []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},

		Subject: pkix.Name{
			CommonName: sni,
		},
		DNSNames: []string{sni},
	}

	p, err := x509.CreateCertificate(rand.Reader, template, template, key.Public(), key)
	if err != nil {
		return "", "", err
	}

	k, err := x509.MarshalPKCS8PrivateKey(key)
	if err != nil {
		return "", "", err
	}

	return string(pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: p})),
		string(pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: k})), nil
}
