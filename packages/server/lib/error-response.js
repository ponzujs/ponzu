const { HTTP_STATUS } = require('./constants');

class ErrorResponse extends Error {
  constructor(message, status = HTTP_STATUS.INTERNAL_ERROR) {
    super(message);
    this.status = status;
  }
}

module.exports = { ErrorResponse };
