const { transform } = require('./transform');

class Transformer {
  constructor(settings = {}) {
    this.transformation = settings.transformation || {};
    this.defaultContext = settings.defaultContext || {};
  }

  transform(obj, context) {
    return transform(obj, this.transformation, {
      ...this.defaultContext,
      ...context,
    });
  }
}

module.exports = {
  Transformer,
};
