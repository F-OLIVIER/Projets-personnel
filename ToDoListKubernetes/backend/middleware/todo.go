package utils

import (
	"encoding/json"
	"net/http"
	data "todo_kubernetes/internal"
)

func GetTodos(w http.ResponseWriter, r *http.Request) {
	db := OpenDb()
	defer db.Close()
	rows, err := db.Query("SELECT id, title, done FROM todos")
	CheckErr("Function GetTodos", err)
	defer rows.Close()

	todos := make([]data.Todo, 0)
	for rows.Next() {
		var todo data.Todo
		rows.Scan(&todo.ID, &todo.Title, &todo.Done)
		todos = append(todos, todo)
	}
	json.NewEncoder(w).Encode(todos)
}

func CreateTodo(w http.ResponseWriter, r *http.Request) {
	var todo data.Todo
	json.NewDecoder(r.Body).Decode(&todo)

	db := OpenDb()
	defer db.Close()
	stmt, err := db.Prepare("INSERT INTO todos(title, done) VALUES(?, ?)")
	CheckErr("Function CreateTodo (stmt)", err)
	res, err := stmt.Exec(todo.Title, false)
	CheckErr("Function CreateTodo (res)", err)
	id, err := res.LastInsertId()
	CheckErr("Function CreateTodo (id)", err)
	todo.ID = int(id)
	todo.Done = false

	json.NewEncoder(w).Encode(todo)
}

func ValidTodo(w http.ResponseWriter, r *http.Request, id string) {
	db := OpenDb()
	defer db.Close()
	_, err := db.Exec("UPDATE todos SET done = NOT done WHERE id = ?", id)
	CheckErr("Function ValidTodo", err)
	w.WriteHeader(http.StatusNoContent)
}

func DeleteTodo(w http.ResponseWriter, r *http.Request, id string) {
	db := OpenDb()
	defer db.Close()
	_, err := db.Exec("DELETE FROM todos WHERE id = ?", id)
	CheckErr("Function DeleteTodo", err)
	w.WriteHeader(http.StatusNoContent)
}
