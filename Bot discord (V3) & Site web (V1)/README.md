# Bot Discord & site internet pour Conqueror's Blade

## 📝 Descriptif

Le projet permet de gérer de façon automatisée les inscriptions aux Guildes versus Guilde (GvG) des joueurs pour le jeu [Conqueror's Blade](https://conqblade.com/fr) et la préparation des batailles en créant les groupes à l'avance avec les informations nécessaires pour optimiser les groupes.<br>
Le projet se décompose en 2 partie, un bot [Discord](https://discord.com) et un site internet, les 2 applications ont en commum une base de données SQL.

**Partie 1 : le bot Discord** <br>
Le bot Discord permet aux utilisateurs de s'inscrire via Discord. Les informations d'inscription des joueurs sont enregistré dans la base de donnée SQL, les joueurs peuvent ainsi donner la plupart des informations nécessaires à la préparation des GvG.<br>
Les commandes sont enregistrées en tant que "Slash Command" Discord et sont accessibles avec une description aux utilisateurs directement sur Discord.

<table align= "center" width="95%">
    <tbody>
        <tr>
            <td><img src="./img/listcommand.png"></td>
            <td><img src="./img/data.png"></td>
        </tr>   
    </tbody>
</table>

**Partie 2 : le site internet** <br>
Seul les utilisateurs presents sur le Discord associé peuvent se connecté au site internet. Les roles Discord permettent de gérer automatiquement les accées privilégier ou non au site.
Les utilisateurs peuvent indiqué la liste des unités qu'ils ont débloquée en jeu ainsi que le niveau des unités en question. Ils peuvent également mettre à jour les informations de leur héros pour ceux qui n'apprécient pas de le faire via Discord.

Les officiers de la guilde ont accès à plusieurs onglets dont ne dispose pas un simple utilisateur, ils peuvent créer les groupes GvG pour la prochaine guerre de territoire, ils peuvent administrer le bot (activé ou désactivé des fonctions automatiques, ajouter de nouvelles unités, etc.), Ils accèdent également à une page de statistique des informations contenu dans la base de donnée.

<table align= "center" width="95%">
    <tbody>
        <tr>
            <td><img src="./img/connexion.png"></td>
            <td><img src="./img/home.png"></td>
        </tr>
        <tr>
            <td><img src="./img/caserne.png"></td>
            <td><img src="./img/charactercard.png"></td>
        </tr>
        <tr>
            <td><img src="./img/creategroup.png"></td>
            <td><img src="./img/administration.png"></td>
        </tr>    
    </tbody>
</table>

___
## ⚙️ Installation & usage

**Avant de pouvoir exécuter le programme :**<br>
- Crée votre application Discord sur la [plateforme de développement Discord](https://discord.com/developers/applications).
- Pour votre application : générer le lien d'invitation et ajouté votre bot à votre serveur Discord.
- Pour votre application : ajouter le lien redirect de votre serveur puis générer le lien OAuth2 pour le scope `identify` et mettez-le dans la variable `LINK_DISCORD` puis modofier le `response_type=code` en `response_type=token` dans le fichier `./services/site/js/config.js`, mettez y également l'adresse de votre site internet dans la variable `adressAPI`.
- Crée le fichier (variable d'environnement) `.env` pour le bot discord, dossier `./services/bot`. Dans ce fichier, mettez le `TOKEN` de l'application Discord.
- Vous devez modifier les variables globale dans les fichiers `config` pour adapter le code à votre serveur Discord. Voici les emplacements des fichiers config :</br>
    - `./services/bot/config.js`
    - `./services/site/internal/config.go`
    - `./services/site/js/config.js`

**Méthode d'éxécution :** <br>
Une méthode d'éxécutions possible sur un serveur ce fais via [Screen](https://doc.ubuntu-fr.org/screen)</br>

Lors du premier lancement, le site internet doit être exécuté en premier, car c'est lui qui crée la base de donnée. Ensuite le bot discord peut être exécuté, lors de son lancement, il va compléter la base de donnée avec les utilisateurs déjà présent sur le discord.

Pour démarrer le site internet (qui se trouve dans le dossier `./services/site`)
```sh
screen -R site_internet
sh ./launch_site.sh
# Pour detacher la console, faite `[CTRL]+[a]` suivi de `[d]`
```

Pour démarrer le bot Discord (qui se trouve dans le dossier `./services/bot`)
```sh
screen -R bot_discord
sh ./launch_bot.sh
# Pour detacher la console, faite `[CTRL]+[a]` suivi de `[d]`
```

___
## 🔗 Dépendences

**Partie 1 : le bot Discord** <br>
Le serveur utilise la version 22 de [nodeJS](https://nodejs.org/en) est les modules (dépendence) [npm](https://www.npmjs.com) version 10 suivants :<br>
- [discord.js](https://www.npmjs.com/package/discord.js)
- [discord-reactions-roles](https://www.npmjs.com/package/discord-reactions-roles)
- [sqlite3](https://www.npmjs.com/package/sqlite3)
- [moment-timezone](https://www.npmjs.com/package/moment-timezone)
- [date-fns](https://www.npmjs.com/package/date-fns)
- [cron](https://www.npmjs.com/package/cron)


**Partie 2 : le site internet** <br>
Le front utilise du `javascript`, `html` et `css`.<br>
Le back utilise un serveur en `go version 1.21` et les librairies suivante :
- [godotenv](https://github.com/joho/godotenv)
- [uuid](https://github.com/gofrs/uuid)
- [go-sqlite3](https://github.com/mattn/go-sqlite3)


___
## 🧑‍💻 Authors

+ Fabien OLIVIER