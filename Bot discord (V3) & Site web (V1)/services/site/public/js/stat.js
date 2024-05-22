import { communBlock, createHTMLElement, fetchServer, fetchlogout } from "./useful.js";

export async function stat() {
    containerstat(await fetchServer('statGvG'));
}

function containerstat(data) {
    if (data.Gestion.Logged && data.Gestion.Officier) {
        communBlock(data);

        let subContainerStat = createHTMLElement('div', 'subContainerStat');

        let ListFilter = [['sortuserbyname', 'statname'], ['sortuserbyinflu', 'statinfluence'], ['sortuserbylevel', 'statlvl'], ['sortuserbyclass', 'statclass'], ['sortuserbynbgvg', 'statnbgvg'], ['sortuserbylastGvG', 'statlastgvg']];
        let filter = createHTMLElement('div', 'statfilter');
        // Titre
        let titlefilter = document.createElement('div');
        titlefilter.className = 'titlefilter';
        titlefilter.textContent = 'Filtrer par :';
        filter.appendChild(titlefilter);
        let buttonFilter = document.createElement('div');
        buttonFilter.className = 'buttonFilter';
        let divline1 = document.createElement('div');
        divline1.className = 'linefilter';
        let divline2 = document.createElement('div');
        divline2.className = 'linefilter';

        // filtre par name
        let sortuserbyname = document.createElement('button');
        sortuserbyname.id = 'sortuserbyname';
        sortuserbyname.value = 0;
        sortuserbyname.textContent = "nom";
        divline1.appendChild(sortuserbyname);
        // filtre par influence
        let sortuserbyinflu = document.createElement('button');
        sortuserbyinflu.id = 'sortuserbyinflu';
        sortuserbyinflu.value = 0;
        sortuserbyinflu.textContent = "influence";
        divline1.appendChild(sortuserbyinflu);
        // filtre par level
        let sortuserbylevel = document.createElement('button');
        sortuserbylevel.id = 'sortuserbylevel';
        sortuserbylevel.value = 0;
        sortuserbylevel.textContent = "Level";
        divline1.appendChild(sortuserbylevel);
        // filtre par classe d'arme
        let sortuserbyclass = document.createElement('button');
        sortuserbyclass.id = 'sortuserbyclass';
        sortuserbyclass.value = 0;
        sortuserbyclass.textContent = "Classe d'arme";
        divline2.appendChild(sortuserbyclass);
        // filtre par classe d'arme
        let sortuserbynbgvg = document.createElement('button');
        sortuserbynbgvg.id = 'sortuserbynbgvg';
        sortuserbynbgvg.value = 0;
        sortuserbynbgvg.textContent = "Nb GvG";
        divline2.appendChild(sortuserbynbgvg);
        // filtre par Derniére GvG
        let sortuserbylastGvG = document.createElement('button');
        sortuserbylastGvG.id = 'sortuserbylastGvG';
        sortuserbylastGvG.value = 0;
        sortuserbylastGvG.textContent = "derniére GvG";
        divline2.appendChild(sortuserbylastGvG);

        buttonFilter.appendChild(divline1);
        buttonFilter.appendChild(divline2);
        filter.appendChild(buttonFilter);
        subContainerStat.appendChild(filter);

        const listLegendConnected = ["📱 Joueur qui s'est connecté au site internet", "📵 Joueur qui ne s'est jamais connecté au site internet"];
        let legend = createHTMLElement('div', 'legendstat');
        legend.textContent = "Légende : ";
        for (let i = 0; i < listLegendConnected.length; i++) {
            let currentlegend = document.createElement('div');
            currentlegend.textContent = listLegendConnected[i];
            legend.appendChild(currentlegend);
        }
        subContainerStat.appendChild(legend);

        // création des en-tête
        let titledivstat = document.createElement('div');
        titledivstat.classList.add('divTitleStat');
        titledivstat.classList.add('statuser');

        let titleconnected = createHTMLElement('div', 'statconnected');
        titleconnected.textContent = '';
        titledivstat.appendChild(titleconnected);

        let titlename = createHTMLElement('div', 'statname');
        titlename.textContent = 'Pseudo joueur';
        titledivstat.appendChild(titlename);

        let titleclass = createHTMLElement('div', 'statclass');
        titleclass.textContent = 'classe joué';
        titledivstat.appendChild(titleclass);

        let titleinfluenceplayer = createHTMLElement('div', 'statinfluence');
        titleinfluenceplayer.textContent = 'influence joueur';
        titledivstat.appendChild(titleinfluenceplayer);

        let titlelvlplayer = createHTMLElement('div', 'statlvl');
        titlelvlplayer.textContent = 'Level joueur';
        titledivstat.appendChild(titlelvlplayer);

        let titlenbGvGparticiped = createHTMLElement('div', 'statnbgvg');
        titlenbGvGparticiped.textContent = 'GvG participé/total';
        titledivstat.appendChild(titlenbGvGparticiped);

        let titlelastGvGparticiped = createHTMLElement('div', 'statlastgvg');
        titlelastGvGparticiped.textContent = 'Derniére GvG participé le';
        titledivstat.appendChild(titlelastGvGparticiped);

        subContainerStat.appendChild(titledivstat);
        let subContainerStatForSort = createHTMLElement('div', 'subContainerStatForSort');
        subContainerStat.appendChild(subContainerStatForSort);
        DisplayUsers(data.ListInscripted, subContainerStatForSort);

        document.getElementById('Container').appendChild(subContainerStat);

        createFilterEventlistener(ListFilter);
    } else {
        fetchlogout();
    }
}

function DisplayUsers(data, div) {
    for (let i = 0; i < data.length; i++) {
        const currentUser = data[i];

        const divstat = createHTMLElement('div', 'divstat');
        const statuser = createHTMLElement('div', 'statuser');

        const connected = createHTMLElement('div', 'connected');
        if (currentUser.ID == 1) {
            connected.textContent = '📱';
        } else {
            connected.textContent = '📵';
        }
        statuser.appendChild(connected);

        const name = createHTMLElement('div', 'statname');
        name.textContent = currentUser.Username;
        statuser.appendChild(name);

        const classPlayer = createHTMLElement('div', 'statclass');
        classPlayer.textContent = currentUser.GameCharacter;
        statuser.appendChild(classPlayer);

        const influenceplayer = createHTMLElement('div', 'statinfluence');
        influenceplayer.textContent = currentUser.Influence;
        statuser.appendChild(influenceplayer);

        const lvlplayer = createHTMLElement('div', 'statlvl');
        lvlplayer.textContent = currentUser.Lvl;
        statuser.appendChild(lvlplayer);

        const nbGvGparticiped = createHTMLElement('div', 'statnbgvg');
        nbGvGparticiped.textContent = currentUser.NbGvGParticiped + ' / ' + currentUser.NbTotalGvG;
        statuser.appendChild(nbGvGparticiped);

        const lastGvGparticiped = createHTMLElement('div', 'statlastgvg');
        lastGvGparticiped.textContent = currentUser.DateLastGvGParticiped;
        statuser.appendChild(lastGvGparticiped);
        divstat.appendChild(statuser);


        if (currentUser.ListDateGvG) {
            divstat.classList.add('divstatwitchinfo');

            const statinfo = createHTMLElement('div', 'statinfo');
            const titlelistGvG = document.createElement('div');
            titlelistGvG.classList = 'titlelistGvGstat';
            titlelistGvG.textContent = 'Liste des GvG ou ' + currentUser.Username + " s'était inscrit present";
            statinfo.appendChild(titlelistGvG);

            let listGvGValid = '';
            let listGvGNotValid = '';
            for (let j = currentUser.ListDateGvG.length - 1; j >= 0; j--) {
                const currentDate = currentUser.ListDateGvG[j]
                if (currentDate[0] == '0') {
                    if (listGvGNotValid !== '') {
                        listGvGNotValid += ' - '
                    }
                    listGvGNotValid += currentDate[1];
                } else {
                    if (listGvGValid !== '') {
                        listGvGValid += ' - '
                    }
                    listGvGValid += currentDate[1];
                }
            }

            const titlecontentlistGvGValid = document.createElement('div');
            titlecontentlistGvGValid.textContent = 'GvG ou ' + currentUser.Username + ' etait present sur Discord (présence vérifiés par le bot) : ';
            titlecontentlistGvGValid.classList = 'titlepresencediscord';
            statinfo.appendChild(titlecontentlistGvGValid);
            const contentlistGvGValid = document.createElement('div');
            contentlistGvGValid.classList = 'presencediscord';
            contentlistGvGValid.textContent = listGvGValid;
            statinfo.appendChild(contentlistGvGValid);
            const titlecontentlistGvGNotValid = document.createElement('div');
            titlecontentlistGvGNotValid.classList = 'titlepresencediscord';
            titlecontentlistGvGNotValid.textContent = 'GvG ou ' + currentUser.Username + ' etait absent du Discord (absence vérifiés par le bot) : ';
            statinfo.appendChild(titlecontentlistGvGNotValid);
            const contentlistGvGNotValid = document.createElement('div');
            contentlistGvGNotValid.classList = 'presencediscord';
            contentlistGvGNotValid.textContent = listGvGNotValid;
            statinfo.appendChild(contentlistGvGNotValid);
            statinfo.style.display = 'none';
            divstat.appendChild(statinfo);

            statuser.addEventListener("click", function () {
                if (statinfo.style.display === 'none') {
                    statinfo.style.display = 'block';
                } else {
                    statinfo.style.display = 'none';
                }
            });
        }

        div.appendChild(divstat)
    }
}

function createFilterEventlistener(ListFilter) {
    ListFilter.forEach(sortButton => {
        const button = document.getElementById(sortButton[0])
        button.addEventListener("click", function () {
            const div = document.getElementById(sortButton[1])
            sortBy(sortButton[1], div.value);
            if (div.value === 0) {
                div.value = 1;
            } else {
                div.value = 0;
            }
        });
    });
}

// Fonction de trie qui fonctionne pour tous
function sortBy(option = '', order) {
    const statsContainer = document.getElementById('subContainerStatForSort');
    const stats = statsContainer.children;
    // Convertir la collection d'éléments en un tableau pour pouvoir utiliser sort()
    const statsArray = Array.from(stats);

    // Trier les éléments pour le critère spécifié
    statsArray.sort(function (a, b) {
        const valueA = a.querySelector('.' + option).textContent.toUpperCase();
        const valueB = b.querySelector('.' + option).textContent.toUpperCase();
        if (order == 0) {
            return (valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0;
        } else {
            return (valueA > valueB) ? -1 : (valueA < valueB) ? 1 : 0;
        }
    });

    // Effacer l'ancien contenu
    while (statsContainer.firstChild) {
        statsContainer.removeChild(statsContainer.firstChild);
    }
    // Afficher le nouveau contenu
    statsArray.forEach(function (stat) {
        statsContainer.appendChild(stat);
    });
}

