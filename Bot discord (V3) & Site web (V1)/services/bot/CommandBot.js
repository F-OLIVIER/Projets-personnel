// Fichier annexe
import { client, Messagenb, Messagelist } from './Constant.js';
import { msgreactgvg } from './gvg.js';
import { listclass } from './database.js';

// Module nodejs et npm
import { } from 'dotenv/config';
import sqlite3 from 'sqlite3';

// Commande nb
export async function cmdnb(AuthorID) {
  const db = new sqlite3.Database('../database/databaseGvG.db');
  const requestQueries = [
    `SELECT COUNT(*) AS NumberOfResponses FROM Users WHERE EtatInscription = 1;`,
    `SELECT COUNT(*) AS NumberOfResponses FROM Users WHERE EtatInscription = 2;`,
    `SELECT COUNT(*) AS NumberOfResponses FROM Users WHERE EtatInscription = 3;`,
  ];

  try {
    const responseCounts = await Promise.all(
      requestQueries.map(query => {
        return new Promise((resolve, reject) => {
          db.get(query, [], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row.NumberOfResponses);
            }
          });
        });
      })
    );

    const nb_inscrit = responseCounts[0] + responseCounts[1] + responseCounts[2];
    Messagenb(AuthorID, nb_inscrit, responseCounts[0], responseCounts[1], responseCounts[2]);
  } catch (err) {
    console.error(err);
  } finally {
    db.close();
  }
}

// command list
export async function cmdlist(AuthorID) {
  const db = new sqlite3.Database('../database/databaseGvG.db');
  const requestQueries = [
    `SELECT DiscordID FROM Users WHERE EtatInscription = 1;`,
    `SELECT DiscordID FROM Users WHERE EtatInscription = 2;`,
    `SELECT DiscordID FROM Users WHERE EtatInscription = 3;`,
  ];

  const playerLists = await Promise.all(
    requestQueries.map(query => {
      return new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => row.DiscordID));
          }
        });
      });
    })
  );
  db.close();

  const nb_present = playerLists[0].length; // NextRaid = 1
  const nb_retard = playerLists[1].length; //  NextRaid = 2
  const nb_absent = playerLists[2].length; //  NextRaid = 3

  var list_present; // NextRaid = 1
  var list_retard; //  NextRaid = 2
  var list_absent; //  NextRaid = 3

  // List present
  if (nb_present == 0) {
    list_present = ":sob: Aucun joueur inscrit :sob:";
  }
  else if (nb_present != 0) {
    list_present = "**" + nb_present + " joueurs :**";
    for (let i = 0; i < nb_present; i++) {
      list_present += " :white_check_mark:<@" + playerLists[0][i] + ">";
      if (i != nb_present) {
        list_present += ", ";
      }
    }
  }
  // List en retard
  if (nb_retard == 0) {
    list_retard = ":partying_face: Aucun joueur en retard :partying_face:";
  }
  else if (nb_retard != 0) {
    list_retard = "**" + nb_retard + " joueurs :**";
    for (let i = 0; i < nb_retard; i++) {
      list_retard += " :clock2:<@" + playerLists[1][i] + ">";
      if (i != nb_retard) {
        list_retard += ", ";
      }
    }
  }
  // List absent
  if (nb_absent == 0) {
    list_absent = ":heart_eyes: Aucun joueur absent :heart_eyes:";
  }
  else if (nb_absent != 0) {
    list_absent = "**" + nb_absent + " joueurs :**"
    for (let i = 0; i < nb_absent; i++) {
      list_absent += " :x:<@" + playerLists[2][i] + ">";
      if (i != nb_absent) {
        list_absent += ", ";
      }
    }
  }
  Messagelist(AuthorID, list_present, list_retard, list_absent);
}

export async function cmdclass() {
  const list = await listclass();
  const options = [];
  for (let i = 0; i < list.length; i++) {
    options.push({
      label: list[i].ClasseFR,
      value: list[i].ID.toString(),
    }
    );
  }

  return options
}

// command resetmsggvg
export async function cmdresetmsggvg(BotReaction, TODOBotReaction) {
  const db = new sqlite3.Database('../database/databaseGvG.db');
  const updateQuery = `SELECT IDMessageGvG FROM GestionBot WHERE ID = 1;`;
  const getIdMsg = () => {
    return new Promise((resolve, reject) => {
      db.get(updateQuery, [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          const id_msg = row ? row.IDMessageGvG : null;
          resolve(id_msg);
        }
      });
    });
  };
  const id_msg = await getIdMsg();
  db.close();

  // suppression du précédent message d'inscription
  client.channels.cache.get(TODOBotReaction).messages.fetch(id_msg).then(message => message.delete());
  msgreactgvg(BotReaction);
}
