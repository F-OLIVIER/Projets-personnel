// import des modules npm
import { google } from 'googleapis';
import * as fs from 'fs'

// import des fichiers utilisé
import { db, GspreadsheetID } from './Constant.js';

// site google : https://developers.google.com/drive/labels/quickstart/nodejs?hl=fr
// npm googleapis : https://www.npmjs.com/package/googleapis
// https://gist.github.com/Alhamou/10d5dcfc338c4e5a33485029b6d23b9d
// https://blog.stephsmith.io/tutorial-google-sheets-api-node-js/

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

export const AuthCALL = async function SheetAPI(FunctionToCall) {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), FunctionToCall);
  });

  // Créez un client OAuth2 avec les informations d'identification fournies, puis exécutez la fonction de rappel donnée.
  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Vérifiez si nous avons déjà stocké un jeton.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  // Obtenez et stockez un nouveau jeton après avoir demandé l'autorisation de l'utilisateur, puis exécutez le rappel donné avec le client OAuth2 autorisé.
  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);

        // Stockez le jeton sur le disque pour les exécutions ultérieures du programme
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }
};


// mise à jour du Google doc (commande present, absent et retard)
export async function UpdateNextRaid(auth) {
  let ListNextRaid = db.data.ListNextRaid;
  let ToSend = new Array();

  for (let x = 0; x < ListNextRaid.length; x++) {
    let temp = db.data.Users.find(user => user.DiscordID == ListNextRaid[x])

    // Pourcentage de presence
    let PP = Math.round(temp.Assiduity / temp.TotalRaid * 100);
    // Indice de confiance des présences
    let IC = Math.round(temp.TrustIndicator / temp.Assiduity * 100);
    
    ToSend.push([
      temp.DiscordRole,
      temp.DisplayName,
      temp.GameCharacter,
      temp.Lvl,
      temp.Influ,
      temp.NextRaid,
      PP,
      IC
    ]);
  }

  let sheets = google.sheets({ version: 'v4', auth });
  // TODO :Nom de la feuille ou le bot écrit les inscriptions
  const data = [{
    range: 'Import_discord!A2:H' + (db.data.ListNextRaid.length + 2),
    values: ToSend
  }];
  let resource = { data, valueInputOption: "USER_ENTERED", };
  sheets.spreadsheets.values.batchUpdate({ spreadsheetId: GspreadsheetID, resource: resource }, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
    }
  });
}

// mise a jour de la page stat du google doc
export async function Stat(auth) {
  let Stat = db.data.Users;
  // Trie des joueurs par % de presence
  Stat.sort(function (PlayerA, PlayerB) {
    // Pourcentage de présence du joueur A
    let PPA = Math.round(PlayerA.Assiduity / PlayerA.TotalRaid * 100);
    // Pourcentage de présence du joueur B
    let PPB = Math.round(PlayerB.Assiduity / PlayerB.TotalRaid * 100);

    if (PPA < PPB) {
      return 1;
    }
    if (PPA > PPB) {
      return -1;
    }
    if (PlayerA.TotalRaid < PlayerB.TotalRaid) {
      return 1;
    }
    if (PlayerA.TotalRaid > PlayerB.TotalRaid) {
      return -1;
    }
    return 0;
  });
  
  let ToSend = new Array();

  for (let x = 0; x < Stat.length; x++) {
    let temp = Stat[x];

    let PP = 0;
    let IC = 0;
    if (temp.Assiduity != 0) {
      PP = Math.round(temp.Assiduity / temp.TotalRaid * 100);
    }
    if (temp.TrustIndicator != 0 && temp.Assiduity != 0) {
      IC = Math.round(temp.TrustIndicator / temp.Assiduity * 100);
    }

    ToSend.push([
      temp.DisplayName,
      temp.DiscordRole,
      temp.TotalRaid,
      temp.Assiduity,
      PP,
      IC,
      temp.Lvl,
      temp.Influ,
      temp.GameCharacter
    ]);
  }
  let sheets = google.sheets({ version: 'v4', auth });
  // TODO : Nom de la feuille statistique ou le bot écrit
  const data = [{
    range: 'Stat_Bot!A4:I' + (ToSend.length + 8),
    values: ToSend
  }];
  let resource = { data, valueInputOption: "USER_ENTERED", };

  sheets.spreadsheets.values.batchUpdate({ spreadsheetId: GspreadsheetID, resource: resource }, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
    }
  });
}

// effacement du google doc
export async function efface(auth) {
  let ToSend1 = new Array();
  ToSend1.push(['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', '']);
  let ToSend2 = new Array();
  ToSend2.push([''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], [''], ['']);
  let ToSend3 = new Array();
  ToSend3.push(['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']);

  let sheets = google.sheets({ version: 'v4', auth });
  // TODO : emplacement de la feuille ou le bot efface
  const data = [{ range: 'Import_discord!A2:I', values: ToSend1 }, { range: 'Creation_groupe!G2:G', values: ToSend2 }, { range: 'Creation_groupe!AG16:AG', values: ToSend2 }, { range: 'Creation_groupe!AB16:AE', values: ToSend3 }];
  let resource = { data, valueInputOption: "USER_ENTERED", };
  sheets.spreadsheets.values.batchUpdate({ spreadsheetId: GspreadsheetID, resource: resource }, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
    }
  });
}
