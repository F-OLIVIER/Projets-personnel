// Fichier annexe
import { client, db, Messagenb, Messagelist, Messageclassok, Messageclass, Messageclassfaux, MessageUserRemove, MessageErreurRemove } from './Constant.js';
import { msgreactgvg } from './Reaction.js';

// Module nodejs et npm
import moment from 'moment-timezone';
import {} from 'dotenv/config';

// Commande nb
export function cmdnb(AuthorID, BotChanOfficier) {
    var nb_present; // NextRaid = 1
    var nb_retard; //  NextRaid = 2
    var nb_absent; //  NextRaid = 3
    var nb_inscrit; // NextRaid 1 + NextRaid 2 + NextRaid 3

    var nb_present_temp = db.data.Users.filter(user => user.NextRaid == 1);
    nb_present = Object.keys(nb_present_temp).length;
    var nb_retard_temp = db.data.Users.filter(user => user.NextRaid == 2);
    nb_retard = Object.keys(nb_retard_temp).length;
    var nb_absent_temp = db.data.Users.filter(user => user.NextRaid == 3);
    nb_absent = Object.keys(nb_absent_temp).length;
    nb_inscrit = 0;   
    nb_inscrit = nb_present + nb_absent + nb_retard;
    
    Messagenb(AuthorID, BotChanOfficier, nb_inscrit, nb_present, nb_retard, nb_absent);
}

// command list
export function cmdlist(AuthorID, BotChanOfficier) {
    var nb_present; // NextRaid = 1
    var nb_retard; //  NextRaid = 2
    var nb_absent; //  NextRaid = 3

    var list_present; // NextRaid = 1
    var list_retard; //  NextRaid = 2
    var list_absent; //  NextRaid = 3

    var nb_present_temp = db.data.Users.filter(user => user.NextRaid == 1);
    nb_present = Object.keys(nb_present_temp).length;
    var nb_retard_temp = db.data.Users.filter(user => user.NextRaid == 2);
    nb_retard = Object.keys(nb_retard_temp).length;
    var nb_absent_temp = db.data.Users.filter(user => user.NextRaid == 3);
    nb_absent = Object.keys(nb_absent_temp).length;

    // List present
    if (nb_present == 0){
    list_present = ":sob: Aucun joueur inscrit :sob:";
    }
    else if (nb_present != 0){
    list_present = "**" + nb_present + " joueurs :** " + db.data.Users.filter(user => user.NextRaid == 1).map(user => user.DisplayNameList);
    } 
    // List en retard
    if (nb_retard == 0){
    list_retard = ":partying_face: Aucun joueur en retard :partying_face:";
    }
    else if (nb_retard != 0){
    list_retard = "**" + nb_retard + " joueurs :** " + db.data.Users.filter(user => user.NextRaid == 2).map(user => user.DisplayNameList);
    }
    // List absent
    if (nb_absent == 0){
    list_absent = ":heart_eyes: Aucun joueur absent :heart_eyes:";
    }
    else if (nb_absent != 0){
    list_absent = "**" + nb_absent + " joueurs : **" + db.data.Users.filter(user => user.NextRaid == 3).map(user => user.DisplayNameList);
    }
    Messagelist(AuthorID, BotChanOfficier, list_present, list_retard, list_absent);
}

// Command class
export function cmdclass(AuthorID, ClassSaisie, BotChan) {
    var temp = db.data.Users.find(user => user.DiscordID == AuthorID);
    var MemberGameCharacter = temp.GameCharacter;
    var MemberGameCharacterfinal ="False";

    if (ClassSaisie == "arc" || ClassSaisie == "sar" || ClassSaisie == "ARC" || ClassSaisie == "SAR" || ClassSaisie == "Arccourt" || ClassSaisie == "Shortarch"){
      MemberGameCharacter = "Arc court / Short arch";
      MemberGameCharacterfinal = "True";
    }
    else if (ClassSaisie == "acl" || ClassSaisie == "lar" || ClassSaisie == "ACL" || ClassSaisie == "LAR" || ClassSaisie == "Arclong" || ClassSaisie == "Longarc"){
      MemberGameCharacter = "Arc long / Long arc";
      MemberGameCharacterfinal = "True";
    }
    else if (ClassSaisie == "lju" || ClassSaisie == "tbl" || ClassSaisie == "LJU" || ClassSaisie == "TBL" || ClassSaisie == "Lamesjumelles" || ClassSaisie == "Twinblades"){
      MemberGameCharacter = "Lames jumelles / Twin blades";
      MemberGameCharacterfinal = "True";
    }
    else if (ClassSaisie == "ecb" || ClassSaisie == "écb" || ClassSaisie == "sss" || ClassSaisie == "ECB" || ClassSaisie == "SSS" || ClassSaisie == "épéecourte" || ClassSaisie == "Epeecourte" || ClassSaisie == "Shortsword"){
      MemberGameCharacter = "épée courte & bouclier / Short sword & shield";
      MemberGameCharacterfinal = "True";
    }
    else if (ClassSaisie == "elb" || ClassSaisie == "élb" || ClassSaisie == "lss" || ClassSaisie == "ELB" || ClassSaisie == "LSS" || ClassSaisie == "épéelongue" || ClassSaisie == "epeelongue" || ClassSaisie == "Longsword"){
      MemberGameCharacter = "épée longue & bouclier / Long sword & shield";
      MemberGameCharacterfinal = "True";
    }
    else if (ClassSaisie == "gua" || ClassSaisie == "guandao"){
      MemberGameCharacter = "Guandao";
      MemberGameCharacterfinal = "True";
    }
    else if (ClassSaisie == "hda" || ClassSaisie == "wax" || ClassSaisie == "HDA" || ClassSaisie == "WAX" || ClassSaisie == "Hache" || ClassSaisie == "Weaponax"){
      MemberGameCharacter = "Hache d'arme / Weapon ax";
      MemberGameCharacterfinal = "True";
    }
    else if (ClassSaisie == "lan" || ClassSaisie == "spe" || ClassSaisie == "LAN" || ClassSaisie == "SPE" || ClassSaisie == "Lance" || ClassSaisie == "spear"){
      MemberGameCharacter = "Lance / spear";
      MemberGameCharacterfinal = "True";
    }
    else if (ClassSaisie == "mou" || ClassSaisie == "mus" || ClassSaisie == "MOU" || ClassSaisie == "MUS" || ClassSaisie == "Mousquet" || ClassSaisie == "Musket"){
      MemberGameCharacter = "Mousquet / Musket";
      MemberGameCharacterfinal = "True";
    }
    else if (ClassSaisie == "nod" || ClassSaisie == "NOD" || ClassSaisie == "Nodashi"){
      MemberGameCharacter = "Nodashi";
      MemberGameCharacterfinal = "True";
    }
    else if (ClassSaisie == "mas" || ClassSaisie == "MAS" || ClassSaisie == "Masse" || ClassSaisie == "Mass"){
      MemberGameCharacter = "Masse de guerre / Mass of war";
      MemberGameCharacterfinal = "True";
    }
    else if (ClassSaisie == "dac" || ClassSaisie == "dàc" || ClassSaisie == "chb" || ClassSaisie == "DAC" || ClassSaisie == "CHB" || ClassSaisie == "Dague" || ClassSaisie == "dart"){
      MemberGameCharacter = "Dague à chaine / Chain dart";
      MemberGameCharacterfinal = "True";
    }
      else if (ClassSaisie == "piq" || ClassSaisie == "pik" || ClassSaisie == "PIQ" || ClassSaisie == "PIK" || ClassSaisie == "Pique" || ClassSaisie == "Pike"){
      MemberGameCharacter = "Pique / Pike";
      MemberGameCharacterfinal = "True";
    }

    if (MemberGameCharacterfinal == "True"){
      db.data.Users.find( user => user.DiscordID == AuthorID ).GameCharacter = MemberGameCharacter;
      db.write();
      Messageclassok(AuthorID, BotChan, MemberGameCharacter);
    }
    else if (ClassSaisie == ""){
      Messageclass(AuthorID, BotChan);
    }
    else {
      Messageclassfaux(AuthorID,BotChan);
    }
}

// command resetmsggvg
export function cmdresetmsggvg(BotReaction, TODOBotReaction) {
    var id_msg =  db.data.gestion.id_message;
    client.channels.cache.get(TODOBotReaction).messages.fetch(id_msg).then(message => message.delete());

    // gestion de la date futur pour le message
    var now = moment();
    var day = now.day(); // 0 dimanche, 1 lundi, 2 mardi, 3 mercredi, 4 jeudi, 5 vendredi, 6 samedi
    console.log("day : " + day); 

    var futurdate;
    if (day == 0) { // si dimanche (jour 0), gvg le mardi
      futurdate = moment().add(2, 'days'); 
    } else if (day == 1) { // si lundi (jour 1), gvg le mardi
      futurdate = moment().add(1, 'days');
    } else if (day == 2) { // si mardi (jour 2), gvg le samedi
      futurdate = moment().add(4, 'days');
    } else if (day == 3) { // si mercredi (jour 3), gvg le samedi
      futurdate = moment().add(3, 'days');
    } else if (day == 4) { // si jeudi (jour 4), gvg le samedi
      futurdate = moment().add(2, 'days');
    } else if (day == 5) { // si vendredi (jour 5), gvg le samedi
      futurdate = moment().add(1, 'days');
    } else if (day == 6) { // si samedi (jour 6), gvg le mardi
      futurdate = moment().add(3, 'days');
    }

    // génére la date au bon format
    const futurdateformate = new Date(futurdate + (moment().tz("Europe/Paris").utcOffset()));
    // récupération du jour, de la date et du mois
    var jour  = futurdateformate.getDay();
    var date = futurdateformate.getDate();
    var mois  = futurdateformate.getMonth();
    msgreactgvg(BotReaction, jour, mois, date);
}

// Command de sauvegarde manuel de la db
export async function cmdgetsave(AuthorID) {
    var CurrentDate = new Date(Date.now() + (moment().tz("Europe/Paris").utcOffset()*60*1000));
    var privatemessage2 = await client.users.fetch(AuthorID);
    privatemessage2.send({
      content: "Sauvegarde manuel de la BDD\n" + CurrentDate,
      files: ['./db.json']
    });
}

// Command d'affichage de "delete" des joueurs a supprimer dans la db
export async function cmdrm(AuthorID, BotChanOfficier, idtoremove) {
  if (idtoremove > 0){
    var UserToRemove = db.data.Users.find(user => user.DiscordID == idtoremove);
    if (UserToRemove != null) {
      UserToRemove.NameNonInscrit = "";
      UserToRemove.DisplayNameList = "";
      UserToRemove.DiscordRole = "delete";
      UserToRemove.DiscordID = "delete";
      db.write()
      MessageUserRemove(AuthorID, BotChanOfficier, idtoremove);
    }
    else {
      MessageErreurRemove(AuthorID, BotChanOfficier);
    }
  }
}
