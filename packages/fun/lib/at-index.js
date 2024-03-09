const { curry2 } = require('./curry2');

function atIndex(length, index) {
  if (index >= length || index < -length) {
    return -1;
  }
  return (length + index) % length;
}

module.exports = { atIndex: curry2(atIndex) };
