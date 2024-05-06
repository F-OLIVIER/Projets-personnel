// fichier annexe
import { MAJPresent, MAJListNextRaid, MAJRetard, MAJAbsent } from './FuncRaid.js';
import { AuthCALL, UpdateNextRaid } from './FuncGoogleSHEET.js';
import { db } from './Constant.js';
import delay from 'delay';

// Fonction d'ajout de réaction
export async function addReaction(reaction, user) {
  // console.log(user.id);
  var user_id = await reaction.message.guild.members.cache.get(user.id);
  await delay(100);
  // console.log(user_id);
  var datadb = db.data.Users.find(user => user.DiscordID == user_id);
  // console.log(datadb);
  var NBemoji = datadb.nbEmoji;

    if (reaction.emoji.name == "👍") { // si present ajouté
      MAJPresent(user.id);
      MAJListNextRaid(user.id);
      AuthCALL(UpdateNextRaid);
      datadb.nbEmoji = NBemoji + 1;

    } else if (reaction.emoji.name == "⌚") { // si retard ajouté
      MAJRetard(user.id);
      MAJListNextRaid(user.id);
      AuthCALL(UpdateNextRaid);
      datadb.nbEmoji = NBemoji + 1;

    } else if (reaction.emoji.name == "👎") { // si absent ajouté
      MAJAbsent(user.id);
      AuthCALL(UpdateNextRaid);
      datadb.nbEmoji = NBemoji +1;
    }
    await db.write();
}

// Fonction de remove de réaction
export async function removeReaction(reaction, user) {
  // console.log(user.id);
  var user_id = await reaction.message.guild.members.cache.get(user.id);
  await delay(100);
  // console.log(user_id);
  var datadb = await db.data.Users.find(user => user.DiscordID == user_id);
  // console.log(datadb);
  var NBemoji = datadb.nbEmoji;
  // console.log("NBemoji : " + NBemoji);
    
      if (reaction.emoji.name == "👍") { // si present retiré
        if (NBemoji == 1) {
          datadb.NextRaid = 0;
          datadb.DisplayNameList = "";
          datadb.nbEmoji = NBemoji -1 ;
          AuthCALL(UpdateNextRaid);
        } else {
          datadb.nbEmoji = NBemoji -1 ;
        }

      } else if (reaction.emoji.name == "⌚") { // si retard retiré
        if (datadb.nbEmoji == 1) {
          datadb.NextRaid = 0;
          datadb.DisplayNameList = "";
          datadb.nbEmoji = NBemoji -1 ;
          AuthCALL(UpdateNextRaid);
        } else {
          datadb.nbEmoji = NBemoji -1 ;
        }

      } else if (reaction.emoji.name == "👎") { // si absent retiré
        if (datadb.nbEmoji == 1) {
          datadb.NextRaid = 0;
          datadb.DisplayNameList = "";
          datadb.nbEmoji = NBemoji -1 ;
          AuthCALL(UpdateNextRaid);
        } else {
          datadb.nbEmoji = NBemoji -1 ;
        }
      }
      await db.write();
}

// Renouvellement du message d'inscription GvG pour reset les réactions
export async function msgreactgvg(BotReaction, jour, mois, date) {
  // Gestion du mois
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
  // Inscription de l'ID du message dans la bd
  db.data.gestion.id_message = sendMessage.id;
  db.write();
}
