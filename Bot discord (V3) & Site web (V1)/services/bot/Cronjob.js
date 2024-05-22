// Fichier annexe
import { IDmsgGvG, etatmsgGvG } from './database.js';
import { TODOBotReaction, idCategorie } from './config.js';
import { msgreactgvg } from './Reaction.js';
import { isMember } from './FuncData.js';
import { Resetac } from './FuncRaid.js';
import { client } from './Constant.js';

// Module nodejs et npm
import moment from 'moment-timezone';
import sqlite3 from 'sqlite3';

// Fonction de check des presence pendant la GvG
export function cronCheckpresence() {
  const category = client.channels.cache.get(idCategorie);
  category.children.cache.forEach(function (CurrentChan) {
    if (CurrentChan.type == 2) { // 2 = type voice
      const db = new sqlite3.Database('../database/databaseGvG.db');
      const updateQuery = `UPDATE Users SET MNDR = MNDR + 1 WHERE DiscordID = ?;`;
      // ID des channels à checker pour les présences pendant la GvG
      CurrentChan.members.forEach(function (CurrentMember) {
        if (isMember(CurrentMember.user.id)) {
          // console.log("id :", CurrentMember.user.id, ", username :", CurrentMember.user.username);
          db.run(updateQuery, [CurrentMember.user.id], function (error) {
            if (error) {
              console.error(error.message);
            }
          });
        }
      })
      db.close();
    }
  });
}

// fonction de changement automatique du message de réaction à 21h mardi et samedi
export async function cronResetMsgReaction(BotReaction) {
  const CurrentDate = new Date(Date.now() + (moment().tz("Europe/Paris").utcOffset() * 60 * 1000));
  var Allumage = await etatmsgGvG();
  if (Allumage[0].Allumage === 0) {

    // gestion de la date futur pour le message
    const now = moment();
    const day = now.day(); // 2 mardi, 6 samedi

    // si mardi, annonce du samedi et si Samedi, annonce du mardi
    var futurdate;
    if (day == 2) { // Cronjob du mardi (jour 2)
      futurdate = moment().add(4, 'days');
    } else if (day == 6) { // Cronjob du samedi (jour 6)
      futurdate = moment().add(3, 'days');
    } else {
      console.log('Day 2 ou 6 non présent, mauvais reset');
    }

    // génére la date au bon format
    const futurdateformate = new Date(futurdate + (moment().tz("Europe/Paris").utcOffset()));
    // récupération du jour, de la date et du mois
    const jour = futurdateformate.getDay();
    const date = futurdateformate.getDate();
    const mois = futurdateformate.getMonth();

    // Suppression du message d'inscription GvG
    var id_msg = await IDmsgGvG();
    client.channels.cache.get(TODOBotReaction).messages.fetch(id_msg[0].IDMessageGvG).then(message => message.delete());
    Resetac();
    msgreactgvg(BotReaction, jour, mois, date);
  } else {
    console.log("Fonction automatique resetmsgreact à l'arret : " + CurrentDate);
  }
}
