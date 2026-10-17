const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Salta a la siguiente canción'),
  async execute(client, interaction) {
    const player = client.manager.players.get(interaction.guild.id);

    if (!player || !player.current) {
      return interaction.reply({ content: '❌ No hay nada sonando.', ephemeral: true });
    }

    player.skip();
    return interaction.reply({ content: '⏭️ Canción saltada.' });
  }
};