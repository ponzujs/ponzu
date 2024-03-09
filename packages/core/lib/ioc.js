const { factory } = require('./factory');
const { consoleLogger } = require('./console-logger');

class Container {
  constructor(ownFactory) {
    this.factory = ownFactory || factory;
  }

  register(name, obj) {
    this.factory.registerSingleton(name, obj);
  }

  get(name) {
    return this.factory.getSingleton(name);
  }
}

const ioc = new Container();
ioc.register('logger', consoleLogger);

module.exports = {
  Container,
  ioc,
};
