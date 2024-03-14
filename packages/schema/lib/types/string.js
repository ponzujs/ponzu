const { ValidateType } = require('./validate-type');

class StringType extends ValidateType {
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
      if (typeof value !== 'string') {
        return `${fieldName} must be a string`;
      }
      if (this.min && value.length < this.min) {
        return `${fieldName} must be at least ${this.min} characters long`;
      }
      if (this.max && value.length > this.max) {
        return `${fieldName} must be at most ${this.max} characters long`;
      }
    }
    return undefined;
  }
}

function String(options) {
  return new StringType(options);
}

module.exports = {
  StringType,
  String,
};
