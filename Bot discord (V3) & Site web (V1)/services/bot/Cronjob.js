// Fichier annexe
import { DeleteEvent, ListEvent, etatmsgGvG } from './database.js';
import { idCategorie } from './config.js';
import { msgreactgvg } from './gvg.js';
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
    Resetac();
    msgreactgvg(BotReaction);
  } else {
    console.log("Fonction automatique resetmsgreact à l'arret : " + CurrentDate);
  }
}


// Fonction de check des presence pendant la GvG
export async function cronDeleteEvent() {
  const currentDate = new Date();
  const listEvent = await ListEvent();

  if (listEvent && listEvent.length > 0) {
    listEvent.forEach(async (event) => {
      const eventDate = new Date(event.Dates);
      if (eventDate < currentDate) {
        await DeleteEvent(event.ID);
      }
    });
  }
}

