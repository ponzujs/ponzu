const { ensureAuthenticated } = require('./ensure-authenticated');

function ensureRoles(roles) {
  return function (req, res, next) {
    return ensureAuthenticated(req, res, next, roles);
  };
}

module.exports = { ensureRoles };
