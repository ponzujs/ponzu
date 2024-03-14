class Schema {
  constructor(schema = {}, options = {}) {
    this.schema = schema;
    this.options = options;
    this.open = options.open === undefined ? true : options.open;
  }

  validate(obj, fieldName = undefined) {
    const schemaKeys = Object.keys(this.schema);
    const errors = [];
    for (let i = 0; i < schemaKeys.length; i += 1) {
      const key = schemaKeys[i];
      const keyName = fieldName ? `${fieldName}.${key}` : key;
      const type = this.schema[key];
      const error = type.validate(obj[key], keyName);
      if (error) {
        errors.push(error);
      }
    }
    if (!this.open) {
      const objKeys = Object.keys(obj);
      for (let i = 0; i < objKeys.length; i += 1) {
        const key = objKeys[i];
        const keyName = fieldName ? `${fieldName}.${key}` : key;
        if (!schemaKeys.includes(key)) {
          errors.push(`Unexpected key: ${keyName}`);
        }
      }
    }
    return errors.flat();
  }
}

module.exports = {
  Schema,
};
