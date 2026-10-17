const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pausa la música'),
  async execute(client, interaction) {
    const player = client.manager.players.get(interaction.guild.id);

    if (!player || !player.current) {
      return interaction.reply({ content: '❌ No hay nada sonando.', ephemeral: true });
    }

    if (player.paused) {
      return interaction.reply({ content: '⚠️ Ya está pausada.', ephemeral: true });
    }

    player.pause();
    return interaction.reply({ content: '⏸️ Música pausada.' });
  }
};