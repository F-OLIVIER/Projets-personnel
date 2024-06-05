// fichier annexe
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { TODOBotReaction, idRoleUser } from './config.js';
import { IDmsgGvG, updateIdMessage } from './database.js';
import { client } from './Constant.js';

// module nodejs et npm
import moment from 'moment-timezone';

// Renouvellement du message d'inscription GvG pour reset les réactions
export async function msgreactgvg(BotReaction) {
  var id_msg = await IDmsgGvG();
  await client.channels.cache.get(TODOBotReaction).messages.fetch(id_msg[0].IDMessageGvG).then(message => message.delete());

  const futurdateformate = new Date();
  const jour = futurdateformate.getDay();
  const date = futurdateformate.getDate();
  const mois = futurdateformate.getMonth();
  const imageAttachment = new AttachmentBuilder('https://i43.servimg.com/u/f43/15/76/70/95/gvg10.jpg');
  // new AttachmentBuilder('https://i.ibb.co/chF2Z4W/Upj0-MHck-1.gif');

  // Génére le message et l'envoi sur discord
  const sendMessage = await BotReaction.send({
    files: [imageAttachment],
    content: "<@&" + idRoleUser + ">",
    embeds: [await EmbedInscription(jour, date, mois)],
    components: [await ButtonEmbedInscription()],
  });

  // Inscription du nouvelle ID du message dans la db
  updateIdMessage(sendMessage.id);
}

export async function tmpmsgreactgvg(BotReaction) {
  var id_msg = await IDmsgGvG();
  await client.channels.cache.get(TODOBotReaction).messages.fetch(id_msg[0].IDMessageGvG).then(message => message.delete());

  const imageAttachment = new AttachmentBuilder('https://i43.servimg.com/u/f43/15/76/70/95/gvg10.jpg');
  // Génére le message et l'envoi sur discord
  const sendMessage = await BotReaction.send({
    files: [imageAttachment],
    embeds: [await tmpEmbedInscription()],
  });

  // Inscription du nouvelle ID du message dans la db
  updateIdMessage(sendMessage.id);
}

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
    .setTitle(":regional_indicator_g::regional_indicator_v::regional_indicator_g:")
    .setColor(13373715)
    .setDescription("Veuillez indiquer votre présence pour la prochaine GvG.")
    .setThumbnail("https://i43.servimg.com/u/f43/15/76/70/95/poleax10.png")
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

export async function tmpEmbedInscription() {
  const embedData = new EmbedBuilder()
    .setTitle(":regional_indicator_g::regional_indicator_v::regional_indicator_g:")
    .setColor(13373715)
    .setDescription("La prochaine GvG sera une GvG d'entrainement (aussi appelée drill).\nPar conséquent, les inscriptions ne sont pas demandées.")
    .setThumbnail("https://i43.servimg.com/u/f43/15/76/70/95/spear10.png");

  return embedData
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
