const { curry2 } = require('./curry2');
const { getAt } = require('./get-at');
const { atPath } = require('./at-path');

function getAtPath(x, path) {
  if (x === undefined || x === null) {
    return undefined;
  }
  let current = x;
  const pathArr = Array.isArray(path) ? path : atPath(path);
  for (let i = 0; i < pathArr.length; i += 1) {
    const index = pathArr[i];
    try {
      current = getAt(
        current,
        index.startsWith('[') ? index.slice(1, -1) : index
      );
    } catch (err) {
      return undefined;
    }
    if (current === undefined || x === null) {
      return undefined;
    }
  }
  return current;
}

module.exports = { getAtPath: curry2(getAtPath) };
