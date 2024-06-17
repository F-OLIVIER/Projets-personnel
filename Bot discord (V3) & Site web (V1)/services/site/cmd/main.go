package main

import (
	handlers "botgvg/handlers"
	data "botgvg/internal"
	"flag"
	"fmt"
	"net/http"
)

func main() {
	// Initialisation database
	data.Createdb()

	flag.Parse()
	// Page not connected
	http.HandleFunc("/", handlers.ServeHome)

	// page de transition de connexion
	http.HandleFunc("/discord", handlers.DiscordHandler)
	http.HandleFunc("/api/discord", handlers.DiscordApiHandler)

	// Routes utilisant handlers.ApiHandler
	apiHandlerRoutes := []string{
		"/api/home",
		"/api/charactercard",
		"/api/caserne",
		"/api/majcaserne",
		"/api/creategroup",
		"/api/chargergrouptypeatt",
		"/api/chargergrouptypedef",
		"/api/CheckAppAdmin",
		"/api/statGvG",
	}
	for _, endpoint := range apiHandlerRoutes {
		http.HandleFunc(endpoint, handlers.ApiHandler)
	}

	// Routes utilisant handlers.ApiWithoutReturnHandler
	apiWithoutReturnHandlerRoutes := []string{
		"/api/logout",
		"/api/updateUserCard",
		"/api/saveGroupInDB",
		"/api/UpdateAdmin",
		"/api/adminitrateBot",
	}
	for _, endpoint := range apiWithoutReturnHandlerRoutes {
		http.HandleFunc(endpoint, handlers.ApiWithoutReturnHandler)
	}

	// Appel des fichiers annexes et les mettres en cache navigateur client autmatiquement
	cssHandler := http.StripPrefix("/css/", http.FileServer(http.Dir("./public/css/")))
	http.HandleFunc("/css/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "max-age=31536000, only-if-cached")
		cssHandler.ServeHTTP(w, r)
	})

	jsHandler := http.StripPrefix("/js/", http.FileServer(http.Dir("./public/js/")))
	http.HandleFunc("/js/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "max-age=31536000, only-if-cached")
		jsHandler.ServeHTTP(w, r)
	})

	imgHandler := http.StripPrefix("/img/", http.FileServer(http.Dir("./public/images/")))
	http.HandleFunc("/img/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "max-age=31536000, only-if-cached")
		imgHandler.ServeHTTP(w, r)
	})

	fmt.Println("Server started at : http://" + data.SITE_DOMAIN + ":" + data.PORT)

	// Mise en écoute du serveur HTTP
	http.ListenAndServe(":"+data.PORT, nil)
}
