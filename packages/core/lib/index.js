const cache = require('./cache');
const cloneBuffer = require('./clone-buffer');
const cloneRegExp = require('./clone-regexp');
const clone = require('./clone');
const consoleLogger = require('./console-logger');
const deserialize = require('./deserialize');
const expect = require('./expect');
const factory = require('./factory');
const getMethods = require('./get-methods');
const ioc = require('./ioc');
const isFunction = require('./is-function');
const logger = require('./logger');
const serialize = require('./serialize');
const shelveManager = require('./shelve-manager');
const uuid = require('./uuid');

module.exports = {
  ...cache,
  ...cloneBuffer,
  ...cloneRegExp,
  ...clone,
  ...consoleLogger,
  ...deserialize,
  ...expect,
  ...factory,
  ...getMethods,
  ...ioc,
  ...isFunction,
  ...logger,
  ...serialize,
  ...shelveManager,
  ...uuid,
};
