package handlers

import (
	"net/http"
	"strings"
	utils "todo_kubernetes/middleware"
)

func ServeDispatch(w http.ResponseWriter, r *http.Request) {
	switch {
	case r.URL.Path == "/todos" && r.Method == "GET":
		utils.GetTodos(w, r)

	case r.URL.Path == "/todos" && r.Method == "POST":
		utils.CreateTodo(w, r)

	case strings.HasPrefix(r.URL.Path, "/todos/"):
		id := strings.TrimPrefix(r.URL.Path, "/todos/")

		switch r.Method {
		case "PUT":
			utils.ValidTodo(w, r, id)
		case "DELETE":
			utils.DeleteTodo(w, r, id)
		default:
			http.Error(w, "Méthode non supportée", http.StatusMethodNotAllowed)
		}

	default:
		http.NotFound(w, r)
	}
}
