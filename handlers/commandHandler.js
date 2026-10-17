const fs = require('fs');
const path = require('path');

function loadCommandsFromDir(dir, client) {
  const files = fs.readdirSync(dir);
  let count = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      count += loadCommandsFromDir(filePath, client);
    } else if (file.endsWith('.js')) {
      try {
        const command = require(filePath);
        if (command.data && command.execute) {
          client.slashCommands.set(command.data.name, command);
          count++;
        }
      } catch (e) {
        console.error(`⚠️ Error cargando ${file}:`, e.message);
      }
    }
  }
  return count;
}

module.exports.loadCommands = (client) => {
  const commandsPath = path.join(__dirname, '../slashcommands');
  const count = loadCommandsFromDir(commandsPath, client);
  console.log(`✅ ${count} comandos cargados`);
};   