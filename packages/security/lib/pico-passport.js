class PicoPassport {
  constructor() {
    this.strategies = {};
  }

  use(strategy) {
    this.strategies[strategy.name] = strategy;
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  initialize() {
    return (req, res, next) => next();
  }

  authenticate(name, options, callback) {
    return (req) => {
      const strategy = Object.create(this.strategies[name]);
      strategy.success = (user, info) => callback(null, user, info);
      strategy.authenticate(req, options);
    };
  }
}

const picoPassport = new PicoPassport();
module.exports = { PicoPassport, picoPassport };
