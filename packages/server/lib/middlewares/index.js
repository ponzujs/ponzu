const ensureAuthenticated = require('./ensure-authenticated');
const ensureRoles = require('./ensure-roles');
const errorHandler = require('./error-handler');
const notFoundHandler = require('./not-found-handler');
const roleChecker = require('./role-checker');

module.exports = {
  ...ensureAuthenticated,
  ...ensureRoles,
  ...errorHandler,
  ...notFoundHandler,
  ...roleChecker,
};
