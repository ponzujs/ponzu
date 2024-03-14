const closedSchema = require('./closed-schema');
const schema = require('./schema');
const types = require('./types');

module.exports = {
  ...closedSchema,
  ...schema,
  ...types,
};
