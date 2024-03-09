const cache = require('./cache');
const cloneBuffer = require('./clone-buffer');
const cloneRegExp = require('./clone-regexp');
const clone = require('./clone');
const consoleLogger = require('./console-logger');
const deserialize = require('./deserialize');
const expect = require('./expect');
const factory = require('./factory');
const ioc = require('./ioc');
const isFunction = require('./is-function');
const logger = require('./logger');
const serialize = require('./serialize');
const shelveManager = require('./shelve-manager');

module.exports = {
  ...cache,
  ...cloneBuffer,
  ...cloneRegExp,
  ...clone,
  ...consoleLogger,
  ...deserialize,
  ...expect,
  ...factory,
  ...ioc,
  ...isFunction,
  ...logger,
  ...serialize,
  ...shelveManager,
};
