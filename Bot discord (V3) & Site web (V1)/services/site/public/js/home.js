import { communBlock, createHTMLElement, fetchServer, fetchlogout } from "./useful.js";

export async function home() {
  containerhome(await fetchServer('home'));
}

function containerhome(data) {
  if (data.Gestion.Logged) {
    communBlock(data);

    let Container = document.getElementById('Container');
    Container.innerHTML = '';

    // page characterCard
    let subContainer = createHTMLElement('div', 'subContainer');
    let linkCharacterCard = createHTMLElement('a', 'no-style-link');
    linkCharacterCard.href = '/characterCard';
    let buttoncharacterCard = createHTMLElement('div', 'buttoncharacterCard');
    buttoncharacterCard.textContent = 'Ma fiche personnage';
    linkCharacterCard.appendChild(buttoncharacterCard);
    subContainer.appendChild(linkCharacterCard);

    // page caserne
    let linkCaserne = createHTMLElement('a', 'no-style-link');
    linkCaserne.href = '/caserne';
    let buttonCaserne = createHTMLElement('div', 'buttonCaserne');
    buttonCaserne.textContent = 'Modifier ma caserne';
    linkCaserne.appendChild(buttonCaserne);
    subContainer.appendChild(linkCaserne);

    if (data.Gestion.Officier) { // si officier, affichage bouton création des groupes et bouton administration
      let subcontainerOfficier = createHTMLElement('div', 'subcontainerOfficier');
      let titlesubcontainerOfficier = createHTMLElement('div', 'titlesubcontainerOfficier');
      titlesubcontainerOfficier.textContent = "Réservé aux officiers";
      subcontainerOfficier.appendChild(titlesubcontainerOfficier);

      // page création des groupes gvg
      let linkCreateGroup = createHTMLElement('a', 'no-style-link');
      linkCreateGroup.href = '/creategroup';
      let buttonCreateGroup = createHTMLElement('div', 'buttonCreateGroup');
      buttonCreateGroup.href = '/creategroup';
      buttonCreateGroup.textContent = 'Créer les groupes GvG';
      linkCreateGroup.appendChild(buttonCreateGroup);
      subcontainerOfficier.appendChild(linkCreateGroup);

      // page des statistiques
      let linkStat = createHTMLElement('a', 'no-style-link');
      linkStat.href = '/stat';
      let buttonStat = createHTMLElement('div', 'buttonStat');
      buttonStat.textContent = 'Statistique';
      linkStat.appendChild(buttonStat);
      subcontainerOfficier.appendChild(linkStat);

      // page d'administration
      let linkAppAdmin = createHTMLElement('a', 'no-style-link');
      linkAppAdmin.href = '/AppAdmin';
      let buttonAppAdmin = createHTMLElement('div', 'buttonAppAdmin');
      buttonAppAdmin.href = '/AppAdmin';
      buttonAppAdmin.textContent = "Page d'administration";
      linkAppAdmin.appendChild(buttonAppAdmin);
      subcontainerOfficier.appendChild(linkAppAdmin);
      subContainer.appendChild(subcontainerOfficier)
    }
    Container.appendChild(subContainer);

  } else {
    fetchlogout();
  }
}