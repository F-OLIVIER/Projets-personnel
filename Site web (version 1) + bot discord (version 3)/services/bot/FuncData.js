// fichier annexe
import { ServerID, idRoleOfficier, idRoleUser } from './config.js';
import { CreateOrUpdateUser } from './database.js';
import { client } from './Constant.js';

export async function createuser() {
  const serv = client.guilds.cache.get(ServerID);
  try {
    const members = await serv.members.fetch([ServerID]);
    members.forEach(async (member) => {
      if (!member.user.bot) {
        await PlayerCreateOrUpdate(member.user.id);
      }
    })
  } catch (err) {
    console.log(err);
  }
}

export async function isMember(MemberID) {
  const serv = await client.guilds.fetch(ServerID);
  const guildMember = await serv.members.fetch(MemberID);
  let result = false;
  guildMember.roles.cache.forEach(role => {
    if (role.id == idRoleOfficier || role.id == idRoleUser) {
      result = true;
    }
  });
  return result
}

// fonction de creation et de mise a jour d'un utilisateur de la base de donnée lowdb
export async function PlayerCreateOrUpdate(MemberID) {
  if (await isMember(MemberID)) {
    // Récupération des infos serveur
    const serv = await client.guilds.fetch(ServerID);
    // Récupération des infos du joueur ayant l'id "MemberID"
    const guildMember = await serv.members.fetch(MemberID);
    let allListRole = [];
    guildMember.roles.cache.forEach(role => {
      allListRole.push(role.id);
    });

    let CreateOrUpdateinDB = false;
    // check de la liste des roles discord pour garder le plus élevé pour les permissions du site internet
    let MemberRole = '';
    if (allListRole.includes(idRoleOfficier)) {
      MemberRole = 'Officier';
      CreateOrUpdateinDB = true;
    } else if (allListRole.includes(idRoleUser)) {
      MemberRole = 'Membre';
      CreateOrUpdateinDB = true;
    } else {
      MemberRole = "pas de role spécifique";
    }

    if (CreateOrUpdateinDB) {
      // data pour la requete sql
      const data = {
        DiscordID: MemberID,
        DiscordName: guildMember.displayName,
        DiscordBaseName: guildMember.user.username,
        DiscordRole: MemberRole,
        DiscordPhoto: guildMember.user.avatarURL(),
      };

      await CreateOrUpdateUser(data);
    }
  }
}

