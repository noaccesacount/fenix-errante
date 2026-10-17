const { Client, Collection, GatewayIntentBits } = require("discord.js");
const config = require("./config.js");
const express = require("express");
const { Manager } = require("moonlink.js");

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

// Moonlink v5 (Lavalink v4)
const manager = new Manager({
  nodes: [
    {
      identifier: "main",
      host: "lavalinkv4.serenetia.com",
      port: 443,
      password: "https://dsc.gg/ajidevserver",
      secure: true
    }
  ],
  sendPayload: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild) guild.shard.send(JSON.parse(payload));
  }
});

client.manager = manager;

require("./handlers/eventHandler").loadEvents(client);

client.once('ready', () => {
  console.log(`Online como ${client.user.tag}`);
  client.manager.init(client.user.id);
});

client.on('raw', (packet) => {
  client.manager.packetUpdate(packet);
});

client.login(config.token);