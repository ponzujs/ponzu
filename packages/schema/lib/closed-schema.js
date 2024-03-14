const { Schema } = require('./schema');

class ClosedSchema extends Schema {
  constructor(schema = {}, options = {}) {
    super(schema, { ...options, open: false });
  }
}

module.exports = {
  ClosedSchema,
};
