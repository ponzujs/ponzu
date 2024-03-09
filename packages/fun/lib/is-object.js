function isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}

module.exports = { isObject };
