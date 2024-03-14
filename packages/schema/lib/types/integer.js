const { FloatType } = require('./float');

class IntegerType extends FloatType {
  validate(value, fieldName = 'Value') {
    const result = super.validate(value, fieldName);
    if (result) {
      return result;
    }
    if (value !== undefined && value !== null) {
      if (!Number.isInteger(value)) {
        return `${fieldName} must be an integer`;
      }
    }
    return undefined;
  }
}

function Integer(options) {
  return new IntegerType(options);
}

module.exports = {
  IntegerType,
  Integer,
};
