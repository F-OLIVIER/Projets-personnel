// Fichier annexe
import { AuthCALL, efface } from './FuncGoogleSHEET.js';
import { Resetac } from './FuncRaid.js';
import { client, db } from './Constant.js';
import { msgreactgvg } from './Reaction.js';

// Module nodejs et npm
import moment from 'moment-timezone';
import {} from 'dotenv/config';

// Fonction de check des presence pendant la GvG
export function cronCheckpresence(idCategorie) {
    var category = client.channels.cache.get(idCategorie);
    category.children.cache.forEach(function(CurrentChan) {
      if(CurrentChan.type == 2){ // 2 = type voice
        // ID des channels à checker pour les présences pendant la GvG
        CurrentChan.members.forEach(function(CurrentMember) {
          // console.log("id :", CurrentMember.user.id,", username :", CurrentMember.user.username);
          let temp = db.data.Users.find(user => user.DiscordID == CurrentMember.user.id);
          temp.MNDR += 1
          db.write()
        })
      }
    });
}

// fonction de changement automatique du message de réaction à 21h mardi et samedi
export function cronResetMsgReaction(BotReaction, TODOBotReaction, idrole) {
    var CurrentDate = new Date(Date.now() + (moment().tz("Europe/Paris").utcOffset()*60*1000));
    var Allumage = db.data.gestion.allumage;
    if(Allumage=="on"){

      // gestion de la date futur pour le message
      var now = moment();
      var day = now.day(); // 2 mardi, 6 samedi
      console.log("day : " + day); 
  
      // si mardi, annonce du samedi et si Samedi, annonce du mardi
      var futurdate;
      if (day == 2) { // Cronjob du mardi (jour 2)
        futurdate = moment().add(4, 'days');
      } else if (day == 6) { // Cronjob du samedi (jour 6)
        futurdate = moment().add(3, 'days');
      }

      // génére la date au bon format
      const futurdateformate = new Date(futurdate + (moment().tz("Europe/Paris").utcOffset()));
      // récupération du jour, de la date et du mois
      var jour  = futurdateformate.getDay();
      var date = futurdateformate.getDate();
      var mois  = futurdateformate.getMonth();

      // Suppression du message d'inscription GvG
      var id_msg =  db.data.gestion.id_message;
      client.channels.cache.get(TODOBotReaction).messages.fetch(id_msg).then(message => message.delete());
      Resetac();
      AuthCALL(efface);
      msgreactgvg(BotReaction, jour, mois, date, idrole);
      // MessageEndRaid(BotChan);
      } else{
      console.log("Fonction automatique resetmsgreact à l'arret : " + CurrentDate);
    }
}

// fonction de sauveragrde auto de la db
export async function cronsavedb(usermpgetsaveBDD) {
    var privatemessage3 = await client.users.fetch(usermpgetsaveBDD);
    var CurrentDate = new Date(Date.now() + (moment().tz("Europe/Paris").utcOffset()*60*1000));
    var Allumage = db.data.gestion.allumage;
    if(Allumage=="on"){
      privatemessage3.send({
        content: "Sauvegarde automatique de la BDD\n" + CurrentDate,
        files: ['./db.json']
      })
    }
    else{
      console.log("Fonction automatique savedb à l'arret : " + CurrentDate);
    }
}

// fonction de message de rappel auto
// export async function cronrappelinscription(Botrappel, channel, idrole) {
 //    var CurrentDate = new Date(Date.now() + (moment().tz("Europe/Paris").utcOffset()*60*1000));
 //    var Allumage = db.data.gestion.allumage;
 //   if(Allumage=="on"){
 //     Messagerappel(Botrappel, channel, idrole);
 //   }
 //   else{
 //     console.log("Fonction automatique rappelLV à l'arret : " + CurrentDate);
 //   }
// }
