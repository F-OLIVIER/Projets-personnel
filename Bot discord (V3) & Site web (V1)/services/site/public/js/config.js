// https://discordjs.guide/oauth2/#setting-up-a-basic-web-server
// localhost (http)
export const LINK_DISCORD = "https://discord.com/oauth2/authorize?client_id=1061579347129016320&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fdiscord&scope=identify"
export const adressAPI = 'http://localhost:8080/api/';

// lnb.sytes.net (http)
// export const LINK_DISCORD =  "https://discord.com/oauth2/authorize?client_id=1061579347129016320&response_type=token&redirect_uri=http%3A%2F%2Flnb.sytes.net%3A8080%2Fdiscord&scope=identify";
// export const adressAPI = 'http://lnb.sytes.net:8080/api/';

// lnb.sytes.net (https)
// export const LINK_DISCORD = "https://discord.com/oauth2/authorize?client_id=1061579347129016320&response_type=token&redirect_uri=https%3A%2F%2Flnb.sytes.net%3A8080%2Fdiscord&scope=identify";
// export const adressAPI = 'https://lnb.sytes.net:443/api/';

export const cookieName = "user_token";
export const domain = "localhost";
