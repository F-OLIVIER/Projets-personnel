// Fichier annexe
import { adressdb } from './config.js';

// module nodejs et npm
import moment from 'moment-timezone';
import sqlite3 from 'sqlite3';

export function Resetsc() {
  const db = new sqlite3.Database(adressdb);
  const updateQuery = `UPDATE Users SET EtatInscription = 0, NbEmojiInscription = 0;`;

  db.run(updateQuery, function (error) {
    if (error) {
      console.error(error.message);
    }
  });
  db.close();

  deleteListGvG();
}

export function Resetraz() {
  const db = new sqlite3.Database(adressdb);
  const updateQuery = `UPDATE Users SET EtatInscription = 0, NbEmojiInscription = 0, TrustIndicator = 0, NbGvGParticiped = 0;`;

  db.run(updateQuery, function (error) {
    if (error) {
      console.error(error.message);
    }
  });
  db.close();

  deleteListGvG();
}

export function Resetac() {
  const dateformate = new Date();
  const jour = dateformate.getDate().toString().padStart(2, '0');
  const mois = (dateformate.getMonth() + 1).toString().padStart(2, '0');
  const annee = dateformate.getFullYear();
  const dateFrenchFormat = `${jour}/${mois}/${annee}`;

  const insertQuery = `INSERT INTO HistoryGvG (User_ID, DateGvG, Valid)
                        SELECT ID, ?, 
                              CASE 
                                  WHEN MNDR >= 6 THEN 1
                                  ELSE 0
                              END AS Valid
                        FROM Users
                        WHERE EtatInscription = 1 AND DiscordID = ?;`;
  //Mise a jour de la table User
  const updateQuery = `UPDATE Users
                      SET
                        TrustIndicator = TrustIndicator + CASE 
                                                  WHEN MNDR >= 6 THEN 1
                                                  ELSE 0 END,
                        DateLastGvGParticiped = CASE
                                                  WHEN EtatInscription IN (1, 2, 3) THEN ?
                                                  ELSE DateLastGvGParticiped
                                                END,
                        NbGvGParticiped = NbGvGParticiped + CASE
                                                  WHEN EtatInscription IN (1, 2, 3) THEN 1
                                                  ELSE 0
                                                END,
                        MNDR = 0,
                        EtatInscription = 0,
                        NbEmojiInscription = 0,
                        NbTotalGvG = NbTotalGvG + 1
                        WHERE DiscordID = ?;`;


  const getAllUsers = async () => {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(adressdb);
      const selectQuery = `SELECT DiscordID FROM Users;`;
      db.all(selectQuery, [], (err, rows) => {
        if (err) {
          console.error(err);
          resolve([]);
        } else {
          resolve(rows);
        }
      });
      db.close();
    });
  };

  getAllUsers().then((users) => {
    const db = new sqlite3.Database(adressdb);
    let isError = false;
    for (const user of users) {
      db.run(insertQuery, [dateFrenchFormat, user.DiscordID], (err1) => { // INSERT table HistoryGvG
        if (err1) {
          console.log("err1 getAllUsers (Resetac) : ", err1);
          isError = true;
        } else {
          db.run(updateQuery, [dateFrenchFormat, user.DiscordID], (err2) => { // UPDATE table users
            if (err2) {
              console.log("err2 getAllUsers (Resetac) : ", err2);
              isError = true;
            }
          });
        }
      });
      if (isError) {
        break;
      }
    }
    db.close();
  }).catch((error) => {
    console.error(error);
  });

  deleteListGvG();
}

function deleteListGvG() {
  const db = new sqlite3.Database(adressdb);
  db.run("DELETE FROM GroupGvG", function (error) {
    if (error) {
      console.error(error.message);
    }
  });
  db.close();
}


export function MAJPresent(DiscordID) { // EtatInscription = 1
  const db = new sqlite3.Database(adressdb);
  const sql = "SELECT NbEmojiInscription FROM Users WHERE DiscordID = ?";

  db.get(sql, [DiscordID], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row) {
      const updatedNbEmojiInscription = row.NbEmojiInscription + 1;
      const updateQuery = `UPDATE Users SET EtatInscription = 1, NbEmojiInscription = ? WHERE DiscordID = ?;`;
      db.run(updateQuery, [updatedNbEmojiInscription, DiscordID], function (error) {
        if (error) {
          console.error(error.message);
        }
      });
    }
  });
  db.close();
}

export function MAJRetard(DiscordID) { // EtatInscription = 2
  const db = new sqlite3.Database(adressdb);
  const sql = "SELECT NbEmojiInscription FROM Users WHERE DiscordID = ?";

  db.get(sql, [DiscordID], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row) {
      const updatedNbEmojiInscription = row.NbEmojiInscription + 1;
      const updateQuery = `UPDATE Users SET EtatInscription = 2, NbEmojiInscription = ? WHERE DiscordID = ?;`;
      db.run(updateQuery, [updatedNbEmojiInscription, DiscordID], function (error) {
        if (error) {
          console.error(error.message);
        }
      });
    }
  });
  db.close();
}

export function MAJAbsent(DiscordID) { // EtatInscription = 3
  const db = new sqlite3.Database(adressdb);
  const sql = "SELECT NbEmojiInscription FROM Users WHERE DiscordID = ?";

  db.get(sql, [DiscordID], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row) {
      const updatedNbEmojiInscription = row.NbEmojiInscription + 1;
      const updateQuery = `UPDATE Users SET EtatInscription = 3, NbEmojiInscription = ? WHERE DiscordID = ?;`;
      db.run(updateQuery, [updatedNbEmojiInscription, DiscordID], function (error) {
        if (error) {
          console.error(error.message);
        }
      });
    }
  });
  db.close();
}

export function removeInscription(DiscordID) {
  const db = new sqlite3.Database(adressdb);
  const sql = "SELECT EtatInscription, NbEmojiInscription FROM Users WHERE DiscordID = ?";

  db.get(sql, [DiscordID], (err, row) => {
    if (err) {
      console.error(err.message);
      db.close();
      return;
    }

    if (row) {
      let updateQuery;
      let NbEmojiInscription = row.NbEmojiInscription - 1;
      let EtatInscription;

      if (NbEmojiInscription === 0) {
        EtatInscription = 0;
        updateQuery = `UPDATE Users SET EtatInscription = ?, NbEmojiInscription = ? WHERE DiscordID = ?;`;
        db.run(updateQuery, [EtatInscription, NbEmojiInscription, DiscordID], function (error) {
          if (error) {
            console.error(error.message);
          }
        });
      } else {
        updateQuery = `UPDATE Users SET NbEmojiInscription = ? WHERE DiscordID = ?;`;
        db.run(updateQuery, [NbEmojiInscription, DiscordID], function (error) {
          if (error) {
            console.error(error.message);
          }
        });
      }
    }
  });
  db.close();
}
