const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce una canción')
    .addStringOption(opt =>
      opt.setName('song').setDescription('Nombre o enlace de la canción').setRequired(true)
    ),
  async execute(client, interaction) {
    const voiceChannel = interaction.member.voice.channel;
    const query = interaction.options.getString('song');

    if (!voiceChannel) {
      return interaction.reply({ content: '❌ Únete a un canal de voz primero.', ephemeral: true });
    }

    const botChannel = interaction.guild.members.me.voice.channel;
    if (botChannel && botChannel.id !== voiceChannel.id) {
      return interaction.reply({ content: '❌ Ya estoy en otro canal de voz.', ephemeral: true });
    }

    await interaction.deferReply();

    try {
      const result = await client.manager.search({ query });

      if (!result?.tracks?.length) {
        return interaction.editReply({ content: '❌ No se encontró la canción.' });
      }

      const track = result.tracks[0];

      let player = client.manager.players.get(interaction.guild.id);

      if (!player) {
        player = client.manager.createPlayer({
          guildId: interaction.guild.id,
          voiceChannelId: voiceChannel.id,
          textChannelId: interaction.channel.id,
          autoPlay: false,
        });
        await player.connect();
      }

      player.queue.add(track);

      if (!player.playing && !player.paused) {
        await player.play();
      }

      return interaction.editReply({
        content: `🎵 Reproduciendo: **${track.title}**`
      });
    } catch (error) {
      console.error('[PLAY] Error:', error);
      return interaction.editReply({ content: `❌ Error: ${error.message}` });
    }
  }
};