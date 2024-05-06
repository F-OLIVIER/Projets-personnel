// fichier annexe
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { updateInflu, updateLvl, updateclass } from "./database.js";
import { Resetac, Resetraz, Resetsc } from "./FuncRaid.js";
import { cmdclass, cmdresetmsggvg } from "./CommandBot.js";
import { BooleanAdmin, client } from "./Constant.js";

// Module nodejs et npm
import { } from 'dotenv/config';

export async function createCommands() {
    // Type 1 correspond à une Subcommand
    // Type 2 correspond à un Subcommand Group
    // Type 3 correspond à un String
    // Type 4 correspond à un entier
    // Type 5 correspond à un Boolean
    // Type 6 correspond à un User (Un utilisateur Discord)
    // Type 7 correspond à un Channel (Un canal Discord)
    // Type 8 correspond à un Role (Un rôle Discord)

    // -------------------------------------------------------------------
    // ---------------------- Command utilisateur ------------------------
    // -------------------------------------------------------------------

    // Suppression d'une slash command de l'intégration discord
    // await client.application.commands.delete('1232617831787528222'); // id de la slashcommand à supprimer

    // Création de la commande '/data'
    await client.application.commands.create({
        name: "visite_guidée",
        description: "Le pére blaise vous fais visiter les fonctionnalités proposé par le bot discord",
    });

    // Création de la commande '/data'
    await client.application.commands.create({
        name: 'data',
        description: "Affiche les informations de l'utilisateur",
    });

    // Création de la commande '/guide'
    await client.application.commands.create({
        name: 'guide',
        description: "Affiche des informations d'aide (tutorial, etc.) sur Conqueror's Blade",
    });

    // Création de la commande '/site'
    await client.application.commands.create({
        name: 'site',
        description: "Affiche le lien du site internet associé au bot",
    });

    // Création de la commande '/class'
    await client.application.commands.create({
        name: "classe",
        description: "Mettre à jour l'arme jouée avec votre héros",
    });

    // Création de la commande '/lvl'
    await client.application.commands.create({
        name: 'level',
        description: "Mettre à jour le level de votre héros",
        options: [
            {
                name: 'lvl_number',
                description: "level du héros",
                type: 4, // entier
                min_value: 0,
                max_value: 100000,
                required: true,
            }
        ]
    });

    // Création de la commande '/influ'
    await client.application.commands.create({
        name: 'influence',
        description: "Mettre à jour l'influence de votre héros",
        options: [
            {
                name: 'influ_number',
                description: "Influence du héros",
                type: 4, // entier
                min_value: 700,
                max_value: 1000,
                required: true,
            }
        ]
    });

    // -------------------------------------------------------------------
    // ------------------------ Command Officier -------------------------
    // -------------------------------------------------------------------

    // Création de la commande '/nombre_inscription_prochaine_gvg'
    await client.application.commands.create({
        name: "officier_nombre_inscript",
        description: "Affiche le nombre de joueur inscrit pour la prochaine GvG (réservé aux officier)",
    });

    // Création de la commande '/liste_inscrit'
    await client.application.commands.create({
        name: 'officier_liste_inscrits',
        description: "Affiche la liste des pseudo des joueurs inscrit pour la prochaine GvG (réservé aux officier)",
    });

    // Création de la commande '/non_inscrit_GvG'
    await client.application.commands.create({
        name: 'officier_liste_non_inscrits',
        description: "Affiche la liste des pseudo des joueurs non inscrit pour la prochaine GvG (réservé aux officier)",
    });

    // -------------------------------------------------------------------
    // ---------------------- Command admin du bot -----------------------
    // -------------------------------------------------------------------

    // Création de la commande '/raidreset' avec les 3 options possible ("sc", "ac" et "raz")
    await client.application.commands.create({
        name: 'admin_raidreset',
        description: "reset manuel d'un raid (réservé aux admin du bot)",
        options: [
            {
                name: 'option_reset',
                description: "Choisissez une option de reset",
                type: 3, // 3 correspond à une option de type chaîne de texte
                required: true,
                choices: [
                    {
                        name: "Sans calcul statistique",
                        value: "sc"
                    },
                    {
                        name: "Avec calcul statistique",
                        value: "ac"
                    },
                    {
                        name: "Remise à zéro de la base de données",
                        value: "raz"
                    }
                ]
            }
        ]
    });

    // Création de la commande '/resetmsggvg'
    // réalise en même temps le reset gvg sans calcul
    await client.application.commands.create({
        name: 'admin_resetmsggvg',
        description: "reset manuel du message de reaction d'inscription GvG (réservé aux admin du bot)",
    });

}

// -------------------------------------------------------------------
// ---------------------- Command utilisateur ------------------------
// -------------------------------------------------------------------

export async function slashLevel(interaction) {
    const lvlnumber = interaction.options.getInteger("lvl_number");
    updateLvl(interaction.user.id, lvlnumber);
    interaction.reply({
        content: `Votre nouveau level de héros est : ${lvlnumber}`,
        ephemeral: true,
    })
    return true
}

export async function slashInflu(interaction) {
    const influnumber = interaction.options.getInteger("influ_number");
    updateInflu(interaction.user.id, influnumber);
    interaction.reply({
        content: `Votre nouvelle influence de héros est de ${influnumber}`,
        ephemeral: true,
    })
    return true
}

export async function slashClass(interaction) {
    const options = await cmdclass();
    const select = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('class_selector')
            .addOptions(options),
    );
    const responseClass = await interaction.reply({
        content: 'Choisissez votre classe',
        components: [select],
        ephemeral: true,
    });

    // attente de la réponse de l'utilisateur
    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const confirmation_responseClass = await responseClass.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        // intéraction une fois la réponse récupéré
        if (confirmation_responseClass.customId === 'class_selector') {
            if (updateclass(interaction.user.id, confirmation_responseClass.values[0])) {
                interaction.editReply({ content: 'Votre classe à bien été mis à jour', components: [] })
                return true;
            } else {
                interaction.editReply({ content: 'Erreur lors de la mise à jour de votre classe', components: [] })
                return false
            }
        }
    } catch (e) {
        await interaction.editReply({ content: 'Delais de réponse dépassé', components: [] });
    }
    return false
}

// -------------------------------------------------------------------
// ------------------------ Command Officier -------------------------
// -------------------------------------------------------------------


// -------------------------------------------------------------------
// ----------------------- Command admin du bot ----------------------
// -------------------------------------------------------------------

export async function slashRaidReset(interaction) {
    if (BooleanAdmin(interaction.user.id)) {
        const option = interaction.options.getString("option_reset");
        // option "SC" (sans calcul statistique)
        if (option === "sc") {
            Resetsc();
        }
        // option "ac" (avec calcul des statistiques)
        if (option === "ac") {
            Resetac();
        }
        // option "raz" (remise a 0 complet de la BD)
        if (option === "raz") {
            Resetraz();
        }
        interaction.reply({
            content: `Reset effectué`,
            ephemeral: true,
        })
    } else {
        interaction.reply({
            content: `Vous n'avez pas les autorisations necessaire pour réaliser cet action`,
            ephemeral: true,
        })
    }

    return true
}

export async function slashResetmsggvg(interaction) {
    if (BooleanAdmin(interaction.user.id)) {
        cmdresetmsggvg(BotReaction, TODOBotReaction);
        Resetsc();
        interaction.reply({
            content: `Reset effectué et message mis à jour`,
            ephemeral: true,
        })
    } else {
        interaction.reply({
            content: `Vous n'avez pas les autorisations necessaire pour réaliser cet action`,
            ephemeral: true,
        })
    }

    return true
}
