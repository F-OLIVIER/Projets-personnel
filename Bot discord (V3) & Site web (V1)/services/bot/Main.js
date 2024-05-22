// Fichier annexe
import { TODOBotChan, TODOBotChanOfficier, TODOBotReaction, siteInternet, idRoleUser, idRoleOfficier } from './config.js';
import { slashvisite, visit1, modalvisitelvlAndInflu, visit2, visit3, slashvisitenotpossible } from './guide.js';
import { createCommands, slashClass, slashInflu, slashLevel, slashRaidReset, slashResetmsggvg } from './slashcommand.js';
import { botOn, unregisteredList, isOfficier, deleteUser } from './database.js';
import { PlayerCreateOrUpdate, createuser, isMember } from './FuncData.js';
import { client, Messagegvg, EmbedData, EmbedGuide } from './Constant.js';
import { cronCheckpresence, cronResetMsgReaction } from "./Cronjob.js"
import { addReaction, removeReaction } from './Reaction.js';
import { cmdnb, cmdlist } from "./CommandBot.js";

// Module nodejs et npm
import { } from 'dotenv/config';
import { CronJob } from 'cron';

client.login(process.env.TOKEN);
client.on('error', (error) => { console.error('\nUne erreur est survenue :\n', error); });
// client.on('debug', (message) => { console.debug('\nMessage de débogage :\n', message); });
client.on('warn', (warning) => { console.warn('\nAvertissement :\n', warning); });

// --------------------------------------------------------------
// ----------------------- Activation bot -----------------------
// --------------------------------------------------------------

// definition des variables
export let BotChan;
export let BotChanOfficier;

// definition des chan utilisé par le bot
client.on('ready', async () => {
  console.log(`╭──────────────────────────────────────────────╮
│        Bot starting up, please wait ...      │
│──────────────────────────────────────────────│
│ • Create command discord in process          │`);
  await createCommands();
  console.log('│ • Create db user in process                  │');
  await createuser();

  // Création des channels
  BotChan = client.channels.cache.get(TODOBotChan);
  BotChanOfficier = client.channels.cache.get(TODOBotChanOfficier);
  const BotReaction = client.channels.cache.get(TODOBotReaction);
  console.log('│ • Initializing automatic function            │');
  TaskHandle(BotReaction);

  console.log(`│──────────────────────────────────────────────│
│              Start-up completed              │
│                 Bot ready !                  │
╰──────────────────────────────────────────────╯\n`);
});

// ---------------------------------------------------------------------------------------------------------------
// --------------------------------------------  Liste des événements --------------------------------------------
// -------------------------- ATTENTION: pour utiliser ceci, il faut adapter les intents -------------------------
// ---------------------------------------------------------------------------------------------------------------
// ready :              le bot est connecté et prêt à interagir avec Discord.
// message :            un message est envoyé dans un canal textuel que le bot peut voir.
// messageDelete :      un message est supprimé dans un canal textuel.
// messageUpdate :      un message est modifié dans un canal textuel.
// guildMemberAdd :     un utilisateur rejoint le serveur.
// guildMemberRemove :  un utilisateur quitte le serveur.
// voiceStateUpdate :   l'état vocal d'un utilisateur change (par exemple, il rejoint un salon vocal, le quitte, ou mute son microphone).
// guildCreate :        le bot rejoint un nouveau serveur.
// guildDelete :        le bot quitte un serveur.
// guildUpdate :        les données d'un serveur (comme son nom ou son icône) sont mises à jour.
// channelCreate :      un nouveau canal est créé sur le serveur.
// channelDelete :      un canal est supprimé du serveur.
// channelUpdate :      les données d'un canal (comme son nom ou ses permissions) sont mises à jour.
// roleCreate :         un nouveau rôle est créé sur le serveur.
// roleDelete :         un rôle est supprimé du serveur.
// roleUpdate :         les données d'un rôle (comme son nom ou ses permissions) sont mises à jour.
// presenceUpdate :     l'état de présence d'un utilisateur (en ligne, inactif, etc.) est mis à jour.
// typingStart :        un utilisateur commence à taper dans un canal textuel.
// typingStop :         un utilisateur arrête de taper dans un canal textuel.
// warn :               lorsqu'un avertissement est émis par le client.
// error :              lorsqu'une erreur se produit dans le client.
// rateLimit :          le bot est soumis à un taux limité par Discord.
// ----------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------
// ----------------------- User leave discord ------------------------
// -------------------------------------------------------------------
client.on('guildMemberRemove', async (member) => {
  if (member.user.bot) return;
  // console.log(`${member.user.username} a quitté le serveur.`);
  deleteUser(member, BotChanOfficier)
});

// -------------------------------------------------------------------
// ---------------- User connected chan discord ----------------------
// -------------------------------------------------------------------
client.on('voiceStateUpdate', async (oldState, newState) => {
  if (newState.member.user.bot) return;
  if (newState.channel) {
    await PlayerCreateOrUpdate(newState.member.user.id);
  }
});

// -------------------------------------------------------------------
// ---------------- User connected chan discord ----------------------
// -------------------------------------------------------------------
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (newMember.user.bot) return;

  // Roles utilisateur
  const oldRoles = oldMember.roles.cache,
    newRoles = newMember.roles.cache;

  // Has Role user ?
  const oldHasuser = oldRoles.has(idRoleUser),
    newHasuser = newRoles.has(idRoleUser);
  // Check if removed or added
  if (oldHasuser && !newHasuser) { // Role user remove
    deleteUser(newMember, BotChanOfficier)
  } else if (!oldHasuser && newHasuser) { // Role user add
    await PlayerCreateOrUpdate(newMember.user.id);
  }

  // Has Role officier ?
  const oldHasofficier = oldRoles.has(idRoleOfficier),
    newHasofficier = newRoles.has(idRoleOfficier);
  if (oldHasofficier && !newHasofficier) { // Role officier remove
    await PlayerCreateOrUpdate(newMember.user.id);
  } else if (!oldHasofficier && newHasofficier) { // Role officier add
    await PlayerCreateOrUpdate(newMember.user.id);
  }
});

// --------------------------------------------------------------
// -------------------- Add message reaction --------------------
// --------------------------------------------------------------
client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;
  if (!await isMember(user.id)) return;

  if (reaction.message.channel.id == TODOBotReaction && botOn(reaction.message.id)) {
    await PlayerCreateOrUpdate(user.id);
    // Ajout de la réaction
    await addReaction(reaction, user);
  }
});

// --------------------------------------------------------------
// ------------------ Delete message reaction -------------------
// --------------------------------------------------------------
client.on("messageReactionRemove", async (reaction, user) => {
  if (user.bot) return;
  if (!await isMember(user.id)) return;

  if (reaction.message.channel.id == TODOBotReaction && botOn(reaction.message.id)) {
    await PlayerCreateOrUpdate(user.id);
    // Retrait de la réaction
    await removeReaction(reaction, user);
  }
});

// --------------------------------------------------------------
// ---------------------- Message command -----------------------
// --------------------------------------------------------------
client.on('messageCreate', async message => {

  const BotReaction = client.channels.cache.get(TODOBotReaction);
  
  if (message.author.bot) return;
  var MC = message.content.toLowerCase();
  var AuthorID = message.author.id;
  await PlayerCreateOrUpdate(AuthorID);
  if (!await isMember(AuthorID)) return;

  // Fonction de test
  if (MC.startsWith("/test")) {
    cronResetMsgReaction(BotReaction);
    message.delete();
  }

});

// --------------------------------------------------------------
// -------------------- Interaction command ---------------------
// --------------------------------------------------------------
client.on('interactionCreate', async (interaction) => {
  if (interaction.user.bot) return;
  interaction.ephemeral = true;

  // -----------------------
  // ---- Visite guidée ----
  // -----------------------
  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'modalvisite') {
      return visit2(interaction);
    }
  }

  // L'interaction est de type composant d'un message
  if (interaction.isMessageComponent()) {
    if (interaction.customId === 'visite_start') {
      return visit1(interaction);
    }

    if (interaction.customId === 'visite_modal') {
      modalvisitelvlAndInflu(interaction);
    }

    if (interaction.customId === 'visite_class') {
      return visit3(interaction);
    }
  }

  // -----------------------------
  // ---- Command utilisateur ----
  // -----------------------------
  if (!interaction.isCommand()) return;
  await PlayerCreateOrUpdate(interaction.user.id);

  // interaction changement de level du héros, Command /visite_guidée
  if (interaction.commandName === "visite_guidée") {
    if (await isMember(interaction.user.id)) {
      return await slashvisite(interaction);
    } else {
      return await slashvisitenotpossible(interaction);
    }
  }

  // Les intéraction suivante sont réservé aux membre
  if (!await isMember(interaction.user.id)) return;

  // interaction qui retourne l'embed data de l'utilisateur, Command /data
  if (interaction.commandName === "data") {
    interaction.reply({
      embeds: [await EmbedData(interaction)],
      ephemeral: true,
    });
    return true;
  }

  // interaction qui retourne l'embed guide de l'utilisateur, Command /data
  if (interaction.commandName === "guide") {
    interaction.reply({
      embeds: [await EmbedGuide()],
      ephemeral: true,
    });
    return true;
  }

  // interaction changement de level du héros, Command /lvl
  if (interaction.commandName === "level") {
    return await slashLevel(interaction);
  }

  // interaction changement de l'influence du héros, Command /influ
  if (interaction.commandName === "influence") {
    return await slashInflu(interaction);
  }

  // interaction changement de classe, Command /class
  if (interaction.commandName === "classe") {
    return await slashClass(interaction);
  }

  // interaction qui donne l'adresse du site internet associé au bot
  if (interaction.commandName === "site") {
    interaction.reply({
      content: "Voici le lien du site internet associé au bot :\n<" + siteInternet + ">",
      ephemeral: true,
    });
    return true;
  }

  // --------------------------
  // ---- Command Officier ----
  // --------------------------
  if (interaction.commandName === "officier_nombre_inscript") {
    if (isOfficier(interaction.user.id)) {
      cmdnb(interaction.user.id);
      interaction.reply({
        content: "Le nombre de joueur inscrit ou non à la prochaine GvG a été posté dans le canal <#" + TODOBotChanOfficier + ">",
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "Vous n'avez pas les autorisations nécéssaire pour réaliser cet action",
        ephemeral: true,
      });
    }
    return true;
  }

  if (interaction.commandName === "officier_liste_inscrits") {
    if (isOfficier(interaction.user.id)) {
      cmdlist(interaction.user.id);
      interaction.reply({
        content: "La liste des joueurs inscrit à la prochaine GvG a été posté dans le canal <#" + TODOBotChanOfficier + ">",
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "Vous n'avez pas les autorisations nécéssaire pour réaliser cet action",
        ephemeral: true,
      });
    }
    return true;
  }

  if (interaction.commandName === "officier_liste_non_inscrits") {
    if (isOfficier(interaction.user.id)) {
      const unregisteredlist = await unregisteredList();
      Messagegvg(interaction.user.id, unregisteredlist);
      interaction.reply({
        content: "La liste des joueurs non inscrit à la prochaine GvG a été posté dans le canal <#" + TODOBotChanOfficier + ">",
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "Vous n'avez pas les autorisations nécéssaire pour réaliser cet action",
        ephemeral: true,
      });
    }
    return true;
  }

  // ------------------------------
  // ---- Command admin du bot ----
  // ------------------------------
  if (interaction.commandName === "admin_raidreset") {
    return await slashRaidReset(interaction);
  }

  if (interaction.commandName === "admin_resetmsggvg") {
    const BotReaction = client.channels.cache.get(TODOBotReaction);
    return await slashResetmsggvg(BotReaction, interaction);
  }
});

// --------------------------------------------------------------
// --------------------- Automatic function ---------------------
// --------------------------------------------------------------
function TaskHandle(BotReaction) {
  // Fonction automatique de check des presences discord pendant la GvG
  let checkPresence = new CronJob('0 */1 20 * * 2,6', function () {
    cronCheckpresence();
  }, null, true, 'Europe/Paris');
  checkPresence.start();

  // fonction de changement automatique du message de réaction à 21h mardi et samedi
  let resetmsgreact = new CronJob('0 0 21 * * 2,6', function () {
    cronResetMsgReaction(BotReaction);
  }, null, true, 'Europe/Paris');
  resetmsgreact.start();
}

