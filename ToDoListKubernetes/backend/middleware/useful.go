package utils

import (
	"fmt"
	"log"
	"os"
)

func CheckErr(str string, err error) {
	if err != nil {
		fmt.Printf("ERROR : %v\n%v\n__________________________________________\n", str, err)

		logFile, fileErr := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
		if fileErr != nil {
			log.Fatalf("Erreur lors de l'ouverture du fichier de log : %v", fileErr)
		}
		defer logFile.Close()
		log.SetOutput(logFile)
		log.Printf("ERROR: %s - %v\n__________________________________________\n", str, err)
	}
}
