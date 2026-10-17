module.exports = {
  name: 'raw',
  once: false,
  execute(client, packet) {
    client.manager.packetUpdate(packet);
  }
};   