const { curry3 } = require('./curry3');
const { atPath } = require('./at-path');
const { getAtPath } = require('./get-at-path');

function setAtPathMut(obj, path, value) {
  const routes = Array.isArray(path) ? path : atPath(path);
  const current = getAtPath(obj, routes.slice(0, -1));
  const route = routes[routes.length - 1];
  current[route.startsWith('[') ? route.slice(1, -1) : route] = value;
  return obj;
}

module.exports = { setAtPathMut: curry3(setAtPathMut) };
