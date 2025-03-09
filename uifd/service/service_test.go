package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/uif/uifd/uif"
)

func TestSetQuicLink(t *testing.T) {
	// err := SetQuicLink()
	// assert.Nil(t, err)
}

func TestCheckPort(t *testing.T) {
	_, err := uif.TCPPortCheck("4544")
	assert.NotNil(t, err)

	// err = CheckPort()
	// assert.NotNil(t, err)
}
