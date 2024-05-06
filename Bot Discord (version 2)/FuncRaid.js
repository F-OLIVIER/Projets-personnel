import { db } from './Constant.js';

export function Resetsc() {
  var AllValue = db.data.Users;
  for (let CurrentPlayer = 0; CurrentPlayer < AllValue.length; CurrentPlayer++) {
    AllValue[CurrentPlayer].NextRaid = 0;
    AllValue[CurrentPlayer].DisplayNameList = '';
    AllValue[CurrentPlayer].MNDR = 0;
    AllValue[CurrentPlayer].nbEmoji = 0;
  }
  db.data.ListNextRaid = [];
  db.write();
}

export function Resetraz() {
  let AllValue = db.data.Users;
  for (let CurrentPlayer = 0; CurrentPlayer < AllValue.length; CurrentPlayer++) {
    AllValue[CurrentPlayer].NextRaid = 0;
    AllValue[CurrentPlayer].TotalRaid = 0;
    AllValue[CurrentPlayer].Assiduity = 0;
    AllValue[CurrentPlayer].DisplayNameList = '';
    AllValue[CurrentPlayer].TrustIndicator = 0;
    AllValue[CurrentPlayer].MNDR = 0;
    AllValue[CurrentPlayer].nbEmoji = 0;
  }
  db.data.ListNextRaid = [];
  db.write();
}

export function Resetac() {
  var AllValue = db.data.Users;

  for (var CurrentPlayer = 0; CurrentPlayer < AllValue.length; CurrentPlayer++) {
    // si le joueur été present sur le vocal pendant la GvG, incrémentation de TrustIndicator
    // Reset du check des presence en même temps
    if(AllValue[CurrentPlayer].MNDR >= 6){
      AllValue[CurrentPlayer].TrustIndicator += 1;
      AllValue[CurrentPlayer].MNDR = 0;
    } else if(AllValue[CurrentPlayer].MNDR != 0){
      AllValue[CurrentPlayer].MNDR = 0;
    }

    // Modification des nombre de raid en focntion de l'inscription
    if (AllValue[CurrentPlayer].NextRaid == 0) //si non inscrit
    {
      AllValue[CurrentPlayer].TotalRaid += 1;
    }
    else if (AllValue[CurrentPlayer].NextRaid == 3) //si absent
    {
      AllValue[CurrentPlayer].TotalRaid += 1;
      AllValue[CurrentPlayer].NextRaid = 0;
    }
    else if (AllValue[CurrentPlayer].NextRaid == 1) //si present
    {
      AllValue[CurrentPlayer].TotalRaid += 1;
      AllValue[CurrentPlayer].Assiduity += 1;
      AllValue[CurrentPlayer].NextRaid = 0;
    }
    else if (AllValue[CurrentPlayer].NextRaid == 2) //si en retard
    {
      AllValue[CurrentPlayer].TotalRaid += 1;
      AllValue[CurrentPlayer].Assiduity += 1;
      AllValue[CurrentPlayer].NextRaid = 0;
    }
    AllValue[CurrentPlayer].nbEmoji = 0;
  }
  db.data.ListNextRaid = [];
  db.write();
}

export function MAJPresent(AuthorID) {
  db.data.Users.find(user => user.DiscordID == AuthorID).NextRaid = 1;
  let DisplayName = db.data.Users.find(user => user.DiscordID == AuthorID).DisplayName;
  let DisplayNameList1 = " :white_check_mark: " + DisplayName;
  db.data.Users.find(user => user.DiscordID == AuthorID).DisplayNameList = DisplayNameList1;
  db.write();
}

export function MAJRetard(AuthorID) {
  db.data.Users.find(user => user.DiscordID == AuthorID).NextRaid = 2;
  let DisplayName = db.data.Users.find(user => user.DiscordID == AuthorID).DisplayName;
  let DisplayNameList2 = " :clock2: " + DisplayName;
  db.data.Users.find(user => user.DiscordID == AuthorID).DisplayNameList = DisplayNameList2;
  db.write();
}

export function MAJAbsent(AuthorID) {
  db.data.Users.find(user => user.DiscordID == AuthorID).NextRaid = 3;
  let DisplayName = db.data.Users.find(user => user.DiscordID == AuthorID).DisplayName;
  let DisplayNameList3 = " :x: " + DisplayName;
  db.data.Users.find(user => user.DiscordID == AuthorID).DisplayNameList = DisplayNameList3;
  db.write();
}

export function MAJListNextRaid(AuthorID) {
  let PushOk = true;
  // Si non inscrit dans listNextRaid
  for (let x = 0; x < db.data.ListNextRaid.length; x++) { 
    if (db.data.ListNextRaid[x] == AuthorID) {
      PushOk = false;
    }
  }
  // Si deja inscrit dans listNextRaid
  for (let x = 3; x == db.data.ListNextRaid.length; x++) { 
    if (db.data.ListNextRaid[x] == AuthorID) {
      PushOk = false;
    }
  }
  if (PushOk == true) {
    db.data.ListNextRaid.push(AuthorID);
    db.write();
  }
}
