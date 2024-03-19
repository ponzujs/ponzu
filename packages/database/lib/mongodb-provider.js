const { MongoClient, ObjectId } = require('mongodb');
const { ioc } = require('@ponzujs/core');
const { BaseProvider } = require('./base-provider');

const idField = '_id';
const logger = ioc.get('logger');

function processIds(condition) {
  if (typeof condition === 'string') {
    return ObjectId.isValid(condition)
      ? ObjectId.createFromHexString(condition)
      : condition;
  }
  if (Array.isArray(condition)) {
    return condition.map((item) => processIds(item));
  }
  if (condition.id) {
    const clone = { ...condition };
    clone[idField] = processIds(clone.id);
    delete clone.id;
    return clone;
  }
  return condition;
}

class MongodbProvider extends BaseProvider {
  constructor(settings = {}) {
    super(settings);
    this.createClient();
  }

  createClient() {
    if (!this.settings.url) {
      this.settings.url = process.env.MONGO_URL;
    }
    const { url } = this.settings;
    if (url) {
      if (!this.settings.dbName) {
        this.settings.dbName = url.slice(url.lastIndexOf('/') + 1);
        if (this.settings.dbName.endsWith('?')) {
          this.settings.dbName = this.settings.dbName.slice(0, -1);
        }
      }
      this.client = new MongoClient(url);
    }
  }

  get isStarted() {
    return this.client !== undefined && this.db !== undefined;
  }

  async start() {
    await this.client?.connect();
    this.db = this.client?.db(this.settings.dbName);
  }

  async stop() {
    if (this.isStarted) {
      await this.client?.close();
    }
    this.db = undefined;
  }

  convertOut(srcInput) {
    if (!srcInput) {
      return undefined;
    }
    if (Array.isArray(srcInput)) {
      return srcInput.map((item) => this.convertOut(item));
    }
    if (srcInput[idField]) {
      const input = { ...srcInput };
      input.id = input[idField].toString();
      delete input[idField];
      return input;
    }
    return srcInput;
  }

  static asDBKey(key) {
    return typeof key === 'string' ? ObjectId.createFromHexString(key) : key;
  }

  convertIn(srcInput) {
    if (Array.isArray(srcInput)) {
      return srcInput.map((item) => this.convertIn(item));
    }
    if (srcInput.id) {
      const input = { ...srcInput };
      input[idField] = MongodbProvider.asDBKey(input.id);
      delete input.id;
      return input;
    }
    return srcInput;
  }

  getMongoCollection(name) {
    if (!this.isStarted) {
      throw new Error('Database is not started');
    }
    return this.db?.collection(name);
  }

  async find(
    name,
    srcCondition,
    limit,
    offset,
    sort = undefined,
    projection = undefined,
    collation = undefined,
    returnCursor = false
  ) {
    const condition = { ...srcCondition };
    if (condition.id) {
      condition[idField] = MongodbProvider.asDBKey(condition.id);
      delete condition.id;
    }
    const collection = this.getMongoCollection(name);
    const options =
      limit && typeof limit === 'object'
        ? limit
        : {
            ...(limit && { limit }),
            ...(offset && { skip: offset }),
            ...(sort && { sort }),
            ...(projection && { projection }),
          };
    options.allowDiskUse = true;
    try {
      let cursor = await collection.find(processIds(condition || {}), options);
      if (collation) {
        cursor = cursor.collation(collation);
      }
      if (returnCursor === true) {
        return cursor.map((item) => this.convertOut(item));
      }
      return this.convertOut(await cursor.toArray());
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  async findOne(name, condition = {}, projection = undefined) {
    if (typeof condition === 'string') {
      return this.findById(name, condition, projection);
    }
    const collection = this.getMongoCollection(name);
    const options = {
      ...(projection && { projection }),
    };
    const newcondition = processIds(condition || {});
    const item = await collection.findOne(newcondition, options);
    return this.convertOut(item);
  }

  async exists(name, condition) {
    if (typeof condition === 'string') {
      return this.existsById(name, condition);
    }
    const item = await this.findOne(name, condition);
    return !!item;
  }

  async findById(name, id, projection = undefined) {
    try {
      if (!ObjectId.isValid(id)) {
        return Promise.resolve(undefined);
      }
      const result = await this.findOne(
        name,
        { [idField]: MongodbProvider.asDBKey(id) },
        projection
      );
      return this.convertOut(result);
    } catch (err) {
      return Promise.resolve(undefined);
    }
  }

  async existsById(name, id) {
    const item = await this.findById(name, id);
    return !!item;
  }

  async insertOne(name, srcItem) {
    const item = this.convertIn(srcItem);
    const collection = this.getMongoCollection(name);
    await collection.insertOne(item);
    return this.convertOut(item);
  }

  async insertMany(name, srcItems) {
    const items = this.convertIn(srcItems);
    const collection = this.getMongoCollection(name);
    await collection.insertMany(items);
    return this.convertOut(items);
  }

  async update(name, srcItem) {
    const item = this.convertIn(srcItem);
    const query = { [idField]: MongodbProvider.asDBKey(item[idField]) };
    delete item[idField];
    delete item.id;
    const newValues = { $set: item };
    const collection = this.getMongoCollection(name);
    await collection.updateOne(query, newValues);
    const result = await collection.findOne(query);
    return this.convertOut(result);
  }

  async updateMany(name, filter, updateFilter, options, isPipeline = false) {
    let argument;
    if (isPipeline) {
      argument = Array.isArray(updateFilter)
        ? updateFilter
        : [{ $set: updateFilter }];
    } else {
      argument = { $set: updateFilter };
    }
    const collection = this.getMongoCollection(name);
    const result = await collection.updateMany(filter, argument, options);
    return result.modifiedCount;
  }

  async replace(name, srcItem) {
    const item = this.convertIn(srcItem);
    const query = { [idField]: MongodbProvider.asDBKey(item[idField]) };
    delete item[idField];
    delete item.id;
    const newValues = { ...item };
    const collection = this.getMongoCollection(name);
    await collection.replaceOne(query, newValues);
    const result = await collection.findOne(query);
    return this.convertOut(result);
  }

  async save(name, srcItem) {
    const item = this.convertIn(srcItem);
    if (!item[idField]) {
      return this.insertOne(name, srcItem);
    }
    const alreadyExists = await this.exists(name, item[idField].toString());
    return alreadyExists
      ? this.update(name, srcItem)
      : this.insertOne(name, item);
  }

  async remove(name, condition, justOne = false) {
    if (typeof condition === 'string') {
      return this.removeById(name, condition);
    }
    const collection = this.getMongoCollection(name);
    const count = await (justOne
      ? collection.deleteOne(condition)
      : collection.deleteMany(condition));
    return count.acknowledged ? count.deletedCount : 0;
  }

  removeById(name, id) {
    try {
      return this.remove(
        name,
        { [idField]: MongodbProvider.asDBKey(id) },
        true
      );
    } catch (err) {
      return Promise.resolve(0);
    }
  }

  addIndex(name, fields, options = undefined) {
    const collection = this.getMongoCollection(name);
    return collection.createIndex(fields, options);
  }

  dropIndex(name, indexName, options = {}) {
    const collection = this.getMongoCollection(name);
    return collection.dropIndex(indexName, options);
  }

  count(name, condition = {}, options = {}) {
    const query = this.convertIn(condition);
    const collection = this.getMongoCollection(name);
    return collection.countDocuments(query, options);
  }

  async drop(name) {
    const collections = await this.db.listCollections().toArray();
    if (collections.find((collection) => collection.name === name)) {
      const collection = this.getMongoCollection(name);
      return collection.drop();
    }
    return Promise.resolve();
  }

  async insertByBatches(name, items, batchSize = 100) {
    let index = 0;
    const result = [];
    while (index < items.length) {
      const batch = items.slice(index, index + batchSize);
      index += batchSize;
      // eslint-disable-next-line no-await-in-loop
      const currentResults = await this.insertMany(name, batch);
      result.push(...currentResults);
    }
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  updateByBatches(name, items, batchSize = 100) {
    logger.log(name, items, batchSize);
    throw new Error('not implemented');
  }

  // eslint-disable-next-line class-methods-use-this
  removeByIdByBatches(name, ids, batchSize = 100) {
    logger.log(name, ids, batchSize);
    throw new Error('not implemented');
  }

  async aggregate(name, agg) {
    const collection = this.getMongoCollection(name);
    return collection.aggregate(agg).toArray();
  }

  async findOneAndReplace(name, query, srcItem, options) {
    const item = this.convertIn(srcItem);
    delete item.id;
    const collection = this.getMongoCollection(name);
    // eslint-disable-next-line no-param-reassign
    options.returnDocument = options?.returnDocument || 'after';
    const result = await collection.findOneAndReplace(query, item, options);
    return this.convertOut(result.value);
  }

  async findOneAndUpdate(name, query, operations, options) {
    const collection = this.getMongoCollection(name);
    // eslint-disable-next-line no-param-reassign
    options.returnDocument = options?.returnDocument || 'after';
    const result = await collection.findOneAndUpdate(
      query,
      operations,
      options
    );
    return this.convertOut(result.value);
  }

  async findOneAndDelete(name, query, options) {
    const collection = this.getMongoCollection(name);
    return collection.findOneAndDelete(query, options);
  }

  async rename(name, newName) {
    const collections = await this.db.listCollections().toArray();
    if (collections.find((collection) => collection.name === name)) {
      const collection = this.getMongoCollection(name);
      return collection.rename(newName);
    }
    return Promise.resolve();
  }
}

module.exports = {
  MongodbProvider,
};
