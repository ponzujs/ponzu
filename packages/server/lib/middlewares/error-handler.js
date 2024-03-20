const { HTTP_STATUS } = require('../constants');

function errorHandler(err, req, res, next) {
  if (err && err.message) {
    return res
      .status(err.status || HTTP_STATUS.INTERNAL_ERROR)
      .send(err.message);
  }
  return next();
}

module.exports = { errorHandler };
