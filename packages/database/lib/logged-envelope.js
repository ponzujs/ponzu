const { ioc } = require('@ponzujs/core');

class LoggedEnvelope {
  // eslint-disable-next-line class-methods-use-this
  get logger() {
    return ioc.get('logger');
  }

  log(eventName, collection, options) {
    this.logger.log(eventName);
    return options;
  }

  beforeAll(eventName, collection, options) {
    return this.log(eventName, collection, options);
  }

  afterAll(eventName, collection, options) {
    return this.log(eventName, collection, options);
  }
}

module.exports = { LoggedEnvelope };
