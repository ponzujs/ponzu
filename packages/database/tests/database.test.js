const { describe, it, before, after, beforeEach } = require('node:test');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { factory, ioc, expect } = require('@ponzujs/core');
const { MongodbProvider, Database } = require('../lib');

let mongod;
let config;

async function start() {
  console.log('start');
  mongod = await MongoMemoryServer.create();
  factory.register(MongodbProvider);
  const url = `${mongod.getUri()}main`;
  config = {
    default: {
      provider: 'Mongodb',
      url,
    },
  };
}

async function stop() {
  await mongod.stop();
}

async function clearDatabase() {
  const provider = new MongodbProvider(config.default);
  await provider.start();
  const engine = provider.client.db('main');
  const collections = await engine.listCollections().toArray();
  const promises = collections.map((collection) =>
    engine.collection(collection.name).drop()
  );
  await Promise.all(promises);
  await provider.stop();
}

describe('Database', () => {
  before(start);
  after(stop);
  beforeEach(clearDatabase);
  it('should create an instance', () => {
    const database = new Database();
    expect(database).toBeDefined();
  });
  it('should load from config', async () => {
    const database = new Database();
    await database.fromConfig(config);
    expect(database).toBeDefined();
    expect(database.providers.size).toBe(1);
  });
  it('should be able to add a provider', () => {
    const database = new Database();
    const provider = new MongodbProvider(config.default);
    database.addProvider(provider);
    expect(database).toBeDefined();
    expect(database.providers.size).toBe(1);
  });
  it('should be able to get a provider', () => {
    const database = new Database();
    const provider = new MongodbProvider(config.default);
    database.addProvider(provider);
    const result = database.getProvider('MongodbProvider');
    expect(result).toBeDefined();
  });
  it('should be able to get a provider from ioc', () => {
    const database = new Database();
    const provider = new MongodbProvider(config.default);
    ioc.register('MongodbProvider', provider);
    const result = database.getProvider('MongodbProvider');
    expect(result).toBeDefined();
  });
  it('should be able to get a provider from ioc by alias', () => {
    const database = new Database();
    const provider = new MongodbProvider(config.default);
    ioc.register('MongodbProvider', provider);
    database.addProvider('another', 'MongodbProvider');
    const result = database.getProvider('another');
    expect(result).toBeDefined();
  });
  it('should be able to add a collection provider', () => {
    const database = new Database();
    const url1 = `${mongod.getUri()}main1`;
    const url2 = `${mongod.getUri()}main1`;
    const provider1 = new MongodbProvider({
      provider: 'MongodbProvider',
      url: url1,
    });
    const provider2 = new MongodbProvider({
      provider: 'MongodbProvider',
      url: url2,
    });
    database.addProvider('provider1', provider1);
    database.addProvider('provider2', provider2);
    database.addCollectionProvider('books', 'provider1');
    database.addCollectionProvider('users', 'provider2');
    expect(database).toBeDefined();
    expect(database.collectionProviders.size).toBe(2);
    expect(database.collectionProviders.get('books')).toBe('provider1');
    expect(database.collectionProviders.get('users')).toBe('provider2');
  });
  it('should be able to get a collection provider', () => {
    const database = new Database();
    const url1 = `${mongod.getUri()}main1`;
    const url2 = `${mongod.getUri()}main1`;
    const provider1 = new MongodbProvider({
      provider: 'MongodbProvider',
      url: url1,
    });
    const provider2 = new MongodbProvider({
      provider: 'MongodbProvider',
      url: url2,
    });
    database.addProvider('provider1', provider1);
    database.addProvider('provider2', provider2);
    database.addCollectionProvider('books', 'provider1');
    database.addCollectionProvider('users', 'provider2');
    const result1 = database.getCollectionProvider('books');
    const result2 = database.getCollectionProvider('users');
    expect(result1).toBe(provider1);
    expect(result2).toBe(provider2);
  });
  it('should be able to get a collection', async () => {
    const database = new Database();
    await database.fromConfig(config);
    const collection = database.getCollection('books');
    expect(collection).toBeDefined();
  });
  it('should be able to start and stop', async () => {
    const database = new Database();
    database.fromConfig(config);
    expect(database.isStarted).toBe(false);
    await database.start();
    expect(database.isStarted).toBe(true);
    await database.stop();
    expect(database.isStarted).toBe(false);
  });
  it('should be able to insert one', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    const inserted = await database.insertOne('books', {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
    });
    const item = await database.findOne('books', { id: inserted.id });
    await database.stop();
    expect(inserted).toBeDefined();
    expect(inserted.id).toBeDefined();
    expect(inserted.title).toBe('The Hobbit');
    expect(inserted.author).toBe('J.R.R. Tolkien');
    expect(item).toBeDefined();
    expect(item).toEqual(inserted);
  });
  it('should be able to insert many', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    const inserted = await database.insertMany('books', [
      { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
      { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    ]);
    const items = await database.find('books', {});
    await database.stop();
    expect(inserted).toBeDefined();
    expect(inserted.length).toBe(2);
    expect(inserted[0].id).toBeDefined();
    expect(inserted[0].title).toBe('The Hobbit');
    expect(inserted[0].author).toBe('J.R.R. Tolkien');
    expect(inserted[1].id).toBeDefined();
    expect(inserted[1].title).toBe('The Lord of the Rings');
    expect(inserted[1].author).toBe('J.R.R. Tolkien');
    expect(items).toBeDefined();
    expect(items.length).toBe(2);
    expect(items).toEqual(inserted);
  });
  it('should find by id', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    const inserted = await database.insertMany('books', [
      { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
      { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    ]);
    const item0 = await database.findById('books', inserted[0].id);
    const item1 = await database.findById('books', inserted[1].id);
    await database.stop();
    expect(item0.title).toBe('The Hobbit');
    expect(item0.author).toBe('J.R.R. Tolkien');
    expect(item1.title).toBe('The Lord of the Rings');
    expect(item1.author).toBe('J.R.R. Tolkien');
  });
  it('should return undefined if not found', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    await database.insertMany('books', [
      { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
      { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    ]);
    const item = await database.findById('books', 'nope');
    await database.stop();
    expect(item).toBeUndefined();
  });
  it('should find existing by id', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    const inserted = await database.insertMany('books', [
      { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
      { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    ]);
    const exists0 = await database.exists('books', inserted[0].id);
    expect(exists0).toBe(true);
    const exists1 = await database.exists('books', inserted[1].id);
    expect(exists1).toBe(true);
    const exists2 = await database.exists('books', 'nope');
    expect(exists2).toBe(false);
    await database.stop();
  });
  it('should find existing by other fields', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    await database.insertMany('books', [
      { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
      { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    ]);
    expect(true).toBe(true);
    let exists = await database.exists('books', { title: 'The Hobbit' });
    expect(exists).toBe(true);
    exists = await database.exists('books', { author: 'J.R.R. Tolkien' });
    expect(exists).toBe(true);
    exists = await database.exists('books', { title: 'nope' });
    expect(exists).toBe(false);
    await database.stop();
  });
  it('should find existing by id', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    const inserted = await database.insertMany('books', [
      { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
      { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    ]);
    const exists0 = await database.existsById('books', inserted[0].id);
    expect(exists0).toBe(true);
    const exists1 = await database.existsById('books', inserted[1].id);
    expect(exists1).toBe(true);
    const exists2 = await database.existsById('books', 'nope');
    expect(exists2).toBe(false);
    await database.stop();
  });
  it('should update one item', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    const inserted = await database.insertOne('books', {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
    });
    await database.update('books', {
      id: inserted.id,
      title: 'The Lord of the Rings',
    });
    const item = await database.findOne('books', { id: inserted.id });
    await database.stop();
    expect(item).toBeDefined();
    expect(item.id).toBeDefined();
    expect(item.title).toBe('The Lord of the Rings');
    expect(item.author).toBe('J.R.R. Tolkien');
  });
  it('should update several items', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    await database.insertMany('books', [
      { title: 'title1', author: 'author1', year: 2000 },
      { title: 'title2', author: 'author1', year: 2000 },
      { title: 'title3', author: 'author2', year: 2000 },
      { title: 'title4', author: 'author2', year: 2000 },
    ]);
    await database.updateMany('books', { author: 'author1' }, { year: 2001 });
    const items = await database.find('books', {});
    await database.stop();
    expect(items).toHaveLength(4);
    expect(items[0].year).toBe(2001);
    expect(items[1].year).toBe(2001);
    expect(items[2].year).toBe(2000);
    expect(items[3].year).toBe(2000);
  });
  it('should update one item', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    const inserted = await database.insertOne('books', {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
    });
    await database.replace('books', {
      id: inserted.id,
      title: 'The Lord of the Rings',
    });
    const item = await database.findOne('books', { id: inserted.id });
    await database.stop();
    expect(item).toBeDefined();
    expect(item.id).toBeDefined();
    expect(item.title).toBe('The Lord of the Rings');
    expect(item.author).toBeUndefined();
  });
  it('should save one item', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    const inserted = await database.save('books', {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
    });
    await database.save('books', {
      id: inserted.id,
      title: 'The Lord of the Rings',
    });
    const item = await database.findOne('books', { id: inserted.id });
    await database.stop();
    expect(item).toBeDefined();
    expect(item.id).toBeDefined();
    expect(item.title).toBe('The Lord of the Rings');
    expect(item.author).toBe('J.R.R. Tolkien');
  });
  it('should remove one item', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    const inserted = await database.insertMany('books', [
      { title: 'title1', author: 'author1', year: 2000 },
      { title: 'title2', author: 'author1', year: 2000 },
      { title: 'title3', author: 'author2', year: 2000 },
      { title: 'title4', author: 'author2', year: 2000 },
    ]);
    await database.removeById('books', inserted[2].id);
    const items = await database.find('books', {});
    await database.stop();
    expect(items).toHaveLength(3);
    expect(items[0].id).toBe(inserted[0].id);
    expect(items[1].id).toBe(inserted[1].id);
    expect(items[2].id).toBe(inserted[3].id);
  });
  it('should not fail if the item does not exists', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    await database.insertMany('books', [
      { title: 'title1', author: 'author1', year: 2000 },
      { title: 'title2', author: 'author1', year: 2000 },
      { title: 'title3', author: 'author2', year: 2000 },
      { title: 'title4', author: 'author2', year: 2000 },
    ]);
    await database.removeById('books', 'nope');
    const items = await database.find('books', {});
    await database.stop();
    expect(items).toHaveLength(4);
  });
  it('should remove by id', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    const inserted = await database.insertMany('books', [
      { title: 'title1', author: 'author1', year: 2000 },
      { title: 'title2', author: 'author1', year: 2000 },
      { title: 'title3', author: 'author2', year: 2000 },
      { title: 'title4', author: 'author2', year: 2000 },
    ]);
    await database.remove('books', inserted[2].id);
    const items = await database.find('books', {});
    await database.stop();
    expect(items).toHaveLength(3);
    expect(items[0].id).toBe(inserted[0].id);
    expect(items[1].id).toBe(inserted[1].id);
    expect(items[2].id).toBe(inserted[3].id);
  });
  it('should remove by condition', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    const inserted = await database.insertMany('books', [
      { title: 'title1', author: 'author1', year: 2000 },
      { title: 'title2', author: 'author1', year: 2000 },
      { title: 'title3', author: 'author2', year: 2000 },
      { title: 'title4', author: 'author2', year: 2000 },
    ]);
    await database.remove('books', { author: 'author1' });
    const items = await database.find('books', {});
    await database.stop();
    expect(items).toHaveLength(2);
    expect(items[0].id).toBe(inserted[2].id);
    expect(items[1].id).toBe(inserted[3].id);
  });
  it('should add an index', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    await database.insertMany('books', [
      { title: 'title1', author: 'author1', year: 2000 },
      { title: 'title2', author: 'author1', year: 2000 },
      { title: 'title3', author: 'author2', year: 2000 },
      { title: 'title4', author: 'author2', year: 2000 },
    ]);
    const actual = await database.addIndex('books', { author: 1 });
    expect(actual).toEqual('author_1');
    await database.stop();
  });
  it('should count the elements', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    await database.insertMany('books', [
      { title: 'title1', author: 'author1', year: 2000 },
      { title: 'title2', author: 'author1', year: 2000 },
      { title: 'title3', author: 'author2', year: 2000 },
      { title: 'title4', author: 'author2', year: 2000 },
    ]);
    const actual = await database.count('books', {});
    expect(actual).toBe(4);
    await database.stop();
  });
  it('should count the elements by condition', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    await database.insertMany('books', [
      { title: 'title1', author: 'author1', year: 2000 },
      { title: 'title2', author: 'author1', year: 2000 },
      { title: 'title3', author: 'author2', year: 2000 },
      { title: 'title4', author: 'author2', year: 2000 },
    ]);
    const actual = await database.count('books', { author: 'author2' });
    expect(actual).toBe(2);
    await database.stop();
  });
  it('should drop a collection', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    await database.insertMany('books', [
      { title: 'title1', author: 'author1', year: 2000 },
      { title: 'title2', author: 'author1', year: 2000 },
      { title: 'title3', author: 'author2', year: 2000 },
      { title: 'title4', author: 'author2', year: 2000 },
    ]);
    await database.drop('books');
    const items = await database.find('books', {});
    await database.stop();
    expect(items).toHaveLength(0);
  });
  it('should rename a collection', async () => {
    const database = new Database();
    database.fromConfig(config);
    await database.start();
    await database.insertMany('books', [
      { title: 'title1', author: 'author1', year: 2000 },
      { title: 'title2', author: 'author1', year: 2000 },
      { title: 'title3', author: 'author2', year: 2000 },
      { title: 'title4', author: 'author2', year: 2000 },
    ]);
    await database.rename('books', 'libros');
    let items = await database.find('libros', {});
    expect(items).toHaveLength(4);
    items = await database.find('books', {});
    expect(items).toHaveLength(0);
    await database.stop();
  });
});
