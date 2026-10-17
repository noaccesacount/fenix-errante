const { Client, Collection, GatewayIntentBits } = require("discord.js");
const config = require("./config.js");
const express = require("express");
const { Moonlink } = require("moonlink.js");

// Keep-alive
const app = express();
app.get('/', (req, res) => res.send('Bot está vivo'));
app.listen(process.env.PORT || 3000, () =>
  console.log(`Keep-alive activo en puerto ${process.env.PORT || 3000}`)
);

// Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.slashCommands = new Collection();
client.interactions = new Collection();

// Moonlink (Lavalink)
const manager = new Moonlink(client, {
  autoCreate: false,
  nodes: [
    {
      id: "main",
      host: "lavalink.heavencloud.in",
      port: 2333,
      authorization: "heavencloud",
      secure: false,
      retryAmount: Infinity
    }
  ]
});

client.manager = manager;

require("./handlers/eventHandler").loadEvents(client);

client.once('ready', () => console.log(`Online como ${client.user.tag}`));

client.login(config.token);   