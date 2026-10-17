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
      identifier: "trinium",
      host: "lavalink-v4.triniumhost.indevs.in",
      port: 443,
      password: "free",
      secure: true
    },
    {
      identifier: "nazha",
      host: "lavalink.nazha.online",
      port: 443,
      password: "nazhafreelava",
      secure: true
    },
    {
      identifier: "millo",
      host: "lava-v4.millohost.my.id",
      port: 443,
      password: "https://discord.gg/mjS5J2K3ep",
      secure: true
    }
  ],
  sendPayload: (guildId, payload) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild) guild.shard.send(JSON.parse(payload));
  }
});

client.manager = manager;

// Logs de conexión (para ver en Render qué nodo conecta)
client.manager.on('nodeConnect', (node) => {
  console.log(`✅ Nodo Lavalink conectado: ${node.identifier}`);
});
client.manager.on('nodeError', (node, error) => {
  console.error(`❌ Nodo ${node.identifier} error:`, error.message);
});
client.manager.on('nodeDisconnect', (node) => {
  console.log(`⚠️ Nodo ${node.identifier} desconectado`);
});

require("./handlers/eventHandler").loadEvents(client);

client.once('ready', () => {
  console.log(`Online como ${client.user.tag}`);
  client.manager.init(client.user.id);
});

client.on('raw', (packet) => {
  client.manager.packetUpdate(packet);
});

client.login(config.token);   