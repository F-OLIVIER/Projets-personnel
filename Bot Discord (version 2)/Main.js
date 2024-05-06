// Fichier annexe
import { PlayerCreateOrUpdate } from './FuncData.js';
import { AuthCALL, efface, UpdateNextRaid, Stat } from './FuncGoogleSHEET.js';
import { Resetsc, Resetac, Resetraz } from './FuncRaid.js';
import { client, db, ServerID, Messageinfo, BooleanAdmin, Messagelvlok, Messageinfluok, Messagegvg, privatemp, Messageprivatemp, Messageinfoadmin, MessageInsufficientAuthority, Messageclean, MessageGdoc, Messagelvl, MessageResetDataRaid, Messageraz, Booleanusermp, MessageRaidon, MessageRaidoff, EmbedData, EmbedGuide, MessageStat, Messagerappel } from './Constant.js';
import { addReaction, removeReaction } from './Reaction.js';
import { cmdnb, cmdlist, cmdclass, cmdresetmsggvg, cmdgetsave, cmdrm } from "./CommandBot.js";
import { cronCheckpresence, cronResetMsgReaction, cronsavedb } from "./Cronjob.js"

// Module nodejs et npm
import {} from 'dotenv/config';
import { CronJob } from 'cron';
import delay from 'delay';

// --------------------------------------
// ------------- Adaptation -------------
// --------------------------------------

// id des chans (utilisateur, message reaction, message rappel, chan officier)
var TODOBotChan = '1116072099195404418'; // Profil GvG
var TODOBotReaction = '1116070586179932241'; // Vote GvG
var TODOBotrappel = '833328751240151070'; // Bazar conqueror
var TODOBotChanOfficier = '1116073158139723908'; // Log gvg
// chans vocaux GvG pour check des presences pendant la GvG
var ChanVocalGvG1 = '717569175161274458'
// Chan et utilisateur à cité dans le message privée
var TODOchangvg = '1116070586179932241'; // vote GvG
// Pour l'officier d'exemple à cité dans le message privée de rappel
var TODOutilisateurofficier = '438019087457583124'; // Berchoun
// Utilisateur qui reçois en message privée les sauvegardes automatique de la BDD
var TODOusermpgetsaveBDD = '179655652153491456'; // coincoin
// Catégorie des channels a checker pour les presences pendant la gvg
var idCategorie = '717569175161274458'; // loge conqueror
// Role a ping dans le message d'inscription GvG
var idrole = '951159160190427137';

// -------------------------------------
// ----------- Coeur du code -----------
// -------------------------------------

client.login(process.env.TOKEN);

client.on('ready', () => {
  // Message de confirmation du demarrage du bot dans la console
  console.log(`\n------------------------------\n----> Bot GvG LNB pret ! <----\n------------------------------\n`);
});

// Afficher les erreurs
client.on('error', console.error); 

// ajout d'une réaction
client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) {
    return;
  }

  // id du channel contenant le message d'inscription
  if ( reaction.message.channel.id == TODOBotReaction && reaction.message == db.data.gestion.id_message) {
    // Mise a jour du joueur dans la bd
    await PlayerCreateOrUpdate(user.id);
    // Ajout de la réaction
    await addReaction(reaction, user);
  } else {
      return;
  }
});

// Supression d'une réaction
client.on("messageReactionRemove", async (reaction, user) => {
  if (user.bot) {
    return;
  }
  if ( reaction.message.channel.id == TODOBotReaction && reaction.message == db.data.gestion.id_message) {
    // Mise a jour du joueur dans la bd
    await PlayerCreateOrUpdate(user.id);
    // Retrait de la réaction
    await removeReaction(reaction, user);
  }else {
      return;
  }
});

// definition des variables
const prefix = '!';
var BotChan;
var BotReaction;
var Botrappel;
var BotChanOfficier;

// definition des chan utilise par le bot
client.on('ready', function () {
  BotChan = client.channels.cache.get(TODOBotChan);
  BotReaction = client.channels.cache.get(TODOBotReaction);
  Botrappel = client.channels.cache.get(TODOBotrappel);
  BotChanOfficier = client.channels.cache.get(TODOBotChanOfficier);
  TaskHandle(BotChan, BotReaction, TODOBotReaction, Botrappel, TODOBotrappel, idrole, TODOusermpgetsaveBDD);
});
     
client.on('messageCreate', async message => {
  var MC = message.content.toLowerCase();
  var AuthorID = message.author.id;

  // Fonction de test
 // if (MC.startsWith(prefix + "test")){
 //     message.delete();
 // }

  // Définition des canaux ou le bot réagis : canal utilisateur GvG et canal Officier
  if ( message.channel.id == TODOBotChan || message.channel.id == TODOBotChanOfficier ){
    // mise a jour du joueur dans la bd
    await PlayerCreateOrUpdate(AuthorID);
    // delais d'attente que la base de données soit mise a jout (await ne semble pas suffire !!!)
    await delay(10);

    // donne les commandes du bot
    if (MC.startsWith(prefix + "info") || MC.startsWith(prefix + "aide")){
      Messageinfo(AuthorID,BotChan);
    }
 
    // donne les commande admin du bot
    if (MC.startsWith(prefix + "infoadmin")){
      if(BooleanAdmin(AuthorID) == true){
        Messageinfoadmin(AuthorID,BotChan);
      }
      else{
        MessageInsufficientAuthority(AuthorID,BotChan);
      }
    }

    // Commande /nb (donne les presences GvG)
    if (MC.startsWith(prefix + "nb")){
      cmdnb(AuthorID, BotChanOfficier);
      // message.delete();
    }  

    // Commande /list (donne la liste des presences GvG) 
    if (MC.startsWith(prefix + "list")){
      cmdlist(AuthorID, BotChanOfficier);
      // message.delete();
    }

    // Commande /clean (efface la page Groupe_Raid_Prototype sur le Gdoc)
    if (MC.startsWith(prefix + "clean")){
      if(BooleanAdmin(AuthorID)==true){
        AuthCALL(efface);
        Messageclean(AuthorID,BotChan);
      } 
      else {
        MessageInsufficientAuthority(AuthorID,BotChan);
      }
    }
      
    // Commande /clean (efface la page Groupe_Raid_Prototype sur le Gdoc)
    if (MC.startsWith(prefix + "rappel")){
      if(BooleanAdmin(AuthorID)==true){
          Messagerappel(Botrappel, TODOBotReaction, idrole);
      } 
      else {
        MessageInsufficientAuthority(AuthorID,BotChan);
      }
    }

    // donne les Gdoc du bot (canal officier)
    if (MC.startsWith(prefix + "gdoc")){
      MessageGdoc(AuthorID,BotChan);
    }
  
    // commande /lvl (4 caractéres)
    if (MC.startsWith(prefix + "lvl")){
      if (MC.substring(4,MC.length)>0){
        var lvl = MC.substring(4,MC.length);
        db.data.Users.find(user => user.DiscordID == AuthorID).Lvl = MC.substring(4,MC.length);
        Messagelvlok(AuthorID, BotChan, lvl);
        AuthCALL(UpdateNextRaid);
      }
      else {
        Messagelvl(AuthorID,BotChan);
      }
    }

    // commande /level (6 caractéres)
    if (MC.startsWith(prefix + "level")){
      if (MC.substring(6,MC.length)>0){
        var level = MC.substring(6,MC.length);
        db.data.Users.find(user => user.DiscordID == AuthorID).Lvl = MC.substring(6,MC.length);
        Messagelvlok(AuthorID, BotChan, level);
        AuthCALL(UpdateNextRaid);
      }
      else {
        Messagelvl(AuthorID,BotChan);
      }
    }

    // commande /influ (6 caractéres)
    if (MC.startsWith(prefix + "influ")){
      if (MC.substring(6,MC.length)>0){
        var influ = MC.substring(6,MC.length);
        db.data.Users.find(user => user.DiscordID == AuthorID).Influ = MC.substring(6,MC.length);
        Messageinfluok(AuthorID, BotChan, influ);
        AuthCALL(UpdateNextRaid);
      } 
      else {
        Messagelvl(AuthorID,BotChan);
      }
    }
  
    // Commande de reset manuel des raids /raidreset, option "sc", "ac" et "raz"
    if (MC.startsWith(prefix + "raidreset")){
      if (BooleanAdmin(AuthorID)==true){
        // option "SC" (sans calcul statistique)
        if (MC.includes("sc")){
            Resetsc();
            MessageResetDataRaid(AuthorID,BotChan);
        }
        // option "ac" (avec calcul des statistiques)
        if (MC.includes("ac")){
            Resetac();
            MessageResetDataRaid(AuthorID,BotChan);
        }
        // option "raz" (remise a 0 complet de la BD)
        if (MC.includes("raz")){
            Resetraz();
            Messageraz(AuthorID,BotChanOfficier);
          } 
      } else {
        MessageInsufficientAuthority(AuthorID,BotChan);
      }
      message.delete();
    }

    // Commande d'allumage ou d'extinction des fonction automatique cron /raid option "on" et "off"
    if (MC.startsWith(prefix + "raid")){
      if (Booleanusermp(AuthorID)==true){
        // option "on" (mise en service des fonctions automatique cron)
        if (MC.includes("on")){
            db.data.gestion.allumage = 'on';
            db.write();
            MessageRaidon(AuthorID,BotChan);
            console.log("Allumage raid = " + db.data.gestion.allumage);
          } 
        // option "off" (arret des fonctions automatique cron)
        if (MC.includes("off")){
          db.data.gestion.allumage = 'off';
            db.write();
            console.log("Allumage raid = " + db.data.gestion.allumage);
            MessageRaidoff(AuthorID,BotChan);
         }        
      }
      else {
        MessageInsufficientAuthority(AuthorID,BotChan);
      }
      message.delete();
    }

    // commande /data (Embled des infos du joueur)
    if (MC.startsWith(prefix + "data")){
      await EmbedData(BotChan,message);
    }

    // commande /guide (Embled des infos du jeux)
    if (MC.startsWith(prefix + "guide")){
      EmbedGuide(BotChan,message);
    }
  
    // Assignement de la classe de héros joué /class
    if (MC.startsWith(prefix + "class")){
      cmdclass(AuthorID, MC.substring(6,MC.length).trim(), BotChan);
    }

    // Liste des joueurs non inscrit a la prochaine au GvG /gvg (NextRaid = 0)
    if (MC.startsWith(prefix + "gvg")){
      var listnoninscrit;
      listnoninscrit = db.data.Users.filter(raid => raid.NextRaid == 0).map(user => user.NameNonInscrit);
      Messagegvg(AuthorID, BotChanOfficier, listnoninscrit); 
    }

    // mise a jour des stats sur le Gdoc
    if (MC.startsWith(prefix + "stat")){
      if (BooleanAdmin(AuthorID)==true){
        AuthCALL(Stat);
        MessageStat(AuthorID,BotChanOfficier);
        message.delete();
      }
      else {
        MessageInsufficientAuthority(AuthorID,BotChan);
      }
    }

    // Rappel d'inscription GvG en mp
    if (MC.startsWith(prefix + "mp")){
      if (Booleanusermp(AuthorID)==true){
        if (MC.substring(3,MC.length)>0){
          var userpourmp =  MC.substring(3,MC.length).trim();
          var privatemessage = await client.users.fetch(userpourmp);
          var changvg = TODOchangvg;
          var utilisateurofficier = TODOutilisateurofficier;
          privatemp(privatemessage, changvg, utilisateurofficier);
          Messageprivatemp(AuthorID, BotChanOfficier, userpourmp);
          message.delete();
        }
      }
      else {
        MessageInsufficientAuthority(AuthorID,BotChan);
      }
    }

    // Affichage de "delete" dans la db pour les joueurs à supprimer de la db
    if (MC.startsWith(prefix + "rm")){
      if (Booleanusermp(AuthorID)==true){
          var idtoremove =  MC.substring(3,MC.length).trim();
          cmdrm(AuthorID, BotChanOfficier, idtoremove);
          message.delete();
      }
      else {
        MessageInsufficientAuthority(AuthorID,BotChan);
      }
    }

    // reset manuel du message de reaction d'inscription GvG
    if (MC.startsWith(prefix + "resetmsggvg")){
      if (Booleanusermp(AuthorID)==true){
        cmdresetmsggvg(BotReaction, TODOBotReaction);
        Resetsc();
        AuthCALL(efface);
      }
      else {
        MessageInsufficientAuthority(AuthorID,BotChan);
      }
    }

    // Sauvegarde manuel de la base de donnee /getsave
    if (MC.startsWith(prefix + "getsave")){  
      if (BooleanAdmin(AuthorID)==true){
        cmdgetsave(AuthorID);
        message.delete();
      }
      else {
        MessageInsufficientAuthority(AuthorID,BotChan);
      }
    }
  }
});
 

// Fonction automatique "Cron"
function TaskHandle(BotChan, BotReaction, TODOBotReaction, Botrappel, TODOBotrappel, idrole, TODOusermpgetsaveBDD){
  // Fonction automatique de check des presences discord pendant la GvG
  var checkPresence = new CronJob('0 */1 20 * * 2,6', function() {
    cronCheckpresence(idCategorie);
  }, null, true, 'Europe/Paris');
  checkPresence.start();

  // fonction de changement automatique du message de réaction à 21h mardi et samedi
  var resetmsgreact = new CronJob('0 0 21 * * 2,6', function() {
    cronResetMsgReaction(BotReaction, TODOBotReaction, idrole);
  }, null, true, 'Europe/Paris');
  resetmsgreact.start();

  // Fonction de sauvegarde de la BD à 22h mardi et samedi
  var savedb = new CronJob('0 0 19 * * 2,6', async function() {
    cronsavedb(TODOusermpgetsaveBDD);
  }, null, true, 'Europe/Paris');
  savedb.start();
    
  // Fonction de mise a jour de la page stat sur le gdoc de la BD à 22h mardi et samedi
  var majstat = new CronJob('0 0 22 * * 2,6', async function() {
      AuthCALL(Stat);
      MessageStat(AuthorID,BotChanOfficier);
  }, null, true, 'Europe/Paris');
  majstat.start();
    
  // Message de rappel d'inscription au joueur à 18h mercredi et dimanche
 // var rappelLV = new CronJob('0 17 20 * * 3,0', function() {
 //   cronrappelinscription(Botrappel, TODOBotrappel, idrole);
 // }, null, true, 'Europe/Paris');
 // rappelLV.start(); 
} 
