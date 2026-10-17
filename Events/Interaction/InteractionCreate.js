module.exports = {
  name: 'interactionCreate',
  once: false,
  execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
      command.execute(client, interaction);
    } catch (error) {
      console.error(`[COMMAND] Error in /${interaction.commandName}:`, error);
      const reply = interaction.deferred || interaction.replied
        ? interaction.followUp({ content: `❌ Error: ${error.message}`, ephemeral: true })
        : interaction.reply({ content: `❌ Error: ${error.message}`, ephemeral: true });
    }
  }
};   