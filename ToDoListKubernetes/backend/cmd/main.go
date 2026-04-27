package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"todo_kubernetes/handlers"
	data "todo_kubernetes/internal"
	utils "todo_kubernetes/middleware"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
)

func main() {
	utils.CreateTable()

	go_minikube_ip := os.Getenv("GO_MINIKUBE_IP")

	route := mux.NewRouter()
	route.PathPrefix("/").HandlerFunc(handlers.ServeDispatch)
	cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://" + go_minikube_ip + ":3000", "http://" + go_minikube_ip + ":30001"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	handler := cors.Handler(route)
	addr := fmt.Sprintf(":%s", data.PORT)
	fmt.Printf("Server started at http://%s%s\n", go_minikube_ip, addr)
	log.Fatal(http.ListenAndServe(addr, handler))
}
