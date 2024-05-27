// Fichier annexe
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { createeventindb } from "./database.js";
import { idRoleUser } from "./config.js";

// Module nodejs et npm
import { format } from 'date-fns';
import moment from 'moment-timezone';
import frLocale from 'date-fns/locale/fr';

export async function modalcreateevent(interaction) {
    const modal = new ModalBuilder()
        .setTitle("Création d'un événement")
        .setCustomId('modalcreateevent')
        .setComponents(
            new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                        .setCustomId('title')
                        .setLabel("Titre de l'événement")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
            new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel("Description de l'événement")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                ),
            new ActionRowBuilder()
                .setComponents(
                    new TextInputBuilder()
                        .setCustomId('date')
                        .setLabel("Date et heure (ex: 2024-05-26 14:30)")
                        .setPlaceholder("AAAA-MM-JJ HH:MM")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                )
        );

    await interaction.showModal(modal);
}


export async function createevent(interaction) {
    // Titre de l'event
    const titleInput = interaction.fields.getTextInputValue('title');
    // Description de l'event
    const descriptionInput = interaction.fields.getTextInputValue('description');
    // date et heure de l'event
    const dateInput = interaction.fields.getTextInputValue('date');
    if (!moment(dateInput, 'YYYY-MM-DD HH:mm', true).isValid()) {
        interaction.reply({
            content: "Format de date et heure invalide. Merci d'utilisez AAAA-MM-JJ HH:MM.",
            ephemeral: true
        });
        return
    }

    const idevent = await createeventindb(titleInput, descriptionInput, dateInput);

    await interaction.reply({
        files: ["https://i43.servimg.com/u/f43/15/76/70/95/events12.jpg"],
        embeds: [await EmbedEvent(titleInput, dateInput, descriptionInput)],
        components: [await ButtonEmbedEvent(idevent)],
    }).catch(err => {
        console.error('Error sending EmbedEvent:', err);
    });
}

export async function EmbedEvent(title, date, description, inscrit = []) {
    let listInscrit = 0;
    if (inscrit.length !== undefined) {
        listInscrit = inscrit.length;
    }

    const listeDesInscrits = inscrit.map(entry => entry.DiscordName).join(' - ');
    const dateFormat = new Date(date);
    const formattedDate = format(dateFormat, "'Le' EEEE dd MMMM yyyy 'à' HH'h'mm''", { locale: frLocale });
    const embedData = new EmbedBuilder()
        .setAuthor({ name: title })
        .setTitle(formattedDate)
        .setColor(13373715)
        .setDescription("Pour : <@&" + idRoleUser + ">")
        .addFields(
            { name: "Description de l'événement :", value: description, inline: false },
            { name: '✅ Liste des inscrits (' + listInscrit + ') :', value: listeDesInscrits || 'Aucun', inline: true }
        );

    return embedData
}

export async function ButtonEmbedEvent(idevent) {
    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('eventinscripted' + idevent)
                .setLabel("✅ M'inscrire")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('eventdisinscripted' + idevent)
                .setLabel("✖️ Me désinscrire")
                .setStyle(ButtonStyle.Danger),
        );

    return buttons
}