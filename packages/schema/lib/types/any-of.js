const { ValidateType } = require('./validate-type');

class AnyOfType extends ValidateType {
  constructor(options = {}) {
    super(options);
    this.types = options.types;
  }

  validate(value, fieldName = 'Value') {
    const result = super.validate(value, fieldName);
    if (result) {
      return result;
    }
    if (value !== undefined && value !== null) {
      const errors = [];
      for (let i = 0; i < this.types.length; i += 1) {
        const type = this.types[i];
        const error = type.validate(value, fieldName);
        if (!error) {
          return undefined;
        }
        errors.push(error);
      }
      return errors;
    }
    return undefined;
  }
}

function AnyOf(options) {
  return new AnyOfType(options);
}

module.exports = {
  AnyOfType,
  AnyOf,
};
