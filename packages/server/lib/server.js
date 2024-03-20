const { ioc } = require('@ponzujs/core');
const { serve, startClusterServer } = require('./cluster-server');

function startServer(settings = {}) {
  if (
    settings.userPassport !== false &&
    settings.strategies &&
    settings.strategies.length > 0
  ) {
    const passport = ioc.get('passport');
    settings.strategies.forEach((strategy) => {
      passport.use(strategy);
    });
  }
  return settings.useCluster === false
    ? serve(settings)
    : startClusterServer(settings);
}

module.exports = {
  startServer,
};
