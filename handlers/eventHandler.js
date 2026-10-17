const fs = require('fs');
const path = require('path');

module.exports.loadEvents = (client) => {
  const eventsPath = path.join(__dirname, '../events');
  const events = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

  for (const file of events) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
  }
  console.log(`✅ ${events.length} eventos cargados`);
};