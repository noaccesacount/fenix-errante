const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('El bot sale del canal de voz'),
  async execute(client, interaction) {
    const player = client.manager.players.get(interaction.guild.id);

    if (!player) {
      return interaction.reply({ content: '❌ No estoy en ningún canal de voz.', ephemeral: true });
    }

    player.destroy();
    return interaction.reply({ content: '👋 Me voy del canal de voz.' });
  }
};