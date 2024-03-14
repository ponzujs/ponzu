const { ValidateType } = require('./validate-type');

class BooleanType extends ValidateType {
  validate(value, fieldName = 'Value') {
    const result = super.validate(value, fieldName);
    if (result) {
      return result;
    }
    if (value !== undefined && value !== null && typeof value !== 'boolean') {
      return `${fieldName} must be a boolean`;
    }
    return undefined;
  }
}

function Boolean(options) {
  return new BooleanType(options);
}

module.exports = {
  BooleanType,
  Boolean,
};
