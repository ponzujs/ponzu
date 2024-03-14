const { ValidateType } = require('./validate-type');

class AnyType extends ValidateType {}

function Any(options) {
  return new AnyType(options);
}

module.exports = {
  AnyType,
  Any,
};
