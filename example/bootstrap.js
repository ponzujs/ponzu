const { factory, ioc } = require('@ponzujs/core');
const {
  MongodbProvider,
  DatabaseManager,
  CachedEnvelope,
  FsProvider,
  LoggedEnvelope,
} = require('@ponzujs/database');
const config = require('./config.json');

async function bootstrap() {
  factory.register(MongodbProvider);
  factory.register(CachedEnvelope);
  factory.register(FsProvider);
  factory.register(LoggedEnvelope);
  const databaseManager = await DatabaseManager.createFrom(config.databases);
  await databaseManager.start();
  ioc.register('databaseManager', databaseManager);
}

module.exports = { bootstrap };
