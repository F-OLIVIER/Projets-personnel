// Fichier annexe
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { createeventindb } from "./database.js";
import { idRoleUser } from "./config.js";

// Module nodejs et npm
import moment from 'moment-timezone';
import frLocale from 'date-fns/locale/fr';
import { format } from 'date-fns';

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
                        .setLabel("Date et heure (ex: 03/05/2024 21:00)")
                        .setPlaceholder("JJ/MM/AAAA HH:MM")
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

    if (!moment(dateEn(dateInput), 'YYYY-MM-DD HH:mm', true).isValid()) {
        interaction.reply({
            content: `Format de date et heure invalide. Merci d'utilisez "JJ/MM/AAAA HH:MM" ou "JJ-MM-AAAA HH:MM".`,
            ephemeral: true
        });
        return
    }

    const inputDate = moment(dateEn(dateInput), 'YYYY-MM-DD HH:mm', true);
    const currentDate = moment();
    if (inputDate.isBefore(currentDate)) {
        interaction.reply({
            content: "Vous avez mis une date passé.",
            ephemeral: true
        });
        return
    }

    const idevent = await createeventindb(titleInput, descriptionInput, dateInput);

    await interaction.reply({
        files: ["https://i43.servimg.com/u/f43/15/76/70/95/events12.jpg"],
        content: "<@&" + idRoleUser + ">",
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
    const dateFormat = new Date(dateEn(date));
    const formattedDateQuand = format(dateFormat, "'Le' EEEE dd MMMM yyyy'", { locale: frLocale });
    const formattedDatehour = format(dateFormat, "HH'h'mm'", { locale: frLocale });

    const embedData = new EmbedBuilder()
        .setTitle(title)
        .addFields(
            { name: "Description de l'événement :", value: description, inline: false },
            { name: '__Quand ?__', value: formattedDateQuand, inline: true },
            { name: '__A quel heure ?__', value: formattedDatehour, inline: true },
            { name: '✅ Liste des inscrits (' + listInscrit + ') :', value: listeDesInscrits || 'Aucun', inline: false }
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

// 20/06/2024 20:00
function dateEn(dateInput) {
    if (dateInput.includes('-')) {
        const [date, heure] = dateInput.split(' ');
        const [jour, mois, annee] = date.split('-');
        const dateEn = `${annee}-${mois}-${jour} ${heure}`;
        return dateEn;
    } else {
        const [date, heure] = dateInput.split(' ');
        const [jour, mois, annee] = date.split('/');
        const dateEn = `${annee}-${mois}-${jour} ${heure}`;
        return dateEn;
    }
}