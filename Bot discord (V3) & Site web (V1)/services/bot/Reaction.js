// fichier annexe
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, setPosition } from 'discord.js';
import { MAJPresent, MAJRetard, MAJAbsent, removeInscription } from './FuncRaid.js';
import { idRoleUser } from './config.js';
import { updateIdMessage } from './database.js';
import moment from 'moment-timezone';

// Fonction d'ajout de réaction
export async function addReaction(reaction, user) {
  if (reaction.emoji.name == "👍") { // si present ajouté
    await MAJPresent(user.id);
  } else if (reaction.emoji.name == "⌚") { // si retard ajouté
    await MAJRetard(user.id);
  } else if (reaction.emoji.name == "👎") { // si absent ajouté
    await MAJAbsent(user.id);
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
  // var moisen = "";
  if (mois == 0) {
    moisfr = "janvier";
    // moisen = "january";
  } else if (mois == 1) {
    moisfr = "février";
    // moisen = "february";
  } else if (mois == 2) {
    moisfr = "mars";
    // moisen = "march";
  } else if (mois == 3) {
    moisfr = "avril";
    // moisen = "april";
  } else if (mois == 4) {
    moisfr = "mai";
    // moisen = "may";
  } else if (mois == 5) {
    moisfr = "juin";
    // moisen = "june";
  } else if (mois == 6) {
    moisfr = "juillet";
    // moisen = "july";
  } else if (mois == 7) {
    moisfr = "août";
    // moisen = "august";
  } else if (mois == 8) {
    moisfr = "septembre";
    // moisen = "september";
  } else if (mois == 9) {
    moisfr = "octobre";
    // moisen = "october";
  } else if (mois == 10) {
    moisfr = "novembre";
    // moisen = "november";
  } else if (mois == 11) {
    moisfr = "décembre";
    // moisen = "december";
  }

  // Génére le format de date pour le message
  var msgfr = "";
  // var msgen = "";
  if (jour == 2) { // la date sera un mardi (jour 2)
    msgfr = "mardi " + date + " " + moisfr + "";
    // msgen = "tuesday " + moisen + " " + date + "";
  } else if (jour == 6) { // la date sera un samedi (jour 6)
    msgfr = "samedi " + date + " " + moisfr + "";
    // msgen = "saturday " + moisen + " " + date + "";
  }

  // Génére le message et l'envoi sur discord
  var sendMessage = await BotReaction.send({
    content: "<@&" + idRoleUser + ">,les inscriptions pour la GvG de ***" + msgfr + "*** sont ouvertes",
    files: ["https://i43.servimg.com/u/f43/15/76/70/95/image_15.png"]
  });
  // Ajout des réactions de base
  await sendMessage.react("👍"); // emoji present
  // await sendMessage.react("⌚"); // emoji retard
  await sendMessage.react("👎"); // emoji absent
  // Inscription du nouvelle ID du message dans la db
  updateIdMessage(sendMessage.id);
}

// ----------------------------------------------------------
// ----------------------- Test Embed -----------------------
// ----------------------------------------------------------

export async function EmbedInscription(presents = [], absents = []) {
  let nbpresent = 0;
  if (presents.length !== undefined) {
    nbpresent = presents.length;
  }

  let nbabsents = 0;
  if (absents.length !== undefined) {
    nbabsents = absents.length;
  }

  const embedData = new EmbedBuilder()
    // .setImage("https://i.ibb.co/chF2Z4W/Upj0-MHck-1.gif")
    .setTitle(":regional_indicator_g::regional_indicator_v::regional_indicator_g:")
    .setColor(13373715)
    .setDescription("<@&" + idRoleUser + ">\nVeuillez indiquer votre présence pour la prochaine GvG.")
    .setThumbnail("https://i43.servimg.com/u/f43/15/76/70/95/embedi11.png")
    .addFields(
      { name: "Date de la prochaine GvG", value: dateGvG() + "\n\n", inline: false },
      { name: '✅ ' + nbpresent + ' __Présent(s)__', value: presents.length ? presents.join('\n') : 'Aucun', inline: true },
      { name: '❌ ' + nbabsents + ' __Absent(s)__', value: absents.length ? absents.join('\n') : 'Aucun', inline: true }
    );

  return embedData
}

export async function ButtonEmbedInscription() {
  const buttons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('present')
        .setLabel('✅ Présent')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('absent')
        .setLabel('✖️ Absent')
        .setStyle(ButtonStyle.Danger)
    );

  return buttons
}

function dateGvG() {
  // gestion de la date futur pour le message
  const now = moment();
  const day = now.day(); // 2 mardi, 6 samedi

  // si mardi, annonce du samedi et si Samedi, annonce du mardi
  var futurdate;
  switch (day) {
    case 0: // dimanche
      futurdate = moment().add(2, 'days');
      break;
    case 1: // lundi
      futurdate = moment().add(1, 'days');
      break;
    case 2: // mardi
      // test si avant 22h
      if (now.hour() < 21) {
        futurdate = moment().add(0, 'days');
      } else {
        futurdate = moment().add(4, 'days');
      }
      break;
    case 3: // mercredi
      futurdate = moment().add(3, 'days');
      break;
    case 4: // jeudi
      futurdate = moment().add(2, 'days');
      break;
    case 5: // vendredi
      futurdate = moment().add(1, 'days');
      break;
    case 6: // samedi
      // test si avant 22h
      if (now.hour() < 21) {
        futurdate = moment().add(0, 'days');
      } else {
        futurdate = moment().add(3, 'days');
      }
      break;
  }

  if (day == 2) { // Cronjob du mardi (jour 2)

  } else if (day == 6) { // Cronjob du samedi (jour 6)

  } else {
    console.log('Day 2 ou 6 non présent, mauvais reset');
  }

  // génére la date au bon format
  const futurdateformate = new Date(futurdate + (moment().tz("Europe/Paris").utcOffset()));

  var moisfr = "";
  switch (futurdateformate.getMonth()) {
    case 0:
      moisfr = "janvier";
      break;
    case 1:
      moisfr = "février";
      break;
    case 2:
      moisfr = "mars";
      break;
    case 3:
      moisfr = "avril";
      break;
    case 4:
      moisfr = "mai";
      break;
    case 5:
      moisfr = "juin";
      break;
    case 6:
      moisfr = "juillet";
      break;
    case 7:
      moisfr = "août";
      break;
    case 8:
      moisfr = "septembre";
      break;
    case 9:
      moisfr = "octobre";
      break;
    case 10:
      moisfr = "novembre";
      break;
    case 11:
      moisfr = "décembre";
      break;
  }

  var dateFR = "";
  const jour = futurdateformate.getDay();
  if (jour == 2) { // la date sera un mardi (jour 2)
    dateFR = "Mardi " + futurdateformate.getDate() + " " + moisfr + "";
  } else if (jour == 6) { // la date sera un samedi (jour 6)
    dateFR = "Samedi " + futurdateformate.getDate() + " " + moisfr + "";
  } else {
    console.log('probleme de date dans function dateGvG()')
  }
  return dateFR
}
