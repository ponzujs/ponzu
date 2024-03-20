const { ioc } = require('@ponzujs/core');
const { ErrorResponse } = require('../error-response');
const { HTTP_STATUS, MESSAGES } = require('../constants');

const passport = ioc.get('passport');
const roleChecker = ioc.get('roleChecker');

function ensureAuthenticated(req, res, next, roles) {
  passport.authenticate('jwt', { session: false }, (err, data, info) => {
    if (err) {
      return next(err);
    }
    if (info) {
      return next(new ErrorResponse(info.message, HTTP_STATUS.UNAUTHORIZED));
    }
    if (!data) {
      return next(new ErrorResponse(MESSAGES.NO_ACCESS, HTTP_STATUS.FORBIDDEN));
    }
    req.user = data.payload;
    req.tenantId = data.tenantId;
    if (roleChecker) {
      const result = roleChecker(req, roles);
      return result
        ? next()
        : next(new ErrorResponse(MESSAGES.NO_ACCESS, HTTP_STATUS.FORBIDDEN));
    }
    return next();
  })(req, res, next);
}

module.exports = {
  ensureAuthenticated,
};
