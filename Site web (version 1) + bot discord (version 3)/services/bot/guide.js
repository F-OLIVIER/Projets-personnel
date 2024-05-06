// fichier annexe
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { updateInflu, updateLvl, updateclass } from "./database.js";
import { TODOBotReaction, siteInternet } from "./config.js";
import { cmdclass } from "./CommandBot.js";

export async function slashvisitenotpossible(interaction) {
    const text = `Bonjour brave héros **${interaction.user.username}**,
sois le bienvenu sur ce discord.
Je suis le **Pére Blaise** et je vais te faire visiter le château de la Nuit Blanche.
            
__Mais que vois-je ?__
:rage: Les officiers n'ont pas fait leur travail correctement, notre bon **roi Akyol** ne va pas être content.
Les officiers ne voient pas ce message, je vais donc te faire travailler en te demandant de leur signaler que **tu n'as pas les droits discord nécessaires pour interagir avec le bot**
`;

    interaction.reply({
        content: text,
        components: [],
        ephemeral: true,
    });
    return true
}

export async function slashvisite(interaction) {
    const text = `Bonjour brave héros **${interaction.user.username}**,
sois le bienvenu sur ce discord.
Je suis le **Pére Blaise** et je vais te faire visiter le château de la Nuit Blanche.
        
Étant chargé d'écrire la légende, je vais enregistrer t'es informations pendant la visite.
`;
    const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('visite_start')
                .setLabel('Demarrer la visite')
                .setStyle(ButtonStyle.Success)
        );

    const response = await interaction.reply({
        content: text,
        components: [button],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if (confirmation.customId === 'visite_start') {
            interaction.editReply({ content: text, components: [] })
            return true
        }
    } catch (e) {
        await interaction.editReply({ content: text, components: [] });
    }

    return true
}

export async function visit1(interaction) {
    const text = `Pour commencer, nous allons voir la commande **/level**
Cette commande te permet à tout moment de mettre à jour le niveau de ton héros.
        
Une autre commande importante et la commande **/influence**, elle te permet à tout moment de mettre à jour l'influence de ton héros.
        
Quelles sont les informations te concernant ?
`;
    const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('visite_modal')
                .setLabel("Saisir mon level et mon influence")
                .setStyle(ButtonStyle.Primary)
        );

    const response = await interaction.reply({
        content: text,
        components: [button],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
    } catch (e) {
        await interaction.editReply({ content: text, components: [] });
    }
    return true
}

export async function modalvisitelvlAndInflu(interaction) {
    const modal = new ModalBuilder()
        .setTitle('Visite guidé du chateau LNB')
        .setCustomId('modalvisite')
        .setComponents(
            new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                        .setCustomId('visite_lvl')
                        .setLabel('Level de ton héros')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
            new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                        .setCustomId('visite_influ')
                        .setLabel('Influence de ton héros')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
        );

    await interaction.showModal(modal);
}


export async function visit2(interaction) {
    let textVisite = '';
    // mise à jour du level
    const visite_lvl = parseInt(interaction.fields.getTextInputValue('visite_lvl'));
    let valid = true;
    if (!isNaN(visite_lvl)) {
        updateLvl(interaction.user.id, visite_lvl);
        if (visite_lvl < 100) {
            textVisite = `Ho, un nouveau joueur :shortsword:, magnifique !!!
Tu vas apprendre énormément de choses avec nous. Si tu as des questions, n'hésite pas à les poser.
Les chevalières et chevaliers expérimentés ne manqueront pas une occasion de t'aider.
            
Continuons la visite, avec la commande **/class** tu pourras mettre à jour la classe d'arme que tu joues.
Quelle classe d'arme as-tu choisie de jouer ?
`;
        } else if (visite_lvl > 100) {
            textVisite = `Un preux chevalier expérimenté :muscle:, magnifique !!!
Nos ennemis vont rapidement de craindre, j'espère te voir bientôt dans la garde royale.

Continuons la visite avec la commande **/class**.  Avec celle-là, tu pourras mettre à jour la classe d'arme que tu joues.
Quelle classe d'arme as-tu choisie de jouer ?
`;
        }
    } else {
        valid = false;
    }
    // mise à jour de l'influence
    const visite_influ = parseInt(interaction.fields.getTextInputValue('visite_influ'));
    if (!isNaN(visite_influ)) {
        updateInflu(interaction.user.id, visite_influ);
    } else {
        valid = false;
    }

    if (!valid) {
        textVisite = `Hum… je vois, un petit malin qui essaye de m'avoir !!!!

Continuons la visite, avec la commande **/class**, tu pourras mettre à jour la classe d'arme que tu joues.
Quelle classe d'arme as-tu choisie de jouer ?
`;
    }

    // Suite de la visite
    const options = await cmdclass();
    const select = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('visite_class')
            .addOptions(options),
    );
    const response = await interaction.reply({
        content: textVisite,
        components: [select],
        ephemeral: true,
    });

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
    } catch (e) {
        await interaction.editReply({ content: textVisite, components: [] });
    }
    return true
}

export async function visit3(interaction) {
    // mise à jour de la classe
    updateclass(interaction.user.id, interaction.values[0])

    // Suite de la visite
    await interaction.reply({
        content: `* **/data** te permettra de voir les informations te concernant.
* **/guide** te permettra d'avoir une liste de guide et tutoriel.
* **/site** te permettra d'avoir le lien du site internet associé ou tu pourras remplir ta caserne afin que les officiers puissent préparer les guerres de territoire au mieux et puissent indiquer quelle troupe tu devras prendre pour les batailles.
        
La visite est terminée, tu connais maintenant toutes les commandes de base.
        
Je t'invite maintenant à te rendre sur le site internet afin de compléter ta caserne pour être prêt au combat pour la prochaine GvG
Voici le lien : <${siteInternet}>
        
J'ai failli oublier, une dernière information très importante, pour **t'inscrire au GvG**, il te suffit de répondre par un émoji adapté au message dédié à cela dans le canal <#${TODOBotReaction}>.
Même si tu seras absent, pense à t'inscrire, cela permet au officier de ne pas avoir de doute.
        
Que la gloire soit dans ton sillage !
`,
        components: [],
        ephemeral: true,
    });

    return true
}