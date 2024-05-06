// fichier annexe
import { MAJPresent, MAJRetard, MAJAbsent, removeInscription } from './FuncRaid.js';
import { updateIdMessage } from './database.js';

// Fonction d'ajout de réaction
export async function addReaction(reaction, user) {
  if (reaction.emoji.name == "👍") { // si present ajouté
    MAJPresent(user.id);
  } else if (reaction.emoji.name == "⌚") { // si retard ajouté
    MAJRetard(user.id);
  } else if (reaction.emoji.name == "👎") { // si absent ajouté
    MAJAbsent(user.id);
  }
}

// Fonction de remove de réaction
export async function removeReaction(reaction, user) {
  if (reaction.emoji.name == "👍" || reaction.emoji.name == "⌚" || reaction.emoji.name == "👎") {
    removeInscription(user.id);
  }
}

// Renouvellement du message d'inscription GvG pour reset les réactions
export async function msgreactgvg(BotReaction, jour, mois, date) {
  // Gestion de l'affichage du mois
  var moisfr = "";
  var moisen = "";
  if (mois == 0) {
    moisfr = "janvier";
    moisen = "january";
  } else if (mois == 1) {
    moisfr = "février";
    moisen = "february";
  } else if (mois == 2) {
    moisfr = "mars";
    moisen = "march";
  } else if (mois == 3) {
    moisfr = "avril";
    moisen = "april";
  } else if (mois == 4) {
    moisfr = "mai";
    moisen = "may";
  } else if (mois == 5) {
    moisfr = "juin";
    moisen = "june";
  } else if (mois == 6) {
    moisfr = "juillet";
    moisen = "july";
  } else if (mois == 7) {
    moisfr = "août";
    moisen = "august";
  } else if (mois == 8) {
    moisfr = "septembre";
    moisen = "september";
  } else if (mois == 9) {
    moisfr = "octobre";
    moisen = "october";
  } else if (mois == 10) {
    moisfr = "novembre";
    moisen = "november";
  } else if (mois == 11) {
    moisfr = "décembre";
    moisen = "december";
  }

  // Génére le format de date pour le message
  var msgfr = "";
  var msgen = "";
  if (jour == 2) { // la date sera un mardi (jour 2)
    msgfr = "mardi " + date + " " + moisfr + "";
    msgen = "tuesday " + moisen + " " + date + "";
  } else if (jour == 6) { // la date sera un samedi (jour 6)
    msgfr = "samedi " + date + " " + moisfr + "";
    msgen = "saturday " + moisen + " " + date + "";
  }

  // Génére le message et l'envoi sur discord
  var sendMessage = await BotReaction.send({
    content: "<@&951159160190427137> \n__**Français :**__ les inscriptions pour la GvG de ***" + msgfr + "*** sont ouvertes \n__**English :**__ registrations for TW on ***" + msgen + "*** are now open",
    files: ["https://i43.servimg.com/u/f43/15/76/70/95/image_15.png"]
  });
  // Ajout des réactions present, retard et absent
  await sendMessage.react("👍"); // emoji present
  // await sendMessage.react("⌚"); // emoji retard
  await sendMessage.react("👎"); // emoji absent
  // Inscription de l'ID du message dans la db
  updateIdMessage(sendMessage.id);
}
