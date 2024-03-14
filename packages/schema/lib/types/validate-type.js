class ValidateType {
  constructor(options = {}) {
    this.mandatory = options.mandatory !== undefined ? options.mandatory : true;
    this.nullable = options.nullable !== undefined ? options.nullable : false;
  }

  validate(value, fieldName = 'Value') {
    if (this.mandatory && value === undefined) {
      return `${fieldName} is mandatory`;
    }
    if (!this.nullable && value === null) {
      return `${fieldName} cannot be null`;
    }
    return undefined;
  }
}

module.exports = {
  ValidateType,
};
