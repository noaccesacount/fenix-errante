const fs = require('fs');
const path = require('path');

module.exports.loadCommands = (client) => {
  const commandsPath = path.join(__dirname, '../slashcommands');
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const command = require(path.join(commandsPath, file));
    client.slashCommands.set(command.data.name, command);
  }
  console.log(`✅ ${files.length} comandos cargados`);
};   
