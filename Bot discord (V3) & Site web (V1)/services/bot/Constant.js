// fichier annexe
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { userInfo, classPlay } from './database.js';
import { ListAdmin } from './config.js';
import { BotChan, BotChanOfficier } from './Main.js';

// Clients Discord
export const client = new
  Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
    partials: [
      Partials.Message,
      Partials.Reaction,
      Partials.User
    ]
  });

// Gestion des admins du bot
export function BooleanAdmin(DiscordPlayerID) {
  for (var CurrentAdmin = 0; CurrentAdmin < ListAdmin.length; CurrentAdmin++) {
    if (ListAdmin[CurrentAdmin] == DiscordPlayerID) {
      return true;
    }
  }
  return false;
}

// Message chan officier
export function NewUser(AuthorID) {
  BotChan.send("Bienvenue dans notre maison <@" + AuthorID + ">\nJe te propose de te faire une visite guidée des fonctionnalités utilisé dans notre maison pour l'organisation des GvG.\n Pour cela, il te suffit de taper \"/visite_guidée\" dans un canal de ce discord");
}

export function UserLeaveDiscord(name, nickname) {
  BotChanOfficier.send(name + " (" + nickname + ") abandonne le combat, il/elle viens de quitter le discord.\nGrrrr, je vais encore faire plein de rature sur le registre !!!!");
}

export function Messagegvg(AuthorID, listnoninscrit) {
  BotChanOfficier.send("<@" + AuthorID + ">\nJoueur n'ayant pas indiqué leurs présence pour la prochaine GvG :\n" + listnoninscrit);
}

export function Messagenb(AuthorID, nb_inscrit, nb_present, nb_retard, nb_absent) {
  BotChanOfficier.send("<@" + AuthorID + ">\nVoici les statistiques d'inscription pour la prochaine GvG : \n Nombre de joueur **inscrit** : " + nb_inscrit + " \n Nombre de joueur **present** : " + nb_present + "\n Nombre de joueur **absent** : " + nb_absent);
}

export function Messagelist(AuthorID, list_present, list_retard, list_absent) {
  BotChanOfficier.send("<@" + AuthorID + ">\nVoici les listes pour la prochaine GvG : \n\n__Liste des joueurs **presents**__ : \n" + list_present + "\n\n__Liste des joueurs **absent**__ :\n" + list_absent);
}

// Embled DATA
export async function EmbedGuide() {

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
  let linkEN7 = "[Elusiveguides](https://elusiveguides.wixsite.com/home)";
  let linkEN8 = "[denetax.fr](https://denetax.fr/conqueror-blade-tutoriel-mmorpg-fr)";

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
        "value": "1 - " + linkEN1 + "\n2 - " + linkEN2 + "\n3 - " + linkEN3 + "\n4 - " + linkEN4 + "\n5 - " + linkEN5 + "\n6 - " + linkEN6 + "\n7 - " + linkEN7 + "\n8 - " + linkEN8,
      },
    ],
    footer: {
      text: 'Des guides a ajouter ? Dite le a votre maitre de guilde\nGuides to add ? Tell your guild master\n',
      icon_url: 'https://i43.servimg.com/u/f43/15/76/70/95/_guide10.png',
    },
  };

  return EmbedGuide
}

export async function EmbedData(interaction) {
  let CurrentPlayer = await userInfo(interaction.user.id);
  // console.log("CurrentPlayer : ", CurrentPlayer);

  let PP = 0;
  if (CurrentPlayer.NbGvGParticiped != 0) {
    PP = Math.round(CurrentPlayer.NbGvGParticiped / CurrentPlayer.NbTotalGvG * 100);
  }

  let lvlhero = "Aucune donnée";
  if (CurrentPlayer.Lvl == 0) {
    lvlhero = "non defini \nutilise /level pour le definir";
  } else {
    lvlhero = CurrentPlayer.Lvl;
  }

  let classe = "non defini\nutilise /classe pour le definir"
  if (CurrentPlayer.GameCharacter_ID != 0) {
    classe = await classPlay(CurrentPlayer.GameCharacter_ID);
  }

  // let role = "";
  // if (CurrentPlayer.DiscordRole == "Erreur") {
  //   role = "Pas de rôle discord attribue\nNo discord role assigned ";
  // } else {
  //   role = CurrentPlayer.DiscordRole;
  // };


  let PPLPR = "Aucune donnée";
  let markp = "";
  if (CurrentPlayer.EtatInscription == 1) {
    PPLPR = "Inscrit présent (Présent pour le brefing à 19h30)";
    markp = ":white_check_mark:";
  } else if (CurrentPlayer.EtatInscription == 0) {
    PPLPR = ":sob: Non inscrit :sob:";
  } else if (CurrentPlayer.EtatInscription == 2) {
    PPLPR = "Inscrit en retard : arrivé aprés le début du brefing (19h30)";
    markp = ":clock2:";
  } else if (CurrentPlayer.EtatInscription == 3) {
    PPLPR = ":x: Inscrit absent";
  } else {
    PPLPR = "Jamais absent";
  }

  const DataEmbed = {
    title: "Joueur : **__" + CurrentPlayer.DiscordName + "__**",
    color: 13373715,
    thumbnail: {
      url: interaction.user.avatarURL()
    },
    fields: [
      {
        name: "Classe joué en GvG",
        value: classe,
        inline: true
      },
      {
        name: "Niveau de héros",
        value: lvlhero
      },
      {
        name: "Influence de votre héros (700 + armure)",
        value: CurrentPlayer.Influence
      },
      {
        name: markp + " inscription GvG",
        value: PPLPR
      },
      {
        name: "Statistique GvG",
        value: "GvG participé : ***" + CurrentPlayer.NbGvGParticiped + "***" +
          "\n Derniére gvg participé : ***" + CurrentPlayer.DateLastGvGParticiped + "***" +
          "\n Presence : ***" + PP + "%***"
      }
    ]
  };

  return DataEmbed
}
