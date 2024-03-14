const { ValidateType } = require('./validate-type');

class ArrayOfType extends ValidateType {
  constructor(options = {}) {
    super(options);
    this.type = options.type;
    this.min = options.min;
    this.max = options.max;
  }

  validate(value, fieldName = 'Value') {
    const result = super.validate(value, fieldName);
    if (result) {
      return result;
    }
    if (value !== undefined && value !== null) {
      if (!Array.isArray(value)) {
        return `${fieldName} must be an array`;
      }
      if (this.min && value.length < this.min) {
        return `${fieldName} must have at least ${this.min} elements`;
      }
      if (this.max && value.length > this.max) {
        return `${fieldName} must have at most ${this.max} elements`;
      }
      if (this.type) {
        const errors = [];
        if (Array.isArray(this.type)) {
          for (let i = 0; i < this.type.length; i += 1) {
            const type = this.type[i];
            const item = value[i];
            const error = type.validate(item, `${fieldName}[${i}]`);
            if (error?.length > 0) {
              errors.push(error);
            }
          }
        } else {
          for (let i = 0; i < value.length; i += 1) {
            const item = value[i];
            const error = this.type.validate(item, `${fieldName}[${i}]`);
            if (error?.length > 0) {
              errors.push(error);
            }
          }
        }
        return errors.flat();
      }
    }
    return undefined;
  }
}

function ArrayOf(options) {
  return new ArrayOfType(options);
}

module.exports = {
  ArrayOfType,
  ArrayOf,
};
