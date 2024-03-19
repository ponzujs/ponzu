const { getMethods } = require('@ponzujs/core');

class Collection {
  constructor(settings) {
    if (!settings) {
      throw new Error('settings are required');
    }
    if (!settings.db) {
      throw new Error('settings.db is required');
    }
    if (!settings.name) {
      throw new Error('settings.name is required');
    }
    this.db = settings.db;
    this.name = settings.name;
    this.hooks = new Map();
  }

  addHook(event, hook) {
    if (!this.hooks.has(event)) {
      this.hooks.set(event, []);
    }
    this.hooks.get(event).push(hook);
  }

  addEnvelope(envelope) {
    const keys = getMethods(envelope);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (key.startsWith('before')) {
        this.addHook(key, envelope[key].bind(envelope));
      } else if (key.startsWith('after')) {
        this.addHook(key, envelope[key].bind(envelope));
      }
    }
  }

  async callHook(hookName, eventName, data) {
    if (!this.hooks.has(hookName)) {
      return data;
    }
    let newData = data;
    const hooks = this.hooks.get(hookName) || [];
    for (let i = 0; i < hooks.length; i += 1) {
      const hook = hooks[i];
      // eslint-disable-next-line no-await-in-loop
      const changes = await hook(eventName, this, newData);
      newData = { ...newData, ...(changes || {}) };
    }
    return newData;
  }

  async callHooks(eventName, data) {
    let newData = data;
    if (this.hooks.has('beforeAll') && eventName.startsWith('before')) {
      newData = await this.callHook('beforeAll', eventName, newData);
    } else if (this.hooks.has('afterAll') && eventName.startsWith('after')) {
      newData = await this.callHook('afterAll', eventName, newData);
    }
    return this.callHook(eventName, eventName, newData);
  }

  async executeHooked(methodName, srcOptions) {
    let options = srcOptions;
    options = await this.callHooks(`before${methodName}`, options);
    if (options.result === undefined) {
      options.result = await this[`inner${methodName}`](options);
    }
    options = await this.callHooks(`after${methodName}`, options);
    return options.result;
  }

  innerFind({ condition, limit, offset, sort, projection }) {
    return this.db.find(this.name, condition, limit, offset, sort, projection);
  }

  innerFindOne({ condition, projection }) {
    return this.db.findOne(this.name, condition, projection);
  }

  innerExists({ condition }) {
    return this.db.exists(this.name, condition);
  }

  innerFindById({ id, projection }) {
    return this.db.findById(this.name, id, projection);
  }

  innerExistsById({ id }) {
    return this.db.existsById(this.name, id);
  }

  innerInsertOne({ item }) {
    return this.db.insertOne(this.name, item);
  }

  innerInsertMany({ items }) {
    return this.db.insertMany(this.name, items);
  }

  innerUpdate({ item }) {
    return this.db.update(this.name, item);
  }

  innerUpdateMany({ filter, updateFilter, options }) {
    return this.db.updateMany(this.name, filter, updateFilter, options);
  }

  innerReplace({ item }) {
    return this.db.replace(this.name, item);
  }

  innerSave({ item }) {
    return this.db.save(this.name, item);
  }

  innerRemove({ condition, justOne }) {
    return this.db.remove(this.name, condition, justOne);
  }

  innerRemoveById({ id }) {
    return this.db.removeById(this.name, id);
  }

  innerAddIndex({ index, options }) {
    return this.db.addIndex(this.name, index, options);
  }

  innerCount({ condition, options }) {
    return this.db.count(this.name, condition, options);
  }

  innerDrop() {
    return this.db.drop(this.name);
  }

  innerInsertByBatches({ items, batchSize }) {
    return this.db.insertByBatches(this.name, items, batchSize);
  }

  innerUpdateByBatches({ items, batchSize }) {
    return this.db.updateByBatches(this.name, items, batchSize);
  }

  innerRemoveByIdByBatches({ ids, batchSize }) {
    return this.db.removeByIdByBatches(this.name, ids, batchSize);
  }

  innerAggregate({ agg }) {
    return this.db.aggregate(this.name, agg);
  }

  innerFindOneAndReplace({ query, item, options }) {
    return this.db.findOneAndReplce(this.name, query, item, options);
  }

  innerFindOneAndUpdate({ query, operations, options }) {
    return this.db.findOneAndUpdate(this.name, query, operations, options);
  }

  innerFindOneAndDelete({ query, options }) {
    return this.db.findOneAndDelete(this.name, query, options);
  }

  innerRename({ newName }) {
    return this.db.rename(this.name, newName);
  }

  aggregate(agg) {
    return this.executeHooked('Aggregate', { agg });
  }

  find(condition, limit, offset, sort, projection, collation, returnCursor) {
    return this.executeHooked('Find', {
      condition,
      limit,
      offset,
      sort,
      projection,
      collation,
      returnCursor,
    });
  }

  findOne(condition, projection) {
    return this.executeHooked('FindOne', { condition, projection });
  }

  exists(condition) {
    return this.executeHooked('Exists', { condition });
  }

  findById(id, projection) {
    return this.executeHooked('FindById', { id, projection });
  }

  existsById(id) {
    return this.executeHooked('ExistsById', { id });
  }

  insertOne(item) {
    return this.executeHooked('InsertOne', { item });
  }

  insertMany(items) {
    return this.executeHooked('InsertMany', { items });
  }

  update(item) {
    return this.executeHooked('Update', { item });
  }

  updateMany(filter, updateFilter, options) {
    return this.executeHooked('UpdateMany', { filter, updateFilter, options });
  }

  replace(item) {
    return this.executeHooked('Replace', { item });
  }

  save(item) {
    return this.executeHooked('Save', { item });
  }

  remove(condition, justOne = false) {
    return this.executeHooked('Remove', { condition, justOne });
  }

  removeById(id) {
    return this.executeHooked('RemoveById', { id });
  }

  addIndex(index, options = undefined) {
    return this.executeHooked('AddIndex', { index, options });
  }

  dropIndex(indexName, options) {
    return this.executeHooked('DropIndex', { indexName, options });
  }

  count(condition = {}, options = {}) {
    return this.executeHooked('Count', { condition, options });
  }

  drop() {
    return this.executeHooked('Drop', {});
  }

  insertByBatches(items, batchSize = 100) {
    return this.executeHooked('InsertByBatches', { items, batchSize });
  }

  updateByBatches(items, batchSize = 100) {
    return this.executeHooked('UpdateByBatches', { items, batchSize });
  }

  removeByIdByBatches(ids, batchSize = 100) {
    return this.executeHooked('RemoveByIdByBatches', { ids, batchSize });
  }

  findOneAndReplace(query, item, options) {
    return this.executeHooked('FindOneAndReplace', { query, item, options });
  }

  findOneAndUpdate(query, operations, options) {
    return this.executeHooked('FindOneAndUpdate', {
      query,
      operations,
      options,
    });
  }

  findOneAndDelete(query, options) {
    return this.executeHooked('FindOneAndDelete', { query, options });
  }

  rename(newName) {
    return this.executeHooked('Rename', { newName });
  }
}

module.exports = { Collection };
