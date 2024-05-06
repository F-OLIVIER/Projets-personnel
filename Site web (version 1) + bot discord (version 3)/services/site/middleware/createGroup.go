package utils

import (
	data "botgvg/internal"
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
)

func SaveCreateGroup(r *http.Request, database *sql.DB) {
	var listGroup data.SaveGroup
	err := json.NewDecoder(r.Body).Decode(&listGroup)
	CheckErr("Erreur de décodage JSON SaveCreateGroup", err)

	// Update List Group GvG
	stmt1, errdb := database.Prepare("DELETE FROM GroupGvG")
	CheckErr("1- DELETE - Requete DB SaveCreateGroup", errdb)
	stmt1.Exec()

	for i := 1; i < len(listGroup.ListGroup); i++ {
		currentline := listGroup.ListGroup[i]
		currentLength := len(currentline.UserToSave)
		if currentLength > 1 {
			var unit1, unit2, unit3, unit4 string
			if currentLength == 5 {
				unit1 = currentline.UserToSave[1]
				unit2 = currentline.UserToSave[2]
				unit3 = currentline.UserToSave[3]
				unit4 = currentline.UserToSave[4]
			} else if currentLength == 4 {
				unit1 = currentline.UserToSave[1]
				unit2 = currentline.UserToSave[2]
				unit3 = currentline.UserToSave[3]
				unit4 = ""
			} else if currentLength == 3 {
				unit1 = currentline.UserToSave[1]
				unit2 = currentline.UserToSave[2]
				unit3 = ""
				unit4 = ""
			} else if currentLength == 2 {
				unit1 = currentline.UserToSave[1]
				unit2 = ""
				unit3 = ""
				unit4 = ""
			} else if currentLength == 1 {
				unit1 = ""
				unit2 = ""
				unit3 = ""
				unit4 = ""
			}

			// check des unités identiques
			if unit4 == unit3 || unit4 == unit2 || unit4 == unit1 {
				unit4 = ""
			}
			if unit3 == unit2 || unit3 == unit1 {
				unit3 = ""
			}
			if unit2 == unit1 {
				unit2 = ""
			}

			username_ID := 0
			stmtUsers, errdb := database.Prepare("SELECT ID FROM Users WHERE DiscordName = ?")
			CheckErr("1- Requete DB SaveCreateGroup", errdb)
			stmtUsers.QueryRow(currentline.UserToSave[0]).Scan(&username_ID)

			if username_ID != 0 {
				groupNumber := strings.Replace(currentline.NameGroup, "group", "", 1)
				stmt2, errdb := database.Prepare("INSERT INTO GroupGvG (User_ID,GroupNumber,Unit1,Unit2,Unit3,Unit4) Values(?,?,?,?,?,?)")
				CheckErr("2- INSERT - Requete DB SaveCreateGroup", errdb)
				stmt2.Exec(username_ID, groupNumber, unit1, unit2, unit3, unit4)

			}
		}
	}

	// update NameGroup
	if len(listGroup.Namegroup) > 0 && len(listGroup.Namegroup[0]) > 0 {
		// fmt.Println("listGroup : ", listGroup.Namegroup)
		for _, arrayGroup := range listGroup.Namegroup {
			currentID := 0
			stmtID, errdb := database.Prepare("SELECT ID FROM NameGroupGvG WHERE GroupNumber = ?")
			CheckErr("1- Requete DB SELECT NameGroup (exist ?)", errdb)
			stmtID.QueryRow(arrayGroup[0]).Scan(&currentID)

			if currentID == 0 { // nom de groupe non existant
				stmtNotExist, errdb := database.Prepare("INSERT INTO NameGroupGvG (GroupNumber,NameGroup) Values(?,?)")
				CheckErr("2- Requete DB  INSERT NameGroup", errdb)
				stmtNotExist.Exec(arrayGroup[0], arrayGroup[1])
			} else { // nom de groupe existant
				stmtExist, errdb := database.Prepare("UPDATE NameGroupGvG SET NameGroup = ? WHERE GroupNumber = ?")
				CheckErr("2- Requete DB  update NameGroup", errdb)
				stmtExist.Exec(arrayGroup[1], arrayGroup[0])
			}
		}
	}

}
