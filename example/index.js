const { ioc } = require('@ponzujs/core');
const { bootstrap } = require('./bootstrap');
const config = require('./config.json');


(async () => {
  await bootstrap();
  const databaseManager = ioc.get('databaseManager');
  const collection = databaseManager.getMainCollection('jsons');
  const item = {
    name: 'test',
    age: 20
  }
  await collection.removeById('test.json');
  await collection.insertOne({ fileName: 'test.json', data: item });
  await databaseManager.stop();
})();
