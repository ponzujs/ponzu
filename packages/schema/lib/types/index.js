const any = require('./any');
const anyOf = require('./any-of');
const arrayOf = require('./array-of');
const boolean = require('./boolean');
const enums = require('./enum');
const float = require('./float');
const integer = require('./integer');
const string = require('./string');
const validateType = require('./validate-type');

module.exports = {
  ...any,
  ...anyOf,
  ...arrayOf,
  ...boolean,
  ...enums,
  ...float,
  ...integer,
  ...string,
  ...validateType,
};
