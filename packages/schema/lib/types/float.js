const { ValidateType } = require('./validate-type');

class FloatType extends ValidateType {
  constructor(options = {}) {
    super(options);
    this.min = options.min;
    this.max = options.max;
  }

  validate(value, fieldName = 'Value') {
    const result = super.validate(value, fieldName);
    if (result) {
      return result;
    }
    if (value !== undefined && value !== null) {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        return `${fieldName} must be a number`;
      }
      if (this.min && value < this.min) {
        return `${fieldName} must be at least ${this.min}`;
      }
      if (this.max && value > this.max) {
        return `${fieldName} must be at most ${this.max}`;
      }
    }
    return undefined;
  }
}

function Float(options) {
  return new FloatType(options);
}

module.exports = {
  FloatType,
  Float,
};
