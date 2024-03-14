const { clone } = require('@ponzujs/core');
const { Transformer } = require('./transformer');

class ConditionalTransformer extends Transformer {
  constructor(settings = {}) {
    super(settings);
    this.condition = settings.condition || (() => true);
  }

  match(obj, context) {
    return this.condition(obj, context);
  }

  transform(obj, context) {
    return this.match(obj, context)
      ? super.transform(obj, context)
      : clone(obj);
  }
}

module.exports = {
  ConditionalTransformer,
};
