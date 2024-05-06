// module nodejs et npm
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Configure lowdb to write to JSONFile
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const DefaultData = { Allumage: [] };
export const db = new Low(adapter, DefaultData);
await db.read();

var prefix ="!";
import { Client, GatewayIntentBits, Partials } from 'discord.js';
export const client = new  
Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
	],
  partials: [
    Partials.Message,
    Partials.Reaction,
    Partials.User
]
});

// --------------------------------------
// ------------- Adaptation -------------
// --------------------------------------

// id du serveur
export const ServerID = '411225379983065089'; // serveur discord
// id du google doc de gestion (necessite des autoriation d'accées)
export const GspreadsheetID = '1AbF3ObZcfWSTgTpCiS6WA2syyjUCa9KOTvOTkThmI8Y';
// id des roles discord non autorisé (bot, etc.)
export const DiscordUnauthorizedRole = ["646033732251156511", "533233601874100224", "884115906605764669", "952543814092980277", "1025072378029551628", "965602552320254014"];
// ligne 63 : List des admins
// ligne 76 : Utilisateur autorisé pour les commandes !mp et !raid on/off
// Lien des Gdoc
var Gdocoff = "https://docs.google.com/spreadsheets/d/1AbF3ObZcfWSTgTpCiS6WA2syyjUCa9KOTvOTkThmI8Y";
var Gdoctroupes = "https://docs.google.com/spreadsheets/d/1mzTQECbNxaNMomnqW7TOlHYb_uH_d9jaJYoP1zgKLNk";
// Nom du groupe a cité (message reset raid)
var group = "@Barbouse-Conqueror ";
// channel et groupe à cité dans le message automatique de rappel
var channel = "1116070586179932241"; // chan d'inscription au GvG
var groupe = "@Barbouse-Conqueror ";

// -------------------------------------
// ----------- Coeur du code -----------
// -------------------------------------

// Gestion des admins du bot
export function BooleanAdmin(DiscordPlayerID) {
// TOTO : List des admins du bot
var ListAdmin = ["179655652153491456", "489520129705771029", "256509244277391360", "154670779236220928", "274945457707286528", "438019087457583124", "828641205881012294", "166151581325066240", "328164062712299522", "166151485154000896", "1081374865501724732"];
// coincoin, akyol, master, rafu, Allyta, Berchoun, OGM, fish, RC, Crashow, Maeecko
  let Admin = false;
  for (var CurrentAdmin = 0; CurrentAdmin < ListAdmin.length; CurrentAdmin++) {
    if (ListAdmin[CurrentAdmin] == DiscordPlayerID) {
      Admin = true;
    }
  }
  return Admin;
}

// Gestion des utilisateur autorisé pour les commandes !mp et raid on/off
export function Booleanusermp(DiscordPlayerID) {
  // TODO : Utilisateur autorisé pour les commandes !mp et !raid on/off
  let Listusermp = ["179655652153491456", "489520129705771029", "256509244277391360", "154670779236220928", "274945457707286528", "438019087457583124", "828641205881012294", "166151581325066240", "328164062712299522", "166151485154000896", "1081374865501724732"];
  // coincoin, akyol, master, rafu, Allyta, Berchoun, OGM, fish, RC, Crashow, Maeecko
  let usermp = false;

  for (var Currentusermp = 0; Currentusermp < Listusermp.length; Currentusermp++) {
    if (Listusermp[Currentusermp] == DiscordPlayerID) {
      usermp = true;
    }
  }
  return usermp;
}

export function MessageInsufficientAuthority(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n",
    files: ["https://i.servimg.com/u/f43/15/76/70/95/admin10.png"]
  });
}

// Message chan utilisateur
export function Messageinfo(AuthorID, BotChan) {
  BotChan.send({
    content: '<@' + AuthorID + '>, \n__**Français :**__ voici la liste des commandes utilisateur du bot \n__**English :**__ here is the list of bot user commands',
    files: ["https://i.servimg.com/u/f43/15/76/70/95/info16.jpg"]
  });
}

export function Messageinfoadmin(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + ">, \n",
    files: ["https://i.servimg.com/u/f43/15/76/70/95/info_a10.jpg"]
  });
}

export function MessageRaidPresent(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n",
    files: ["https://i43.servimg.com/u/f43/15/76/70/95/presen10.png"]
  });
}

export function MessageRaidRetard(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n",
    files: ["https://i43.servimg.com/u/f43/15/76/70/95/retard10.png"]
  });
}

export function MessageRaidAbsent(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n",
    files: ["https://i.servimg.com/u/f43/15/76/70/95/absent10.png"]
  });
}

export function Messagedesinscription(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n__**Français :**__ Vous êtes désinscrit de la prochaine GvG \n__**English :**__ You have been unsubscribed from the next GvG"
  });
}

export function MessageRaidon(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n__**Français :**__ Les fonctions automatiques du bot sont __**activé**__\n__**English :**__  automatic bot functions are __**activated**__"
  });
}

export function MessageRaidoff(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n__**Français :**__ les fonctions automatiques du bot sont __**désactivé**__\n__**English :**__  automatic bot functions are __**disabled**__"
  });
}

export function Messagelvl(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n",
    files: ["https://i43.servimg.com/u/f43/15/76/70/95/lvl10.jpg"]
  });
}

export function Messagelvlok(AuthorID, BotChan, level) {
  BotChan.send({
    content: "<@"+AuthorID+"> \n__**Français :**__ votre level a été mis a jour ! Votre lvl est maintenant de : **" + level + "**\n__**English :**__ your level has been updated, it is now : **" + level + "**"
  });
}

export function MessageInflu(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n",
    files: ["https://i43.servimg.com/u/f43/15/76/70/95/influ11.jpg"]
  });
}

export function Messageinfluok(AuthorID, BotChan, influ) {
  BotChan.send({
    content: "<@"+AuthorID+"> \n__**Français :**__ votre influence de héros (700 + armure) a été mis a jour ! Elle est maintenant de : **" + influ + "**\n__**English :**__ your hero influence (700 + armor) has been updated, it is now : **" + influ + "**"
  });
}

export function Messageclass(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n__**Français :**__  voici la liste des codes classes.\nExemple d'utilisation : " + prefix + "class arc \n__**English :**__  here is the list of class codes.\nExample of use : " + prefix + "class nod\n",
    files: ["https://i43.servimg.com/u/f43/15/76/70/95/code_c11.png"]
  });
}

export function Messageclassok(AuthorID,BotChan,MemberGameCharacter) {
  BotChan.send({
    content: "<@"+AuthorID+"> \n__**Français :**__  la nouvelle classe de héros assigné est : **" + MemberGameCharacter + "**\n__**English :**__  the new assigned hero class is : **" + MemberGameCharacter + "**"
  });
}

export function Messageclassfaux(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n__**Français :**__  mauvais format, ci-dessous la liste des codes classes.\nExemple d'utilisation : " + prefix + "class arc\n__**English :**__  wrong format, below is the list of class codes.\nExample of use : " + prefix + "class nod\n",
    files: ["https://i43.servimg.com/u/f43/15/76/70/95/code_c11.png"]
  });
}

export function MessageGdoc(AuthorID, BotChan) {
  BotChan.send("<@" + AuthorID + ">, voici les Google doc associés au bot :\n\n Gdoc d'organisation et de gestion des GvG (nécéssite des autorisations d'accées) : <" + Gdocoff + ">\n\n Gdoc de gestion des troupes des utilisateurs du bot : <" + Gdoctroupes + ">");
}

export function MessageEndRaid(BotChan) {
  BotChan.send({
    content: group + "\n",
    files: ["https://i43.servimg.com/u/f43/15/76/70/95/reset-10.png"]
  });
}

export function Messagerappel(Botrappel, channel, idrole) {
  Botrappel.send("<@&"+ idrole +">\n__**Français :**__\nOyez, Oyez brave chevalier !\nOn en a gros, trop de chevalier ont encore oublié de renseigner leurs présence dans le chan <#" + channel + "> (pour connaître les commandes du bot, utilise !info dans le chan) \n \n__**English :**__\nOyez, Oyez brave knight!\nToo many knights have forgotten to enter their names in the chan <#" + channel + "> (to know the bot commands, use !info in the channel)");
}

export function MessageResetDataRaid(AuthorID, BotChan) {
  BotChan.send({
    content: "<@" + AuthorID + "> \n",
    files: ["https://i43.servimg.com/u/f43/15/76/70/95/reset-11.png"]
  });
}

export function Messageclean(AuthorID, BotChan) {
  BotChan.send("<@" + AuthorID + ">, \n__**Français :**__ Gdoc effacé \n__**English :**__ Gdoc clean");
}

// Message chan officier
export function Messagegvg(AuthorID, BotChanOfficier, listnoninscrit) {
  BotChanOfficier.send("<@" + AuthorID + "> \nJoueur n'ayant pas indiqué leurs présence pour la prochaine GvG :\n" + listnoninscrit);
}

export function MessageStat(AuthorID, BotChanOfficier) {
  BotChanOfficier.send({
    content: "<@" + AuthorID + "> \n",
    files: ["https://i43.servimg.com/u/f43/15/76/70/95/statis10.png"]
  });
}

export function Messagenb(AuthorID, BotChanOfficier, nb_inscrit, nb_present, nb_retard, nb_absent) {
  // BotChanOfficier.send("<@" + AuthorID + ">, voici les statistiques d'inscription pour la prochaine GvG : \n Nombre de joueur **inscrit** : " + nb_inscrit + " \n Nombre de joueur **present** : " + nb_present + "\n Nombre de joueur **en retard** : " + nb_retard + " \n Nombre de joueur **absent** : " + nb_absent);
  BotChanOfficier.send("<@" + AuthorID + ">, voici les statistiques d'inscription pour la prochaine GvG : \n Nombre de joueur **inscrit** : " + nb_inscrit + " \n Nombre de joueur **present** : " + nb_present + "\n Nombre de joueur **absent** : " + nb_absent);
}

export function Messagelist(AuthorID, BotChanOfficier, list_present, list_retard, list_absent) {
  // BotChanOfficier.send("<@" + AuthorID + ">, voici les listes pour la prochaine GvG : \n\n__Liste des joueurs **presents**__ : \n" + list_present + "\n\n__Liste des joueurs **en retard**__ :\n" + list_retard + "\n\n__Liste des joueurs **absent**__ :\n" + list_absent);
  BotChanOfficier.send("<@" + AuthorID + ">, voici les listes pour la prochaine GvG : \n\n__Liste des joueurs **presents**__ : \n" + list_present + "\n\n__Liste des joueurs **absent**__ :\n" + list_absent);
}


export function Messageraz(AuthorID, BotChanOfficier) {
  BotChanOfficier.send("<@" + AuthorID + ">, \n__**Français :** remise à zeros des raids dans la BD effectué \n__**English :** reset of raids in the DB done");
}

export function Messageprivatemp(AuthorID, BotChanOfficier, userpourmp) {
  BotChanOfficier.send("<@" + AuthorID + ">\nLe message de rappel d'incription à la prochaine GvG à bien été envoyé en mp à : <@" + userpourmp + ">");
}
// Private message de rappel
export function privatemp(privatemessage, changvg, utilisateurofficier) {
  privatemessage.send("Bonjour,\nCeci est message de rappel d'inscription à la prochaine GvG\nMerci de t'inscrire sur le bot GvG dans le chan <#" + changvg + ">. Si tu ne sais pas comment faire : écrit !info dans le chan.\nPour répondre a ce message, ne pas répondre directement mais contacter un officier : <@" + utilisateurofficier + "> par exemple.\nA bientôt et bon jeu");         
}

export function MessageUserRemove(AuthorID, BotChanOfficier, iduserremove) {
  BotChanOfficier.send("<@" + AuthorID + ">\nL'utilisateur n°" + iduserremove + " a bien été supprimer de la base de donnée");
}

export function MessageErreurRemove(AuthorID, BotChanOfficier) {
  BotChanOfficier.send("<@" + AuthorID + ">\nL'utilisateur à supprimer de la base de donnée n'existe pas");
}

// Embled DATA
export function EmbedGuide(BotChan) {

  let link1 = "[Le guide des guides / Guide to guides](https://conqblade.com/news/460)";
  let link2 = "[Bien commencer dans le jeu / Getting started in the game](https://conqblade.com/fr/news/538)";

  let linkFR = "Guide et calculateur en Fran�ais / French guide and calculator :";
  let linkFR1 = "[Conqueror's Blade - Caracteteristique heros et unites](https://drive.google.com/file/d/1g4vRkolXGbCKJVP3yk95u7AYdMS8yReL)";
  let linkFR2 = "[Conqueror's Blade - Artisanat](https://docs.google.com/spreadsheets/d/1WFi3G6ABFnwbTDQmeW2knrs99g3qF8PPzXpTk2vya6Q)";
  let linkFR3 = "[Guide des Quetes de Fiefs](https://docs.google.com/document/d/1Xu5TTSMOVv3AfecrL5VRPWmy0EQv8NGeFs4KhiPt8yQ )";
  let linkFR4 = "[Guide de craft et ressources ](https://docs.google.com/document/d/19PrHGN2aHaZNeL-gtWR8sXCJEvmypPkNg5eJr2HB8UM)";

  let linkEN = "Guide et calculateur en anglais / English guide and calculator :";
  let linkEN1 = "[Comprehensive Guide to Fief Quests ](http://universalgamersfederation.com/2019/08/16/conquerors-blade-comprehensive-guide-to-fief-quests)";
  let linkEN2 = "[Gathering and Crafting Unit Kits for New Players ](https://www.gaisciochmagazine.com/articles/conquerors_blade__gathering_and_crafting_unit_kits_for_new_players.html)";
  let linkEN3 = "[Zimster's Conquerors Blade Guide ](https://docs.google.com/spreadsheets/d/1C-XPnZuCtYxRaNdjzDSj9kFqngPuZyO4WGVt8agFf5M)";
  let linkEN4 = "[Crafting calculators with kits & materials database](https://docs.google.com/spreadsheets/d/1XHVHVkjGTmhUMBoxscQ-m4MFtKEdpFXn-IFECfZIAVk)";
  let linkEN5 = "[OmniPower's CB Crafting/Gathering Guide](https://docs.google.com/spreadsheets/d/12m_jD9tyVGXX36NXsLdcskv0MpQ5HSaOTkVRP6cB1fA)";
  let linkEN6 = "[How to CB for Tyrants 3](https://docs.google.com/spreadsheets/d/1OJl6h27tB4VAng_SE0sJ4WOhcp257AbQO_ZqsgNrQA0)";

  const EmbedGuide = {
    color: 0x0099ff,
    title: "**---------------------------------------\n   Conqueror's Blade\n   Liste de guide et calculateur\n   Guide list and calculator\n ---------------------------------------**",
    thumbnail: {
      url: 'https://i43.servimg.com/u/f43/15/76/70/95/image-11.png',
    },
    fields: [
      {
        "name": "Guide officiel / Official guide :",
        "value": "1 - " + link1 + "\n2 - " + link2,
      },
      {
        "name": linkFR,
        "value": "1 - " + linkFR1 + "\n2 - " + linkFR2 + "\n3 - " + linkFR3 + "\n4 - " + linkFR4,
      },
      {
        "name": linkEN,
        "value": "1 - " + linkEN1 + "\n2 - " + linkEN2 + "\n3 - " + linkEN3 + "\n4 - " + linkEN4 + "\n5 - " + linkEN5 + "\n6 - " + linkEN6,
      },
    ],
    footer: {
      text: 'Des guides a ajouter ? Dite le a votre maitre de guilde\nGuides to add ? Tell your guild master\n',
      icon_url: 'https://i43.servimg.com/u/f43/15/76/70/95/_guide10.png',
    },
  };
  BotChan.send({
    embeds: [EmbedGuide]
  });
}

export async function EmbedData(BotChan, message) {
  let CurrentPlayer = db.data.Users.find( user => user.DiscordID == message.author.id );
  let PPLPR = "Aucune donnée";
  let classe = "Aucune donnée";
  let lvlhero = "Aucune donnée";
  let role = "";
  let markp = "";
  let PP = 0;
  if (CurrentPlayer.Assiduity != 0) {
    PP = Math.round(CurrentPlayer.Assiduity / CurrentPlayer.TotalRaid * 100);
  }

  if (CurrentPlayer.Lvl == 0) {
    lvlhero = "non defini - undefined \nutilise !lvl pour le definir \n use !lvl to define it";
  }
  else
    (lvlhero = CurrentPlayer.Lvl);

  if (CurrentPlayer.GameCharacter == "Erreur") {
    classe = "non defini - undefined \nutilise !class pour le definir \n use !class to define it";
  }
  else
    (classe = CurrentPlayer.GameCharacter);

  if (CurrentPlayer.DiscordRole == "Erreur") {
    role = "Pas de rôle discord attribue\nNo discord role assigned ";
  }
  else 
    (role = CurrentPlayer.DiscordRole);


  if (CurrentPlayer.NextRaid == 1) {
    PPLPR = "Inscrit présent (Présent pour le brefing à 19h30)\nRegistered present (Present for the briefing at 7:30 p.m.)",
      markp = ":white_check_mark:";
  }
  else if (CurrentPlayer.NextRaid == 0) {
    PPLPR = ":sob: Non inscrit / not registered :sob:";
  }
  else if (CurrentPlayer.NextRaid == 2) {
    PPLPR = "Inscrit en retard : arrivé aprés le début du brefing (19h30)\nRegistered late : arrived after the start of the briefing (7:30 p.m.)",
      markp = ":clock2:";
  }
  else if (CurrentPlayer.NextRaid == 3) {
    PPLPR = ":x: Inscrit absent / Registered absent";
  }

  const DataEmbed = {
    title: "Joueur / Player : **__" + CurrentPlayer.DisplayName + "__**",
    color: 13373715,
    thumbnail: {
      url: message.author.avatarURL()
    },
    fields: [
      {
        name: "Classe joué en GvG /Class played in TW",
        value: classe,
        inline: true
      },
      {
        name: "Niveau du héros / hero's level",
        value: "level : " + lvlhero
      },
      {
        name: "Influence de votre héros / Influence of your hero",
        value: "Influence : " + CurrentPlayer.Influ + "\n(700 + armure / armor)"
      },
      {
        name: markp + " inscription GvG / TW registration",
        value: PPLPR
      },
      {
        name: "Statistique GvG / TW stat",
        value: "GvG participé / TW participated : ***" + CurrentPlayer.Assiduity + "***\n Presence : ***" + PP + "%***"
      }
    ]
  };
  BotChan.send({
    embeds: [DataEmbed]
  });
}
