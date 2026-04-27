package utils

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	data "todo_kubernetes/internal"
)

func OpenDb() *sql.DB {
	dir := filepath.Dir(data.ADRESS_DB)
	os.MkdirAll(dir, os.ModePerm)

	db, err := sql.Open("sqlite3", data.ADRESS_DB)
	if err != nil {
		fmt.Println("Error open DB (OpenDb)")
		log.Fatal(err)
	}
	return db
}

func CreateTable() {
	db := OpenDb()
	defer db.Close()

	sqlStmt := `
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        done BOOLEAN NOT NULL DEFAULT 0
    );`
	_, err := db.Exec(sqlStmt)
	if err != nil {
		fmt.Println("Error create table (CreateTable)")
		log.Fatal(err)
	}
}
