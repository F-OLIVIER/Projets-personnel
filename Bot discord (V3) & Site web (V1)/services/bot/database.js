// Fichier annexe
import { NewUser, UserLeaveDiscord } from './Constant.js';
import { adressdb } from './config.js';

// module nodejs et npm
import sqlite3 from 'sqlite3';

export async function CreateOrUpdateUser(data) {
    const db = new sqlite3.Database(adressdb);
    const sql = "SELECT DiscordID FROM Users WHERE DiscordID = ?";

    db.all(sql, [data.DiscordID], (err, rows) => {
        if (!err) {
            if (rows && rows.length > 0) {
                // Utilisateur existant, effectuer la mise à jour
                const updateQuery = `UPDATE Users SET DiscordName = ?, DiscordBaseName = ?, DiscordRole = ?, DiscordPhoto = ? WHERE DiscordID = ?;`;
                db.run(updateQuery, [data.DiscordName, data.DiscordBaseName, data.DiscordRole, data.DiscordPhoto, data.DiscordID], function (error) {
                    if (error) {
                        console.error(error.message);
                    }
                });
            } else {
                NewUser(data.DiscordID);
                // Utilisateur inexistant, effectuer l'insertion
                const insertQuery = `INSERT INTO Users (DiscordID, DiscordName, DiscordBaseName, DiscordRole, DiscordPhoto, GameCharacter_ID, Lvl, EtatInscription, NbEmojiInscription, TrustIndicator, Influence, MNDR, NbGvGParticiped, NbTotalGvG, DateLastGvGParticiped) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
                db.run(insertQuery, [data.DiscordID, data.DiscordName, data.DiscordBaseName, data.DiscordRole, data.DiscordPhoto, 0, 0, -1, 0, 0, 700, 0, 0, 0, "jamais / never"], function (err) {
                    if (err) {
                        console.error(err.message);
                    }
                });
            }
        } else {
            console.error("CreateOrUpdateUser :\n", err.message);
        }

        db.close();
    });
}

export async function userInfo(user_id) {
    const db = new sqlite3.Database(adressdb);

    return new Promise((resolve, reject) => {
        const selectQuery = `
            SELECT DiscordID, DiscordName, DiscordRole, DiscordPhoto,
                   Lvl, Influence, EtatInscription, NbGvGParticiped, NbTotalGvG, GameCharacter_ID, DateLastGvGParticiped
            FROM Users
            WHERE DiscordID = ?;`;

        db.get(selectQuery, [user_id], (err, row) => {
            db.close();

            if (err) {
                console.error(err.message);
                reject(err);
                return;
            }

            if (row) {
                resolve(row);
            }
        });
    });
}

export async function classPlay(idClass) {
    const db = new sqlite3.Database(adressdb);
    const getclassPlay = async () => {
        return new Promise((resolve, reject) => {
            const requestQuery = `SELECT ClasseFR FROM ListGameCharacter WHERE ID = ?;`;
            db.all(requestQuery, idClass, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };
    const classPlay = await getclassPlay();
    db.close();
    return classPlay[0].ClasseFR;
}

export async function unregisteredList() {
    const db = new sqlite3.Database(adressdb);
    const getUnregisteredUsers = async () => {
        return new Promise((resolve, reject) => {
            const requestQuery = `SELECT DiscordID FROM Users WHERE EtatInscription = 0;`;
            db.all(requestQuery, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    const list = await getUnregisteredUsers();
    db.close();
    let discordNamesList = "";
    for (let i = 0; i < list.length; i++) {
        discordNamesList += "<@" + list[i].DiscordID + ">";
        if (i !== list.length - 1) {
            discordNamesList += ", ";
        }
    }

    return discordNamesList;
}

export async function isOfficier(AuthorID) {
    const db = new sqlite3.Database(adressdb);
    const getcisOfficier = async () => {
        return new Promise((resolve, reject) => {
            const requestQuery = `SELECT DiscordRole FROM Users WHERE DiscordID = ?;`;
            db.all(requestQuery, AuthorID, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };
    const off = await getcisOfficier();
    db.close();
    if (off === "Officier" || off[0].DiscordRole === "Officier") {
        return true
    }
    return false
}

export async function isOfficierOrMember(AuthorID) {
    const db = new sqlite3.Database(adressdb);
    const getcisOfficierOrMember = async () => {
        return new Promise((resolve, reject) => {
            const requestQuery = `SELECT DiscordRole FROM Users WHERE DiscordID = ?;`;
            db.all(requestQuery, AuthorID, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };
    const role = await getcisOfficierOrMember();
    db.close();
    console.log('role : \n', role)
    if (role[0].DiscordRole === 'Officier' || role[0].DiscordRole === 'Membre') {
        return true
    }
    return false
}

// ------------------------------------------------------------
// --------------- mise à jour de l'utilisateur ---------------
// ------------------------------------------------------------

export async function listclass() {
    const db = new sqlite3.Database(adressdb);
    const getlistclass = async () => {
        return new Promise((resolve, reject) => {
            const requestQuery = `SELECT ID, ClasseFR FROM ListGameCharacter;`;
            db.all(requestQuery, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    const list = await getlistclass();
    db.close();
    return list;
}

export function updateclass(AuthorID, GameCharacter_ID) {
    const db = new sqlite3.Database(adressdb);
    const updateQuery = `UPDATE Users SET GameCharacter_ID = ? WHERE DiscordID = ?;`;
    db.run(updateQuery, [GameCharacter_ID, AuthorID],
        function (error) {
            if (error) throw error;
            return false
        }
    );
    db.close();
    return true
}

export function updateLvl(AuthorID, lvl) {
    const db = new sqlite3.Database(adressdb);
    const updateQuery = `UPDATE Users SET Lvl = ? WHERE DiscordID = ?;`;
    db.run(updateQuery, [lvl, AuthorID],
        function (error) {
            if (error) throw error;
        }
    );
    db.close();
}

export function updateInflu(AuthorID, influ) {
    const db = new sqlite3.Database(adressdb);
    const updateQuery = `UPDATE Users SET Influence = ? WHERE DiscordID = ?;`;
    db.run(updateQuery, [influ, AuthorID],
        function (error) {
            if (error) throw error;
        }
    );
    db.close();
}

export function deleteUser(member, BotChanOfficier) {
    const db = new sqlite3.Database(adressdb);
    const sql = "SELECT ID, DiscordName FROM Users WHERE DiscordID = ?";

    db.get(sql, [member.user.id], (err, row) => {
        if (!err && row) {
            // console.error("Utilisateur ", row.DiscordName, " supprimer, id : ", member.user.id);
            UserLeaveDiscord(BotChanOfficier, member.user.displayName, member.user.username)

            const userID = row.ID;
            const listQuery = [
                `DELETE FROM Caserne WHERE User_ID = ?;`,
                `DELETE FROM CaserneMaitrise WHERE User_ID = ?;`,
                `DELETE FROM GroupGvG WHERE User_ID = ?;`,
                `DELETE FROM GroupTypeAtt WHERE User_ID = ?;`,
                `DELETE FROM GroupTypeDef WHERE User_ID = ?;`,
                `DELETE FROM HistoryGvG WHERE User_ID = ?;`,
                `DELETE FROM Users WHERE ID = ?;`

            ];

            listQuery.forEach(deleteQuery => {
                db.run(deleteQuery, [userID], function (error) {
                    if (error) throw error;
                });
            });
        } else if (err) {
            console.error('Error delete ', member.user.id, ' user :\n', err.message);
        }
        db.close();
    });
}

// ------------------------------------------------------------
// ------------- mise à jour de la gestion du bot -------------
// ------------------------------------------------------------

export function updateIdMessage(newMessageId) {
    const db = new sqlite3.Database(adressdb);
    const updateQuery = `UPDATE GestionBot SET IDMessageGvG = ? WHERE ID = 1;`;
    db.run(updateQuery, newMessageId,
        function (error) {
            if (error) throw error;
        }
    );
    db.close();
}

// option 0 = on, option 1 = off
export function updateActivationBot(option) {
    const db = new sqlite3.Database(adressdb);
    const updateQuery = `UPDATE GestionBot SET Allumage = ? WHERE ID = 1;`;
    db.run(updateQuery, option,
        function (error) {
            if (error) throw error;
        }
    );
    db.close();
}

export function botOn(message_id) {
    const db = new sqlite3.Database(adressdb);
    const selectQuery = `SELECT IDMessageGvG FROM GestionBot WHERE ID = 1;`;

    return new Promise((resolve, reject) => {
        db.get(selectQuery, (err, row) => {
            db.close();
            if (err) {
                console.log("err botOn : ", err);
                reject(err);
            } else {
                if (row && row.IDMessageGvG === message_id) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
}

export async function etatmsgGvG() {
    const db = new sqlite3.Database(adressdb);
    const getetatmsg = async () => {
        return new Promise((resolve, reject) => {
            const requestQuery = `SELECT Allumage FROM GestionBot WHERE ID = 1;`;
            db.all(requestQuery, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    const idmsg = await getetatmsg();
    db.close();
    return idmsg;
}

export async function IDmsgGvG() {
    const db = new sqlite3.Database(adressdb);
    const getIDmsg = async () => {
        return new Promise((resolve, reject) => {
            const requestQuery = `SELECT IDMessageGvG FROM GestionBot WHERE ID = 1;`;
            db.all(requestQuery, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    const idmsg = await getIDmsg();
    db.close();
    return idmsg;
}


export async function listInscription() {
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

    // console.log('playerLists : ', playerLists); 
    // index 0 present, 1 retard, 2 absent
    return playerLists
}


// ------------------------------------------------------------
// --------------------- Evenements divers --------------------
// ------------------------------------------------------------

export async function createeventindb(title, description, date) {
    const db = new sqlite3.Database(adressdb);

    return new Promise((resolve, reject) => {
        const insertQuery = `INSERT INTO ListEvent (Title, Descriptions, Dates) VALUES (?, ?, ?);`;

        db.run(insertQuery, [title, description, date], function (err) {
            if (err) {
                console.error('Error createeventindb :\n', err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
            db.close();
        });
    });
}

export async function ListEvent() {
    const db = new sqlite3.Database(adressdb);
    const getlistevent = async () => {
        return new Promise((resolve, reject) => {
            const requestQuery = `SELECT * FROM ListEvent;`;
            db.all(requestQuery, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    const list = await getlistevent();
    db.close();
    return list;
}

export async function ListInscriptedEvent(idevent) {
    const db = new sqlite3.Database(adressdb);
    const getlistInscripted = async () => {
        return new Promise((resolve, reject) => {
            const requestQuery = `SELECT Users.DiscordName
            FROM Users
            INNER JOIN EventInscripted ON Users.id = EventInscripted.User_ID 
            WHERE EventInscripted.IDevent = ?`;
            db.all(requestQuery, [idevent], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    const list = await getlistInscripted();
    db.close();
    return list;
}

// export function existEvent(IDevent) {
//     return new Promise((resolve, reject) => {
//         const db = new sqlite3.Database(adressdb);
//         const selectQuery = `SELECT ID FROM ListEvent WHERE ID = ?;`;

//         db.get(selectQuery, [IDevent], (error, row) => {
//             db.close();

//             if (error) {
//                 console.error('Error querying existing event:\n', error.message);
//                 reject(error);
//             } else {
//                 if (row) {
//                     resolve(true);
//                 } else {
//                     resolve(false);
//                 }
//             }
//         });
//     });
// }

export async function InscriptionEvent(discordIdAuthor, IDevent) {
    const db = new sqlite3.Database(adressdb);

    return new Promise((resolve, reject) => {
        // Vérifier si l'utilisateur est déjà inscrit à cet événement
        const checkQuery = `SELECT COUNT(*) AS count FROM EventInscripted WHERE IDevent = ? AND User_ID = (SELECT ID FROM Users WHERE DiscordID = ?)`;
        db.get(checkQuery, [IDevent, discordIdAuthor], (err, row) => {
            if (err) {
                console.error('Error checking existing inscription:\n', err.message);
                reject(err);
                return;
            }

            // Si l'utilisateur est déjà inscrit, renvoyer false
            if (row.count > 0) {
                resolve(false);
                return;
            }

            // Insérer l'utilisateur à l'événement
            const insertQuery = `INSERT INTO EventInscripted (IDevent, User_ID)
                VALUES (?, (SELECT ID FROM Users WHERE DiscordID = ?));`;
            db.run(insertQuery, [IDevent, discordIdAuthor], function (err) {
                if (err) {
                    console.error('Error inserting inscription:\n', err.message);
                    reject(err);
                    return;
                } else {
                    resolve(true);
                }

                db.close();
            });
        });
    });
}

export async function CancelEventInscription(discordIdAuthor, IDevent) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(adressdb);
        const deleteQuery = `DELETE FROM EventInscripted WHERE IDevent = ? AND User_ID = (SELECT ID FROM Users WHERE DiscordID = ?);`;

        db.run(deleteQuery, [IDevent, discordIdAuthor], function (error) {
            db.close();

            if (error) {
                console.error('Error deleting existing inscription:\n', error.message);
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}

export async function DeleteEvent(IDevent) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(adressdb);
        const deleteQuery = `DELETE FROM EventInscripted WHERE IDevent = ?;
                            DELETE FROM ListEvent WHERE ID = ?`;

        db.run(deleteQuery, [IDevent], function (error) {
            db.close();

            if (error) {
                console.error('Error DeleteEvent:\n', error.message);
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}

export async function existEvent(eventId) {
    const db = new sqlite3.Database(adressdb);
    try {
        const getEvent = () => {
            return new Promise((resolve, reject) => {
                const requestQuery = `SELECT ID FROM ListEvent WHERE ID = ?`;
                db.all(requestQuery, [eventId], (err, rows) => {
                    if (err) {
                        reject(false);
                    } else {
                        resolve(true);
                    }
                });
            });
        };

        const result = await getEvent();
        return result;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        db.close();
    }
}