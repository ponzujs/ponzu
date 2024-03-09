const pino = require('pino');

const loggers = new Map();

let defaultOptions = {
  level: process.env.LOG_LEVEL || 'info',
};

if (process.env.NODE_ENV === 'development') {
  defaultOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: true,
    },
  };
}

function setDefaultLoggerOptions(options) {
  defaultOptions = options;
}

function createLogger(name, options = defaultOptions) {
  const logger = pino(options);
  logger.log = logger.info;
  loggers.set(name, logger);
  return logger;
}

function getLogger(name = 'DEFAULT') {
  if (!loggers.has(name)) {
    return createLogger(name);
  }
  return loggers.get(name);
}

const logger = getLogger();

module.exports = {
  setDefaultLoggerOptions,
  createLogger,
  getLogger,
  logger,
};
