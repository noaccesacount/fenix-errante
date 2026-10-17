require('dotenv').config();
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const config = require('./config.js');
const express = require('express');
const { Manager } = require('moonlink.js');

// Keep-alive
const app = express();
app.get('/', (req, res) => res.send('Bot está vivo'));
app.listen(process.env.PORT || 3000, () =>
  console.log(`✅ Keep-alive activo en puerto ${process.env.PORT || 3000}`)
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

// Moonlink v5 - Nodos Lavalink v4 (confirmados online)
client.manager = new Manager({
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

// Logs de nodo
client.manager.on('nodeConnect', (node) => {
  console.log(`✅ Nodo conectado: ${node.identifier}`);
});
client.manager.on('nodeError', (node, error) => {
  console.error(`❌ Nodo ${node.identifier} error:`, error.message || error);
});
client.manager.on('nodeDisconnect', (node) => {
  console.log(`⚠️ Nodo desconectado: ${node.identifier}`);
});

// Cargar eventos y comandos
require('./handlers/eventHandler').loadEvents(client);
require('./handlers/commandHandler').loadCommands(client);

// Registrar slash commands
client.once('ready', async () => {
  console.log(`🟢 Online como ${client.user.tag}`);
  client.manager.init(client.user.id);

  const rest = new REST().setToken(config.token);
  await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.ownerId),
    { body: client.slashCommands.map(cmd => cmd.data.toJSON()) }
  );
  console.log(`✅ ${client.slashCommands.size} slash commands registrados`);
});

// Raw para Moonlink
client.on('raw', (packet) => {
  client.manager.packetUpdate(packet);
});

client.login(config.token);