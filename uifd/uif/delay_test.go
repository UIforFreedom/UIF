package uif

import (
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Foo(w http.ResponseWriter, r *http.Request) {

}

func TestDelay(t *testing.T) {
	api := http.HandlerFunc(Foo)
	APIServer := http.Server{
		Addr:    "127.0.0.1:9787",
		Handler: api,
	}
	go APIServer.ListenAndServe()
	defer APIServer.Close()

	assert.Equal(t, "127.0.0.1:9413", GetAPIAddress())
	assert.Equal(t, "127.0.0.1:9527", GetWebAddress())

	port, _ := GetWebAddressPort()
	assert.Equal(t, "9527", port)

	port, _ = GetAPIAddressPort()
	assert.Equal(t, "9413", port)
}
