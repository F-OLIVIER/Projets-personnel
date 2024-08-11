package utils

import (
	data "botgvg/internal"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

// Fonction qui récupérer les informations utilisateur à partir de son uuid
// user_id, DiscordName, DiscordPhoto, officier := UserInfo(uuid, database)
func UserInfo(uuid string, database *sql.DB) (user_id, DiscordName, DiscordPhoto string, officier bool) {
	if uuid != "" {
		usedcookie, errdb := database.Prepare("SELECT ID, DiscordName, DiscordRole, DiscordPhoto FROM Users WHERE uuid = ?")
		CheckErr("Requete DB UserInfo", errdb)
		var DiscordRole string
		usedcookie.QueryRow(uuid).Scan(&user_id, &DiscordName, &DiscordRole, &DiscordPhoto)
		if DiscordRole == "Officier" {
			return user_id, DiscordName, DiscordPhoto, true
		}
	}
	return user_id, DiscordName, DiscordPhoto, false
}

func Charactercard(uuid string, database *sql.DB) (userInfo data.UserInfo) {
	stmt1, errdb := database.Prepare("SELECT ID, DiscordName, DiscordRole, DiscordPhoto, GameCharacter_ID, Lvl, Influence, EtatInscription, NbGvGParticiped, NbTotalGvG, DateLastGvGParticiped FROM Users WHERE uuid = ?")
	CheckErr("1- Requete DB UserInfo", errdb)
	var DiscordRole string
	stmt1.QueryRow(uuid).Scan(&userInfo.ID, &userInfo.DiscordUsername, &DiscordRole, &userInfo.DiscordPhoto, &userInfo.GameCharacter_ID, &userInfo.Lvl, &userInfo.Influence, &userInfo.EtatInscription, &userInfo.NbGvGParticiped, &userInfo.NbTotalGvG, &userInfo.DateLastGvGParticiped)

	if userInfo.GameCharacter_ID != 0 {
		stmt2, errdb := database.Prepare("SELECT ClasseFR FROM ListGameCharacter WHERE ID = ?")
		CheckErr("2- Requete DB UserInfo", errdb)
		stmt2.QueryRow(userInfo.GameCharacter_ID).Scan(&userInfo.GameCharacter)
	} else {
		userInfo.GameCharacter = "Non sélectionné"
	}

	if DiscordRole == "Officier" {
		return userInfo
	}
	return userInfo
}

func UpdateCharacter(r *http.Request, uuid string, database *sql.DB) {
	if uuid != "" {
		var newUserInfo data.UserInfo
		err := json.NewDecoder(r.Body).Decode(&newUserInfo)
		CheckErr("Erreur de décodage JSON UpdateCharacter", err)

		if newUserInfo.GameCharacter != "" {
			stmt1, errdb := database.Prepare("SELECT ID FROM ListGameCharacter WHERE ClasseFR = ?")
			CheckErr("1- Requete DB UpdateCharacter", errdb)
			stmt1.QueryRow(newUserInfo.GameCharacter).Scan(&newUserInfo.GameCharacter_ID)
		}

		if newUserInfo.Influence != "" && newUserInfo.Lvl != "" && newUserInfo.GameCharacter != "" {
			// les 3 sont saisies (Class + Lvl + Influence)
			stmt2, errdb := database.Prepare("UPDATE Users SET GameCharacter_ID = ?, Lvl = ?, Influence = ? WHERE uuid = ?")
			CheckErr("2- Requete DB UpdateCharacter", errdb)
			stmt2.Exec(newUserInfo.GameCharacter_ID, newUserInfo.Lvl, newUserInfo.Influence, uuid)
		} else if newUserInfo.Influence != "" && newUserInfo.Lvl != "" {
			// Lvl + Influence
			stmt2, errdb := database.Prepare("UPDATE Users SET Lvl = ?, Influence = ? WHERE uuid = ?")
			CheckErr("3- Requete DB UpdateCharacter", errdb)
			stmt2.Exec(newUserInfo.Lvl, newUserInfo.Influence, uuid)
		} else if newUserInfo.Influence != "" && newUserInfo.GameCharacter != "" {
			// Class + Influence
			stmt2, errdb := database.Prepare("UPDATE Users SET GameCharacter_ID = ?, Influence = ? WHERE uuid = ?")
			CheckErr("4- Requete DB UpdateCharacter", errdb)
			stmt2.Exec(newUserInfo.GameCharacter_ID, newUserInfo.Influence, uuid)
		} else if newUserInfo.Lvl != "" && newUserInfo.GameCharacter != "" {
			// Class + Lvl
			stmt2, errdb := database.Prepare("UPDATE Users SET GameCharacter_ID = ?, Lvl = ? WHERE uuid = ?")
			CheckErr("5- Requete DB UpdateCharacter", errdb)
			stmt2.Exec(newUserInfo.GameCharacter_ID, newUserInfo.Lvl, uuid)
		} else if newUserInfo.GameCharacter != "" {
			// Class
			stmt2, errdb := database.Prepare("UPDATE Users SET GameCharacter_ID = ? WHERE uuid = ?")
			CheckErr("6- Requete DB UpdateCharacter", errdb)
			stmt2.Exec(newUserInfo.GameCharacter_ID, uuid)
		} else if newUserInfo.Lvl != "" {
			// Lvl
			stmt2, errdb := database.Prepare("UPDATE Users SET Lvl = ? WHERE uuid = ?")
			CheckErr("7- Requete DB UpdateCharacter", errdb)
			stmt2.Exec(newUserInfo.Lvl, uuid)
		} else if newUserInfo.Influence != "" {
			// Influence
			stmt2, errdb := database.Prepare("UPDATE Users SET Influence = ? WHERE uuid = ?")
			CheckErr("8- Requete DB UpdateCharacter", errdb)
			stmt2.Exec(newUserInfo.Influence, uuid)
		}

		if newUserInfo.EtatInscription == 1 || newUserInfo.EtatInscription == 3 { // 1: s'incrit present, 3: s'inscrit absent
			stmt3, errdb := database.Prepare("UPDATE Users SET EtatInscription = ? WHERE uuid = ?")
			CheckErr("9- Requete DB UpdateCharacter", errdb)
			stmt3.Exec(newUserInfo.EtatInscription, uuid)
		}
	}
}

func ListInscriptedUsers(database *sql.DB) (UsersIncripted []data.UserInfo) {
	listUnit, err := database.Prepare(`SELECT ID, ConnectedSite, GameCharacter_ID, DiscordName, Lvl, Influence, NbGvGParticiped, DateLastGvGParticiped
										FROM Users
										WHERE Users.EtatInscription = '1';
										`)
	CheckErr("1- Requete DB fonction ListInscriptedusers", err)
	rows, err := listUnit.Query()
	CheckErr("2- Requete DB fonction ListInscriptedusers", err)
	for rows.Next() {
		var user data.UserInfo
		err = rows.Scan(&user.ID, &user.ConnectedSite, &user.GameCharacter_ID, &user.DiscordUsername, &user.Lvl, &user.Influence, &user.NbGvGParticiped, &user.DateLastGvGParticiped)
		CheckErr("3- Requete DB fonction ListInscriptedusers", err)

		if user.GameCharacter_ID != 0 {
			class, errdb := database.Prepare("SELECT ClasseFR FROM ListGameCharacter WHERE ID = ?")
			CheckErr("Requete DB UserInfo", errdb)
			class.QueryRow(user.GameCharacter_ID).Scan(&user.GameCharacter)
		}

		listUnitUser := CaserneUser(strconv.Itoa(user.ID), database)
		var newListunitUser []data.Unit
		for i := 0; i < len(listUnitUser); i++ {
			if listUnitUser[i].Lvl != "" {
				newListunitUser = append(newListunitUser, listUnitUser[i])
			}
		}
		user.UserCaserne = newListunitUser
		UsersIncripted = append(UsersIncripted, user)
	}

	// fmt.Println("UsersIncripted : \n", UsersIncripted)
	return UsersIncripted
}

func AllCaserne(database *sql.DB) (ListInscripted []data.UserInfo) {
	listUnit, err := database.Prepare(`SELECT ID, DiscordName, Lvl, Influence FROM Users;`)
	CheckErr("1- Requete DB fonction AllCaserne", err)
	rows, err := listUnit.Query()
	CheckErr("2- Requete DB fonction AllCaserne", err)
	for rows.Next() {
		var user data.UserInfo
		err = rows.Scan(&user.ID, &user.DiscordUsername, &user.Lvl, &user.Influence)
		CheckErr("3- Requete DB fonction AllCaserne", err)

		listUnitUser := CaserneUser(strconv.Itoa(user.ID), database)
		var newListunitUser []data.Unit
		for i := 0; i < len(listUnitUser); i++ {
			if listUnitUser[i].Lvl == "" {
				listUnitUser[i].Lvl = "0"
			}
			newListunitUser = append(newListunitUser, listUnitUser[i])
		}
		user.UserCaserne = newListunitUser
		ListInscripted = append(ListInscripted, user)
	}

	// fmt.Println("ListInscripted : \n", ListInscripted)
	return ListInscripted
}

func GroupGvG(database *sql.DB, nameTable string) (listUserAlreadyRegistered []data.UserGvG) {
	listUnit, err := database.Prepare("SELECT User_ID, GroupNumber, Unit1, Unit2, Unit3, Unit4 FROM " + nameTable)
	CheckErr("1- Requete DB fonction GroupGvG", err)
	rows, err := listUnit.Query()
	CheckErr("2- Requete DB fonction GroupGvG", err)
	for rows.Next() {
		var user data.UserGvG
		err = rows.Scan(&user.User_ID, &user.GroupNumber, &user.Unit1, &user.Unit2, &user.Unit3, &user.Unit4)
		CheckErr("3- Requete DB fonction GroupGvG", err)

		stmt, errdb := database.Prepare("SELECT DiscordName FROM Users WHERE ID = ?")
		CheckErr("4- Requete DB fonction GroupGvG", errdb)
		stmt.QueryRow(user.User_ID).Scan(&user.Username)

		listUserAlreadyRegistered = append(listUserAlreadyRegistered, user)
	}

	return listUserAlreadyRegistered
}

func NameGroupGvG(database *sql.DB) map[int]string {
	listNameGroup := make(map[int]string)
	listName, err := database.Prepare(`SELECT GroupNumber, NameGroup FROM NameGroupGvG`)
	CheckErr("1- Requete DB fonction NameGroupGvG", err)
	rows, err := listName.Query()
	CheckErr("2- Requete DB fonction NameGroupGvG", err)
	for rows.Next() {
		var GroupNumber int
		var NameGroup string
		err = rows.Scan(&GroupNumber, &NameGroup)
		CheckErr("3- Requete DB fonction NameGroupGvG", err)
		listNameGroup[GroupNumber] = NameGroup
	}
	return listNameGroup
}

func ListClass(database *sql.DB) (listClass []string) {
	stmtlistclass, err := database.Prepare(`SELECT ClasseFR FROM ListGameCharacter;`)
	CheckErr("1- Requete DB fonction ListClass", err)
	rows, err := stmtlistclass.Query()
	CheckErr("2- Requete DB fonction ListClass", err)
	for rows.Next() {
		var class string
		err = rows.Scan(&class)
		CheckErr("3- Requete DB fonction ListClass", err)
		listClass = append(listClass, class)
	}
	return listClass
}

func BotActivation(database *sql.DB) bool {
	usedcookie, errdb := database.Prepare("SELECT Allumage FROM GestionBot WHERE ID = ?")
	CheckErr("Requete DB UserInfo", errdb)
	var Allumage int
	usedcookie.QueryRow(1).Scan(&Allumage)

	if Allumage == 0 {
		return true
	} else {
		return false
	}
}

func UpdateAdministration(r *http.Request, database *sql.DB) {
	var datajson data.AdministrateBot
	err := json.NewDecoder(r.Body).Decode(&datajson)
	CheckErr("Erreur de décodage JSON SaveCreateGroup", err)

	if datajson.Allumage != "" { // changement de l'etat du bot
		newAllumage := 0
		if datajson.Allumage == "false" {
			newAllumage = 1
		}
		stmt, err := database.Prepare("UPDATE GestionBot SET Allumage = ? WHERE ID = 1")
		CheckErr("Update Allumage UpdateAdministration ", err)
		stmt.Exec(newAllumage)

		if newAllumage == 0 {
			message := data.SocketMessage{
				Type: "activatebot",
			}
			SendMessage(message)
		} else {
			message := data.SocketMessage{
				Type: "desactivatebot",
			}
			SendMessage(message)
		}
	} else if datajson.Resetnbgvg { // reset des stat GvG
		stmt, err := database.Prepare(`UPDATE Users SET NbGvGParticiped = 0, NbTotalGvG = 0;`)
		CheckErr("Update Resetnbgvg UpdateAdministration", err)
		stmt.Exec()
	} else if datajson.NewWeapon != "" { // ajout d'une nouvelle arme de héros
		// insertion de la nouvelle arme dans la db
		stmt, err := database.Prepare(`INSERT INTO ListGameCharacter(ClasseFR) VALUES(?);`)
		CheckErr("1- INSERT NewWeapon in UpdateAdministration ", err)
		stmt.Exec(datajson.NewWeapon)
		message := data.SocketMessage{
			Type:    "newclass",
			Content: datajson.NewWeapon,
		}
		SendMessage(message)
	}
}

func UploadInformationsBot(r *http.Request, database *sql.DB) {
	err := r.ParseMultipartForm(10 << 20) // 10 MB maximum
	if err == nil {
		// Récupérez les données JSON du formulaire
		jsonData := r.PostFormValue("data")
		if jsonData != "" {
			// Parsez les données JSON
			var formData data.AdministrateBot
			err = json.Unmarshal([]byte(jsonData), &formData)
			CheckErr("UploadInformationsBot: Erreur lors de la lecture des données JSON", err)
			// fmt.Println("formData : ", formData)

			file, header, err := r.FormFile("image")
			if err == nil {
				defer file.Close()
				UploadPicture(file, header, "./public/images/unit/"+header.Filename)
				if formData.CreateUnit.Name != "" { // création d'une unité
					createNewUnit(formData.CreateUnit, "./img/unit/"+header.Filename, database)
					message := data.SocketMessage{
						Type:    "newunit",
						Content: formData.CreateUnit.Name,
					}
					SendMessage(message)
				} else if formData.ChangeUnit.Name != "" { // Update de l'image d'une unit
					updateImgUnit(formData.ChangeUnit, "./img/unit/"+header.Filename, database)
				}
			}

			if formData.ChangeUnit.LvlMax != "" || formData.ChangeUnit.Influence != "" || formData.ChangeUnit.Maitrise != "" { // Update des data d'une unit
				updateDataUnit(formData.ChangeUnit, database)
			}
		} else {
			fmt.Println("UploadInformationsBot: Probléme dans la récupération des données JSON")
		}
	} else {
		CheckErr("UploadInformationsBot: Impossible de traiter le formulaire\n", err)
	}
}

func createNewUnit(dataCreateUnit data.Unit, filepath string, database *sql.DB) {
	// insertion de l'unité dans la table ListUnit
	stmt, err := database.Prepare(`INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,TypeUnit,ForceUnit,Img) VALUES(?,?,?,?,?,?);`)
	CheckErr("1- INSERT createNewUnit ", err)
	stmt.Exec(dataCreateUnit.Name, dataCreateUnit.Influence, dataCreateUnit.LvlMax, dataCreateUnit.Type, dataCreateUnit.Tier, filepath)

	// ajout de la colonne de l'unité dans la caserne
	// nombre de colonne -1
	nbColum := 0
	stmtNbColum, err := database.Prepare(`SELECT count(*) FROM pragma_table_info('Caserne');`)
	CheckErr("2- nbColum createNewUnit ", err)
	stmtNbColum.QueryRow().Scan(&nbColum)

	if nbColum > 0 {
		// ajout de la colonne dans la table Caserne
		queryCaserne := fmt.Sprintf("ALTER TABLE Caserne ADD COLUMN %s INTEGER DEFAULT 0;", "Unit"+strconv.Itoa(nbColum-1))
		stmtColumCaserne, err := database.Prepare(queryCaserne)
		CheckErr("3- ALTER TABLE Caserne createNewUnit ", err)
		stmtColumCaserne.Exec()

		// ajout de la colonne dans la table CaserneMaitrise
		queryCaserneMaitrise := fmt.Sprintf("ALTER TABLE CaserneMaitrise ADD COLUMN %s INTEGER DEFAULT 0;", "Unit"+strconv.Itoa(nbColum-1))
		stmtColumCaserneMaitrise, err := database.Prepare(queryCaserneMaitrise)
		CheckErr("3- ALTER TABLE CaserneMaitrise createNewUnit ", err)
		stmtColumCaserneMaitrise.Exec()
	}
}

func updateImgUnit(dataCreateUnit data.Unit, filepath string, database *sql.DB) {
	if dataCreateUnit.Name != "" {
		stmt, err := database.Prepare(`UPDATE ListUnit SET Img = ? WHERE Unit = ?;`)
		CheckErr("Update Allumage ActivateOrNotBotInDB ", err)
		fmt.Println("filepath, dataCreateUnit.ID", filepath, dataCreateUnit.ID)
		stmt.Exec(filepath, dataCreateUnit.Name)
	}
}

func updateDataUnit(dataCreateUnit data.Unit, database *sql.DB) {
	if dataCreateUnit.Influence != "" {
		stmt, err := database.Prepare(`UPDATE ListUnit SET InfuenceMax = ? WHERE Unit = ?;`)
		CheckErr("2- Update updateDataUnit ", err)
		stmt.Exec(dataCreateUnit.Influence, dataCreateUnit.Name)
	}

	if dataCreateUnit.LvlMax != "" {
		stmt, err := database.Prepare(`UPDATE ListUnit SET LvlMax = ? WHERE Unit = ?;`)
		CheckErr("3- Update updateDataUnit ", err)
		stmt.Exec(dataCreateUnit.LvlMax, dataCreateUnit.Name)
	}

	if dataCreateUnit.Maitrise != "" {
		stmtMaitrise, errdb := database.Prepare("SELECT Maitrise FROM ListUnit WHERE Unit = ?")
		CheckErr("4- Update Maitrise updateDataUnit", errdb)
		var currentMaitrise, newMaitrise int
		stmtMaitrise.QueryRow(dataCreateUnit.Name).Scan(&currentMaitrise)
		if currentMaitrise == 0 {
			newMaitrise = 1
		} else {
			newMaitrise = 0
		}

		stmt, err := database.Prepare(`UPDATE ListUnit SET Maitrise = ? WHERE Unit = ?;`)
		CheckErr("5- Update Maitrise updateDataUnit ", err)
		stmt.Exec(newMaitrise, dataCreateUnit.Name)
	}
}

func SendStatGvG(database *sql.DB) (listuser []data.UserInfo) {
	listUser, err := database.Prepare(`SELECT ID, ConnectedSite, DiscordName, GameCharacter_ID, Lvl, Influence, EtatInscription, NbGvGParticiped, NbTotalGvG, DateLastGvGParticiped FROM Users;`)
	CheckErr("1- Requete DB fonction SendStatGvG", err)
	rows, err := listUser.Query()
	CheckErr("2- Requete DB fonction SendStatGvG", err)
	for rows.Next() {
		var user data.UserInfo
		var user_ID int
		err = rows.Scan(&user_ID, &user.ID, &user.DiscordUsername, &user.GameCharacter_ID, &user.Lvl, &user.Influence, &user.EtatInscription, &user.NbGvGParticiped, &user.NbTotalGvG, &user.DateLastGvGParticiped)
		CheckErr("3- Requete DB fonction SendStatGvG", err)

		if user.GameCharacter_ID != 0 {
			class, errdb := database.Prepare("SELECT ClasseFR FROM ListGameCharacter WHERE ID = ?")
			CheckErr("Requete DB SendStatGvG", errdb)
			class.QueryRow(user.GameCharacter_ID).Scan(&user.GameCharacter)
		}
		user.ListDateGvG = getHistoryUserInfo(user_ID, database)
		listuser = append(listuser, user)
	}
	return listuser
}

func getHistoryUserInfo(user_ID int, database *sql.DB) (listDateGvG [][]string) {
	dateGvG, err := database.Prepare(`SELECT DateGvG, Valid FROM HistoryGvG WHERE User_ID = ?;`)
	CheckErr("1- Requete DB fonction GetHistoryUserInfo", err)
	rows, err := dateGvG.Query(user_ID)
	CheckErr("2- Requete DB fonction GetHistoryUserInfo", err)
	for rows.Next() {
		var date, valid string
		err = rows.Scan(&date, &valid)
		CheckErr("3- Requete DB fonction GetHistoryUserInfo", err)
		listDateGvG = append(listDateGvG, []string{valid, date})
	}
	return listDateGvG
}
