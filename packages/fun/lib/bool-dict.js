const { forEach } = require('./for-each');
const { isObject } = require('./is-object');
const { isString } = require('./is-string');

function boolDict(x) {
  const result = {};
  if (isString(x)) {
    result[x] = true;
  } else if (isObject(x)) {
    forEach(x, (n, i) => {
      result[i] = true;
    });
  } else {
    forEach(x, (n) => {
      result[n] = true;
    });
  }
  return result;
}

module.exports = { boolDict };
