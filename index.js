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

// Lavalink (Kazagumo)
const manager = new Kazagumo(client, {
  send: (guildId, payload) => {
    const channel = client.channels.cache.get(payload.deaf || payload.speak ? payload.channelId : payload.channelId);
    if (!channel) return;
    client.api.guilds[guildId].voiceChannels[channel.id].patch({
      data: {
        users: [{
          id: payload.userId,
          channel_id: payload.channelId,
          mute: payload.deaf,
          deaf: payload.deaf
        }]
      }
    }).catch(console.error);
  },
  nodes: [
    {
      name: "HeavenCloud",
      host: "lavalink.heavencloud.in",
      port: 2333,
      auth: "heavencloud",
      secure: false,
      retryAmount: Infinity
    }
  ]
});

client.manager = manager;

require("./handlers/eventHandler").loadEvents(client);

client.once('ready', () => console.log(`Online como ${client.user.tag}`));

client.login(config.token);   