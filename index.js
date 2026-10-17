const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song or adds it to the queue.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Type the song name or paste the song link")
        .setRequired(true),
    ),
  async execute(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;
    const query = interaction.options.getString("song");

    if (!voiceChannel) {
      return interaction.reply({
        content: "❌ You must join a voice channel first.",
        ephemeral: true,
      });
    }

    const botChannel = interaction.guild.members.me.voice.channel;

    if (botChannel && botChannel.id !== voiceChannel.id) {
      return interaction.reply({
        content: "❌ I'm already playing music in another voice channel.",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    try {
      const result = await client.manager.search({ query });

      if (!result?.tracks?.length) {
        return interaction.editReply({
          content: "❌ No song was found.",
        });
      }

      const track = result.tracks[0];

      let player = client.manager.players.get(interaction.guild.id);

      if (!player) {
        player = client.manager.players.create({
          guildId: interaction.guild.id,
          voiceChannelId: voiceChannel.id,
          textChannelId: interaction.channel.id,
        });

        await player.connect();
      }

      player.queue.add(track);

      if (!player.playing && !player.paused) {
        await player.play();
      }

      return interaction.editReply({
        content: `🎵 Added to queue: **${track.title}**`,
      });
    } catch (error) {
      console.error("[MUSIC] Error in /play:", error);
      return interaction.editReply({
        content: "❌ An error occurred while searching or playing the song.",
      });
    }
  },
};