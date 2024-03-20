const { HTTP_STATUS, MESSAGES } = require('../constants');

function notFoundHandler(req, res) {
  res.status(HTTP_STATUS.NOT_FOUND).send(MESSAGES.NOT_FOUND);
}

module.exports = { notFoundHandler };
