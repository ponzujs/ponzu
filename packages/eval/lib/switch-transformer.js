const { clone } = require('@ponzujs/core');
const { ConditionalTransformer } = require('./conditional-transformer');
const { Transformer } = require('./transformer');

class SwitchTransformer extends Transformer {
  constructor(settings = {}) {
    super(settings);
    this.transformations = [];
  }

  addOption(condition, transformation, defaultContext) {
    this.transformations.push(
      new ConditionalTransformer({ condition, transformation, defaultContext })
    );
  }

  transform(obj, context) {
    for (let i = 0; i < this.transformations.length; i += 1) {
      const transformer = this.transformations[i];
      if (transformer.match(obj, context)) {
        return transformer.transform(obj, context);
      }
    }
    if (this.transformation) {
      return super.transform(obj, context);
    }
    return clone(obj);
  }
}

module.exports = {
  SwitchTransformer,
};
