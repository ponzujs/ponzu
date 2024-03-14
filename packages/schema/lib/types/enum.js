const { StringType } = require('./string');

class EnumType extends StringType {
  constructor(options = {}) {
    super(options);
    this.options = options.options;
  }

  validate(value, fieldName = 'Value') {
    const result = super.validate(value, fieldName);
    if (result) {
      return result;
    }
    if (value !== undefined && value !== null) {
      if (!this.options.includes(value)) {
        return `${fieldName} must be one of: ${this.options.join(', ')}`;
      }
    }
    return undefined;
  }
}

function Enum(options) {
  return new EnumType(options);
}

module.exports = {
  EnumType,
  Enum,
};
