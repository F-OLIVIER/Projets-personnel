import { LINK_DISCORD, cookieName } from "./config.js";
import { administration } from "./administration.js";
import { characterCard } from "./characterCard.js";
import { createHTMLElement } from "./useful.js";
import { creategroup } from "./creategroup.js";
import { viewgroup } from "./viewGroup.js";
import { caserne } from "./caserne.js";
import { home } from "./home.js";
import { stat } from "./stat.js";

let path = window.location.pathname;
switch (path) {
    case '/':
        if (document.cookie.split(";").some((item) => item.trim().startsWith(cookieName + "="))) {
            window.location.href = '/home';
        } else {
            homeNotConnected();
        }
        break;

    case '/discord':
        // page géré de façon externe
        break;

    case '/home':
        home();
        break;

    case '/caserne':
        caserne();
        break;

    case '/creategroup':
        creategroup();
        break;

    case '/viewGroup':
        viewgroup();
        break;

    case '/characterCard':
        characterCard();
        break;

    case '/AppAdmin':
        administration();
        break;

    case '/stat':
        stat();
        break;

    default:
        window.location.href = '/';
        break;
}

function homeNotConnected() {
    let Container = document.getElementById('Container');
    let containerHomeNotConnected = createHTMLElement('div', 'containerHomeNotConnected');

    let link = createHTMLElement('a', 'linkDiscord');
    link.href = LINK_DISCORD;

    let discordConnect = createHTMLElement('div', 'discordConnect');
    let divlink = createHTMLElement('div', 'divlink');

    divlink.textContent = "Cliquez sur cette image pour vous connecter avec Discord";
    discordConnect.appendChild(divlink)

    let divimg = document.createElement('div');
    let imgDiscord = document.createElement('img');
    imgDiscord.className = 'imgDiscord';
    imgDiscord.src = "img/Logo_Discord.webp";
    imgDiscord.alt = "logo discord";
    divimg.appendChild(imgDiscord);
    discordConnect.appendChild(divimg);

    link.appendChild(discordConnect);
    containerHomeNotConnected.appendChild(link);

    let divinfo = document.createElement('div');
    divinfo.className = "divinfonotconnected";
    let title =  document.createElement('p');
    title.textContent = "ℹ️ Vous serez redirigés vers cette page dans les cas suivants";
    divinfo.appendChild(title);
    let cas1 =  document.createElement('li');
    cas1.textContent = "Utilisateur non présent sur le discord associé à ce site internet";
    divinfo.appendChild(cas1);
    let cas2 =  document.createElement('li');
    cas2.textContent = "Utilisateur non autorisé (rôle discord non attribué)";
    divinfo.appendChild(cas2);
    let cas3 =  document.createElement('li');
    cas3.textContent = "Erreur de connexion";
    divinfo.appendChild(cas3);

    containerHomeNotConnected.appendChild(divinfo);
    Container.appendChild(containerHomeNotConnected);
}