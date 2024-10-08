import { communBlock, createHTMLElement, fetchServer, fetchlogout } from "./useful.js";

export async function viewgroup() {
    containerviewGroup(await fetchServer('creategroup'));
}

let timerThrottlebutton = 0;
function containerviewGroup(data) {
    if (data.Gestion.Logged && data.Gestion.Officier) {
        communBlock(data);
        let container = document.getElementById('Container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        let divForImg = document.createElement('div');
        divForImg.className = 'divForImg';

        // création des en-tête
        let titledivuser = document.createElement('div');
        titledivuser.classList.add('titledivuser');
        titledivuser.classList.add('divuser');

        let titlename = createHTMLElement('div', 'viewtitlename');
        titlename.textContent = 'Joueur';
        titledivuser.appendChild(titlename);

        let titleclass = createHTMLElement('div', 'titleclass');
        titleclass.textContent = 'classe joué';
        titledivuser.appendChild(titleclass);

        let divnameunit = document.createElement('div');
        divnameunit.className = 'divnameunit';

        let titleunit1 = document.createElement('div');
        titleunit1.textContent = 'unité 1';
        divnameunit.appendChild(titleunit1);

        let titleunit2 = document.createElement('div');
        titleunit2.textContent = 'unité 2';
        divnameunit.appendChild(titleunit2);

        let titleunit3 = document.createElement('div');
        titleunit3.textContent = 'unité 3';
        divnameunit.appendChild(titleunit3);

        let titleunit4 = document.createElement('div');
        titleunit4.textContent = 'unité 4';
        divnameunit.appendChild(titleunit4);
        titledivuser.appendChild(divnameunit);

        let containerGroupe = createHTMLElement('div', 'containerGroupe');
        let viewgroup = createHTMLElement('div', 'viewgroup');
        viewgroup.appendChild(titledivuser);

        // compte le nombre de groupe existant
        let groupNumberMax = 0;
        for (let i = 0; i < data.GroupGvG.length; i++) {
            if (data.GroupGvG[i].GroupNumber > groupNumberMax) {
                groupNumberMax = data.GroupGvG[i].GroupNumber;
            }
        }

        let groupNumber = 1;
        for (let k = 0; k < groupNumberMax; k++) {
            // récupération des utilisateurs present dans le groupe
            const currentGroupe = usersInGroup(data, groupNumber);
            const groupName = 'viewgroup' + groupNumber;
            
            let divGroup = document.createElement('div');
            divGroup.classList.add('divViewGroup');
            divGroup.classList.add(groupName);

            // Nom du groupe
            const divnameUserGroup = createHTMLElement('div', 'divnamegroup' + groupNumber);
            divnameUserGroup.classList.add('divnamegroup');

            const nameUserGroup = createHTMLElement('div', 'namegroup' + groupNumber);
            nameUserGroup.classList.add('namegroup');
            if (data.NameGroupGvG[groupNumber]) {
                nameUserGroup.textContent = 'Groupe ' + data.NameGroupGvG[groupNumber];
            } else {
                nameUserGroup.textContent = 'Groupe n°' + groupNumber;
            }
            divGroup.appendChild(nameUserGroup);

            for (let j = 0; j < currentGroupe.length; j++) {
                const currentPlayer = currentGroupe[j];

                let divuser = document.createElement('div');
                divuser.classList.add(groupName);
                divuser.classList.add('divuserviewgroup');

                // pseudo player
                let name = createHTMLElement('div', 'viewusername');
                name.textContent = currentPlayer.Username;
                divuser.appendChild(name);

                // classe player
                let classplayer = createHTMLElement('div', 'classplayer');
                classplayer.textContent = currentPlayer.class;
                divuser.appendChild(classplayer);

                // Unité du joueur
                let divlistUnit = createHTMLElement('div', 'viewdivlistUnit');
                let unit1 = createHTMLElement('div', 'unit1');
                unit1.textContent = currentPlayer.Unit1;
                if (currentPlayer.Unit1 === "Consulter un officier") {
                    unit1.classList.add('consultOff');
                }
                divlistUnit.appendChild(unit1);
                let unit2 = createHTMLElement('div', 'unit2');
                unit2.textContent = currentPlayer.Unit2;
                if (currentPlayer.Unit2 === "Consulter un officier") {
                    unit2.classList.add('consultOff');
                }
                divlistUnit.appendChild(unit2);
                let unit3 = createHTMLElement('div', 'unit3');
                unit3.textContent = currentPlayer.Unit3;
                if (currentPlayer.Unit3 === "Consulter un officier") {
                    unit3.classList.add('consultOff');
                }
                divlistUnit.appendChild(unit3);
                let unit4 = createHTMLElement('div', 'unit4');
                unit4.textContent = currentPlayer.Unit4;
                if (currentPlayer.Unit4 === "Consulter un officier") {
                    unit4.classList.add('consultOff');
                }
                divlistUnit.appendChild(unit4);

                // ne pas afficher les lignes vide
                if (currentPlayer.Username != "") {
                    divuser.appendChild(divlistUnit);
                    divGroup.appendChild(divuser);
                }
            }
            viewgroup.appendChild(divGroup);
            groupNumber += 1;
        }

        containerGroupe.appendChild(viewgroup);

        // bouton pour télécharger l'image des groupes
        let scripthead = document.createElement('script');
        scripthead.src = "https://files.codepedia.info/files/uploads/iScripts/html2canvas.js";
        document.getElementById('head').appendChild(scripthead);
        
        let script = document.createElement('script');
        script.src = "https://html2canvas.hertzen.com/dist/html2canvas.js";
        container.appendChild(script);
        
        let buttonDownloadGroup = createHTMLElement('div', 'buttonDownloadGroup');
        buttonDownloadGroup.textContent = "Télécharger l'image des groupes";
        containerGroupe.appendChild(buttonDownloadGroup);
        
        buttonDownloadGroup.addEventListener('click', function () {
            const now = new Date();
            if (now - timerThrottlebutton > 500) {
                timerThrottlebutton = now;

                // Appliquer la largeur minimale à la div
                let originalWidth = viewgroup.style.width;
                viewgroup.style.minWidth = '2250px';

                // Utiliser html2canvas pour capturer la div
                html2canvas(viewgroup, {
                    allowTaint: true,
                    useCORS: true
                }).then(function (canvas) {
                    // Réinitialiser la largeur de la div après la capture
                    viewgroup.style.width = originalWidth;

                    var link = document.createElement("a");
                    document.body.appendChild(link);
                    const date = String(now.getDate()).padStart(2, '0') + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + now.getFullYear();
                    link.download = date + "_groupeGvG.jpg";
                    link.href = canvas.toDataURL();
                    link.target = '_blank';
                    link.click();
                });
                
                viewgroup.style.minWidth = '';
            }
        });

        // bouton pour revenir à l'édition des groupes
        let buttonEditGroup = createHTMLElement('div', 'buttonEditGroup');
        buttonEditGroup.textContent = "Revenir à l'édition des groupes";
        containerGroupe.appendChild(buttonEditGroup);
        buttonEditGroup.addEventListener('click', function () {
            const now = new Date();
            if (now - timerThrottlebutton > 500) {
                timerThrottlebutton = now;
                window.location.href = '/creategroup';
            }
        });

        container.appendChild(containerGroupe);

    } else {
        fetchlogout();
    }
}

function usersInGroup(data, groupNumber) {
    let usersInGroup = [];
    for (let i = 0; i < data.GroupGvG.length; i++) {
        let currentUser = data.GroupGvG[i];
        if (groupNumber == currentUser.GroupNumber) {
            for (let j = 0; j < data.ListInscripted.length; j++) {
                const userInscripted = data.ListInscripted[j];
                if (userInscripted.ID === currentUser.User_ID) {
                    currentUser.influence = userInscripted.Influence;
                    currentUser.class = userInscripted.GameCharacter;
                    currentUser.influUnit = influenceUnit(currentUser, userInscripted.UserCaserne)
                }
            }
            usersInGroup.push(currentUser);
        }
    }

    for (let i = usersInGroup.length; i < 5; i++) {
        const noUser = {
            "Username": "",
            "GroupNumber": groupNumber,
            "Unit1": "",
            "Unit2": "",
            "Unit3": "",
            "Unit4": "",
            "influence": "",
            "influUnit": "",
            "class": ""
        }
        usersInGroup.push(noUser);
    }
    return usersInGroup
}

function influenceUnit(currentUser, caserne) {
    let unitValues = 0;
    if (caserne !== null) {
        for (let i = 0; i < caserne.length; i++) {
            let nameCurrentUnit = caserne[i].Unit_name
            if (nameCurrentUnit === currentUser.Unit1 ||
                nameCurrentUnit === currentUser.Unit2 ||
                nameCurrentUnit === currentUser.Unit3 ||
                nameCurrentUnit === currentUser.Unit4) {
                unitValues += parseInt(caserne[i].Unit_influence, 10);
            }
        }
    }

    return unitValues;
}
