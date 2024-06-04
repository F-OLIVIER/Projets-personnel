package utils

import (
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{}

func SendMessage(message string) error {
	// Connect to the WebSocket server
	conn, _, err := websocket.DefaultDialer.Dial("ws://localhost:8081", nil)
	if err != nil {
		return err
	}
	defer conn.Close()

	// Send the message
	err = conn.WriteMessage(websocket.TextMessage, []byte(message))
	if err != nil {
		return err
	}

	return nil
}
