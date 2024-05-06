package data

import (
	"database/sql"
	"fmt"
	"os"
)

func Createdb() {
	database, err := sql.Open("sqlite3", "../database/databaseGvG.db")
	CheckErr(err, "1- Err open db in Createdb")

	// create table
	scriptSQL, err := os.ReadFile("../database/script.sql")
	CheckErr(err, "2- open file script.sql")
	_, err = database.Exec(string(scriptSQL))
	CheckErr(err, "2- Err open db in Createdb")

	// Insert base element

	// Insert first ID message
	idFirstMessage := database.QueryRow("SELECT ID FROM GestionBot WHERE ID = 1").Scan()
	if idFirstMessage == sql.ErrNoRows {
		requestInsert := `
        INSERT INTO GestionBot(Allumage,IDMessageGvG) VALUES(0,1206146217592225792)`
		_, err = database.Exec(requestInsert)
		CheckErr(err, "3- Err Insert first ID message in Createdb")
	}

	// Insert class
	idClass := database.QueryRow("SELECT ID FROM ListGameCharacter WHERE ClasseFR = 'Pique'").Scan()
	if idClass == sql.ErrNoRows {
		requestInsert := `
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Arc court');
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Arc long');
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Lames jumelles');
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Épée courte & bouclier');
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Épée longue & bouclier');
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Guandao');
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Hache d''arme');
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Lance');
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Mousquet');
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Nodashi');
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Masse de guerre');
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Dague à chaine (cimeterre)');
        INSERT INTO ListGameCharacter(ClasseFR) VALUES('Pique');`
		_, err = database.Exec(requestInsert)
		CheckErr(err, "4- Err Insert class in Createdb")
	}

	// Insert base unit
	idbaseUnit := database.QueryRow("SELECT ID FROM ListUnit WHERE Unit = 'Yeomen'").Scan()
	if idbaseUnit == sql.ErrNoRows {
		requestInsert := `
        -- Unité Infanterie
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Hallebardiers',165,18,1,'Infanterie','T3','./img/unit/hallebardiers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Fils de Fenrir',175,18,0,'Infanterie','T3','./img/unit/filsFenrir.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Piquiers du Wuxing',155,18,0,'Infanterie','T3','./img/unit/piquiersWuxing.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Piquiers impériaux',240,24,1,'Infanterie','T4','./img/unit/piquiersImperiaux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Fortebraccio',235,24,0,'Infanterie','T4','./img/unit/piquiersFortebraccio.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Prévôts hallebardiers',230,24,1,'Infanterie','T4','./img/unit/prevot_hallebardier.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gardes du palais',235,24,1,'Infanterie','T4','./img/unit/gardesPalais.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Azaps',240,24,0,'Infanterie','T4','./img/unit/azaps.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Tseregs',235,24,0,'Infanterie','T4','./img/unit/tseregs.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Pillard fendeurs',240,24,0,'Infanterie','T4','./img/unit/pilardsFendeurs.jpg');	
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Housecarls',240,24,0,'Infanterie','T4','./img/unit/housecarls.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Claymores',245,24,0,'Infanterie','T4','./img/unit/claymores.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Paladin symmachéen',245,24,0,'Infanterie','T4','./img/unit/paladinsSymmacheens.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Berserkers',245,24,0,'Infanterie','T4','./img/unit/berserkers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Lanciers impériaux',230,24,1,'Infanterie','T4','./img/unit/lanciers_imperiaux.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Fidèles symmachéen',240,24,0,'Infanterie','T4','./img/unit/fidelesSymmacheens.jpg');	
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Mirmillons',245,24,0,'Infanterie','T4','./img/unit/mirmillons.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Vigile grisonnants',200,24,0,'Infanterie','T4','./img/unit/vigilesGrisonnants.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Javeliniers impériaux',240,24,1,'Infanterie','T4','./img/unit/javeliniersImperiaux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Prévôts javeliniers',230,24,1,'Infanterie','T4','./img/unit/prevotsJaveliniers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Prévôts lanciers',215,24,0,'Infanterie','T4','./img/unit/prevotsLanciers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Moines au croissant',250,24,0,'Infanterie','T4','./img/unit/moinesCroissant.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Onna-bugeishas',235,24,0,'Infanterie','T4','./img/unit/onnaBugeishas.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Hommes d''armes',215,24,0,'Infanterie','T4','./img/unit/hommesArmes.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Silahdars',320,30,0,'Infanterie','T5','./img/unit/silahdar.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Skjaldmös',310,30,0,'Infanterie','T5','./img/unit/valkyrie.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Fauchefers',315,30,0,'Infanterie','T5','./img/unit/fauchefer.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gardes modao',315,30,0,'Infanterie','T5','./img/unit/modao.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Samouraï sorochis',295,30,0,'Infanterie','T5','./img/unit/samouraisOrochis.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Zweihanders',310,30,0,'Infanterie','T5','./img/unit/Zweihanders.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Alchimistes',60,18,0,'Infanterie','T3','./img/unit/alchimistes.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Condottières',160,18,0,'Infanterie','T3','./img/unit/condottieres.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cornemuseurs',90,18,0,'Infanterie','T3','./img/unit/cornemuseurs.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Dimachères',165,18,0,'Infanterie','T3','./img/unit/dimacheres.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Écuyers',155,18,0,'Infanterie','T3','./img/unit/ecuyers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gardes Préfectoraux',170,18,1,'Infanterie','T3','./img/unit/gardesPrefectoraux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gardes varègues',290,30,0,'Infanterie','T5','./img/unit/gardesVaregues.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gardes de Wuwai',225,24,0,'Infanterie','T4','./img/unit/gardesWuwei.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gonfalonniers',225,24,0,'Infanterie','T4','./img/unit/gonfalonniers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Hashashins',295,30,0,'Infanterie','T5','./img/unit/hashashins.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Jangjus',170,30,0,'Infanterie','T3','./img/unit/jangjus.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Lanciers du dragon noir',80,20,0,'Infanterie','T3','./img/unit/lanciersDragonNoir.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Lanciers tête-de-fer',130,18,1,'Infanterie','T3','./img/unit/lanciersTeteDeFer.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Moines guerriers',145,18,0,'Infanterie','T3','./img/unit/moinesGuerriers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Naginata',125,20,0,'Infanterie','T3','./img/unit/naginata.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Gardes royaux de Perceval',225,24,0,'Infanterie','T4','./img/unit/percevalJav.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Piquiers du dragon noir',80,20,0,'Infanterie','T3','./img/unit/piquiersDragonNoir.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Piquiers préfectoraux',165,18,0,'Infanterie','T3','./img/unit/piquiersPrefectoraux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Prévôts marteleurs',150,18,1,'Infanterie','T3','./img/unit/prevotsMarteleurs.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Chavaliers de la Reine',295,30,0,'Infanterie','T5','./img/unit/queenKnight.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Rétiaires',305,30,0,'Infanterie','T5','./img/unit/retiaires.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Ronins',145,18,0,'Infanterie','T3','./img/unit/ronins.jpg');

        -- Unité Distant
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Milice zykalienne',175,15,0,'Distant','T3','./img/unit/miliceZykalienne.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Pyro-archers',180,18,0,'Distant','T3','./img/unit/pyroArchers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Jannisaires',190,19,0,'Distant','T3','./img/unit/janissaires.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Schutzdieners',155,18,0,'Distant','T3','./img/unit/schutzdieners.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers gallos',245,24,0,'Distant','T4','./img/unit/archer_gallos.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers impériaux',255,24,0,'Distant','T4','./img/unit/archersImperiaux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arquebusiers du Krieskrat',255,24,1,'Distant','T4','./img/unit/arquebusiersKriegsrat.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arquebusiers impériaux',255,24,0,'Distant','T4','./img/unit/arquebusiersImperiaux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Siphonaros',330,30,0,'Distant','T5','./img/unit/siphonaros.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Falconetti',330,30,0,'Distant','T5','./img/unit/falconetti.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Veneurs',320,30,0,'Distant','T5','./img/unit/veneurs.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arbalétriers pavoiseurs',325,30,0,'Distant','T5','./img/unit/arbaletrier_pavoiseur.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arquebusiers tercios',310,30,0,'Distant','T5','./img/unit/arquebusiersTercios.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Grenadier de Shenji',315,30,0,'Distant','T5','./img/unit/grenadier_de_shenji.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arbalétriers avant-garde',160,18,0,'Distant','T3','./img/unit/arbaletriersAvantGarde.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arbalétriers à plumes',150,18,0,'Distant','T3','./img/unit/arbaletriersPlumes.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers avant-garde',150,18,0,'Distant','T3','./img/unit/archersAvantGarde.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers de namkhan',180,18,0,'Distant','T3','./img/unit/archersNamkhan.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers préfectoraux',180,18,0,'Distant','T3','./img/unit/archersPrefectoraux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Archers vipères',155,18,0,'Distant','T3','./img/unit/archersViperes.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arquebusiers Ashigarus',205,24,0,'Distant','T4','./img/unit/arquebusiersAshigarus.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Arquebusiers domaine',170,18,0,'Distant','T4','./img/unit/arquebusiersDomaine.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Faucheurs Épieurs des Mers',80,20,0,'Distant','T4','./img/unit/faucheursEpieursMers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Javeliniers du dragon noir',80,20,0,'Distant','T3','./img/unit/javeliniersDragonNoir.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Maîtres de la chu ko nu',175,18,0,'Distant','T3','./img/unit/maitresChuKoNu.jpg');

        -- Unité Cavalerie
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Chevaucheurs',180,18,0,'Cavalerie','T3','./img/unit/chevaucheurs.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Pionniers du Selem',150,18,0,'Cavalerie','T3','./img/unit/pionniersSelem.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Lancier avec esponton',240,24,0,'Cavalerie','T4','./img/unit/lanciersEsponton.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cavaliers lourds préfectoraux',240,24,0,'Cavalerie','T4','./img/unit/cavaliersLourdsPrefectoraux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Lanciers ribauds',240,24,0,'Cavalerie','T4','./img/unit/lanciersRibauds.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cavaliers kevthuuls',245,24,0,'Cavalerie','T4','./img/unit/cavaliersKevthuuls.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cyphaux',215,24,0,'Cavalerie','T4','./img/unit/cyphaux.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Chamelier lanciers',225,24,0,'Cavalerie','T4','./img/unit/chameliersLanciers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Kriegsbruders',230,24,0,'Cavalerie','T4','./img/unit/kriegsbruders.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cataphractaires lanciers',310,30,0,'Cavalerie','T5','./img/unit/cataphractairesLanciers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Hussards ailés',315,30,0,'Cavalerie','T5','./img/unit/hussardsAiles.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Eclaireurs de Liao',315,30,0,'Cavalerie','T5','./img/unit/eclaireursLiao.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Kheshigs',310,30,0,'Cavalerie','T5','./img/unit/kheshigs.PNG');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Templiers',305,30,0,'Cavalerie','T5','./img/unit/templiers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Maître de la chu ko nu montés',305,30,0,'Cavalerie','T5','./img/unit/maitresChuKoNuMontes.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Bannerets',340,30,0,'Cavalerie','T5','./img/unit/bannerets.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cavaliers de Yanyuedao',320,30,0,'Cavalerie','T5','./img/unit/cavaliersYanyuedao.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cavaliers de Caradoc',195,18,0,'Cavalerie','T3','./img/unit/caradocCav.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Cavaliers lourds de Xuanjia',305,30,0,'Cavalerie','T5','./img/unit/cavaliersLourdsXuanjia.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('khorchins',140,18,0,'Cavalerie','T3','./img/unit/khorchins.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Pyro-lanciers',285,30,0,'Cavalerie','T5','./img/unit/pyroLanciers.jpg');
        INSERT INTO ListUnit(Unit,InfuenceMax,LvlMax,Maitrise,TypeUnit,ForceUnit,Img) VALUES('Yeomen',225,24,0,'Cavalerie','T4','./img/unit/yeomen.jpg');`
		_, err = database.Exec(requestInsert)
		CheckErr(err, "5- Err Insert base unit in Createdb")
	}

	database.Close()
}

func CheckErr(err error, str string) {
	if err != nil {
		fmt.Printf("\n___________________\nERROR : %v\n%v\n", str, err)
	}
}
