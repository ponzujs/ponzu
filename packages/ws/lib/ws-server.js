const { Server } = require('socket.io');
const { ioc, serialize } = require('@ponzujs/core');

const logger = ioc.get('logger');

class WsServer {
  constructor(settings = {}) {
    this.port = settings.port || process.env.WS_PORT || 5050;
    this.sockets = {};
    this.onConnect = () => {};
    this.onDisconnect = () => {};
    this.onPing = () => {};
    this.onMessage = () => {};
  }

  isStarted() {
    return !!this.io;
  }

  start() {
    if (!this.io) {
      this.io = new Server(this.port);
      this.io.on('connect_error', (err) => logger.log(err));
      this.io.on('connect_failed', (err) => logger.log(err));
      this.io.on('disconnect', (err) => logger.log(err));
      this.io.on('update', (err) => logger.log(err));
      this.io.on('connect', (socket) => {
        this.onConnect(socket);
        this.sockets[socket.id] = socket;
        socket.on('ping', (cb) => {
          this.onPing(socket);
          cb();
        });
        socket.on('message', async (data) => {
          const result = await this.onMessage(socket, data);
          if (result) {
            socket.emit('message', result);
          }
        });
        socket.on('disconnect', () => {
          this.onDisconnect(socket);
          delete this.sockets[socket.id];
        });
        socket.on('error', (err) => {
          logger.error('ws error', err);
        });
      });
    }
  }

  stop() {
    if (this.io) {
      this.io.close();
      this.io = undefined;
    }
  }

  broadcast(message) {
    if (this.io) {
      const serialized = serialize(message);
      this.io.emit('message', serialized);
    }
  }
}

module.exports = {
  WsServer,
};
