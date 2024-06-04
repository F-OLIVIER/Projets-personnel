// ╭───────────────────────────────────────────────╮
// │          Constante à ne pas modifier          │
// ╰───────────────────────────────────────────────╯
export const adressdb = '../database/databaseGvG.db';

// ╭───────────────────────────────────────────────╮
// │             Constante à modifier              │
// ╰───────────────────────────────────────────────╯
// Adresse du site internet associé pour la commande message "/site"
// export const siteInternet = "http://lnb.sytes.net:8080";
export const siteInternet = "http://localhost:8080";

// ID du serveur discord
export const ServerID = '674215425546125323';

// Liste d'ID des utilisateurs discord autorisé a utilisé les commandes "admin" du bot
export const ListAdmin = ["179655652153491456"]; // Fabien

// ID des chan Discord
export const TODOBotChan = '674275684364845057';            // chan message utilisateur de bienvenue
export const TODOBotReaction = '1111983569900929024';       // chan du message d'inscription au GvG (emoji réaction)
export const TODOBotChanOfficier = '715893349931810898';    // chan officier (retour des commandes réservé aux officiers)

// ID des rôle Discord (role autorisé à être enregistré dans la base de données)
export const idRoleUser = '1223899873196113991';    // role membre (aucun droit d'accées site internet)
export const idRoleOfficier = '736886582489120768'; // role officier (droit d'accées site internet)

// Catégorie des channels à checker pour vérifier la présences des joueurs pendant les gvg
export const idCategorie = '674215425990459413';
