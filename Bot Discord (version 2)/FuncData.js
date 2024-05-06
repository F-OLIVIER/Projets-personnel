// fichier annexe
import { db, DiscordUnauthorizedRole, ServerID, client } from './Constant.js';

// fonction de creation et de mise a jour d'un utilisateur de la base de donnée lowdb
export async function PlayerCreateOrUpdate(MemberID){
  // Récupération des infos serveur
  let serv = await client.guilds.fetch(ServerID);
  // Récupération des infos du joueur ayant l'id "MemberID"
  let guildMember = await serv.members.fetch(MemberID);
  let MemberHightestRole = guildMember.roles.highest;
  let MemberHightestRoleName = MemberHightestRole.name;
  let BooleanPlayerCanBeAdd = true

  DiscordUnauthorizedRole.forEach(function(CurrentDiscordUnauthorizedRole) {
    // TODO : Changer la liste des roles interdits dans Constant.js (CurrentDiscordUnauthorizedRole)
    if (MemberHightestRole == CurrentDiscordUnauthorizedRole){
      BooleanPlayerCanBeAdd = false
    }  
  })
    
  if (BooleanPlayerCanBeAdd == true){
    let MemberDisplayName = guildMember.displayName;
               
    if(MemberHightestRoleName == "@everyone"){
      MemberHightestRoleName = "pas de role specifique";
    }

    // si utilisateur dejà existant (mise à jour pseudo et role discord)
    if(db.data.Users.find( user => user.DiscordID == MemberID )){
      let userIndb = db.data.Users.find( user => user.DiscordID == MemberID );
      userIndb.DisplayName =  MemberDisplayName;
      userIndb.DiscordRole = MemberHightestRoleName;

      db.write();
      console.log('PlayerExistant : ' + MemberDisplayName);
    } else { // sinon, création de l'utilisateur
      let MemberGameCharacter = "Erreur";
      db.data.Users.push({DiscordID: MemberID, DisplayName: MemberDisplayName, GameCharacter: MemberGameCharacter, DiscordRole: MemberHightestRoleName, NextRaid: 0 , Assiduity: 0, TotalRaid: 0, Lvl: 0, Influ: 700, MNDR: 0, TrustIndicator: 0, NameNonInscrit: " <@"+ MemberID +">", nbEmoji: 0 });
      db.write();
      console.log('New user : ' + MemberDisplayName);
    }
  }
}
