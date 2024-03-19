const { Cache } = require('@ponzujs/core');

class CachedEnvelope {
  constructor(settings = {}) {
    this.cache = new Cache(settings);
  }

  getFromCache(condition) {
    const keys = Object.keys(condition);
    if (keys.length !== 1) {
      return undefined;
    }
    const key = keys[0];
    return this.cache.getByIndex(key, condition[key]);
  }

  putIntoCache(item) {
    this.cache.put(item);
  }

  removeFromCache(id) {
    this.cache.remove(id);
  }

  clearCache() {
    this.cache.clear();
  }

  async getFromCacheFromOptions(query, options) {
    if (!options.projection) {
      // eslint-disable-next-line no-param-reassign
      options.result = await this.getFromCache(query);
      if (options.result !== undefined) {
        // eslint-disable-next-line no-param-reassign
        options.fromCache = true;
      }
    }
    return options;
  }

  async putIntoCacheFromOptions(options) {
    if (
      !options.fromCache &&
      options.result !== undefined &&
      !options.projection
    ) {
      await this.putIntoCache(options.result);
    }
  }

  beforeFindOne(eventName, collection, options) {
    return this.getFromCacheFromOptions(options.condition, options);
  }

  async afterFindOne(eventName, collection, options) {
    await this.putIntoCacheFromOptions(options);
  }

  async beforeExists(eventName, collection, options) {
    // eslint-disable-next-line no-param-reassign
    options.result = await this.getFromCache(options.condition);
    return options;
  }

  beforeFindById(eventName, collection, options) {
    return this.getFromCacheFromOptions({ id: options.id }, options);
  }

  async afterFindById(eventName, collection, options) {
    await this.putIntoCacheFromOptions(options);
  }

  async beforeExistsById(eventName, collection, options) {
    const item = await this.getFromCache({ id: options.id });
    if (item) {
      // eslint-disable-next-line no-param-reassign
      options.result = true;
      // eslint-disable-next-line no-param-reassign
      options.fromCache = true;
    }
    return options;
  }

  async afterInsertOne(eventName, collection, options) {
    await this.putIntoCache(options.result);
    return options;
  }

  async afterInsertMany(eventName, collection, options) {
    for (let i = 0; i < options.result.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.putIntoCache(options.result[i]);
    }
    return options;
  }

  async afterUpdate(eventName, collection, options) {
    await this.putIntoCache(options.result);
    return options;
  }

  async afterUpdateMany(eventName, collection, options) {
    await this.clearCache();
    return options;
  }

  async afterReplace(eventName, collection, options) {
    await this.putIntoCache(options.result);
    return options;
  }

  async afterSave(eventName, collection, options) {
    await this.putIntoCache(options.result);
    return options;
  }

  async afterRemove(eventName, collection, options) {
    await this.clearCache();
    return options;
  }

  async afterRemoveById(eventName, collection, options) {
    await this.removeFromCache(options.id);
    return options;
  }

  async afterDrop(eventName, collection, options) {
    await this.clearCache();
    return options;
  }

  async afterRemoveByIdByBatches(eventName, collection, options) {
    for (let i = 0; i < options.ids.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.removeFromCache(options.ids[i]);
    }
    return options;
  }
}

module.exports = { CachedEnvelope };
