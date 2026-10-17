const { Client, Collection, GatewayIntentBits } = require("discord.js");
const config = require("./config.js");
const express = require("express");
const { Kazagumo } = require("kazagumo");

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

// Lavalink (Kazagumo v2)
const manager = new Kazagumo(client, {
  send: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;
    const member = guild.members.cache.get(payload.userId);
    if (member) {
      member.voice.setChannel(payload.channelId);
    }
  },
  nodes: [
    {
      id: "main",
      url: "ws://lavalink.heavencloud.in:2333",
      auth: "heavencloud",
      retryAmount: Infinity
    }
  ]
});

client.manager = manager;

require("./handlers/eventHandler").loadEvents(client);

client.once('ready', () => console.log(`Online como ${client.user.tag}`));

client.login(config.token);   