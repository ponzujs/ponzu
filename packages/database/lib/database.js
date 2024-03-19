const { ioc, factory } = require('@ponzujs/core');

class Database {
  constructor(settings = {}) {
    this.defaultProviderName = settings.defaultProviderName;
    this.providers = new Map();
    this.collectionProviders = new Map();
    this.started = false;
  }

  get isStarted() {
    return this.started;
  }

  async start() {
    if (!this.started) {
      const keys = Array.from(this.providers.keys());
      for (let i = 0; i < keys.length; i += 1) {
        const provider = this.getProvider(keys[i]);
        if (provider && !provider.isStarted) {
          // eslint-disable-next-line no-await-in-loop
          await provider.start();
        }
      }
      this.started = true;
    }
  }

  async stop() {
    if (this.started) {
      const keys = Array.from(this.providers.keys());
      for (let i = 0; i < keys.length; i += 1) {
        const provider = this.getProvider(keys[i]);
        if (provider && provider.isStarted) {
          // eslint-disable-next-line no-await-in-loop
          await provider.stop();
        }
      }
      this.started = false;
    }
  }

  addProvider(providerName, provider) {
    if (typeof providerName !== 'string') {
      return this.addProvider(providerName.constructor.name, providerName);
    }
    this.providers.set(providerName, provider);
    if (!this.defaultProviderName) {
      this.defaultProviderName = providerName;
    }
    return provider;
  }

  getProvider(providerName) {
    const provider = this.providers.get(
      providerName || this.defaultProviderName
    );
    if (!provider) {
      return ioc.get(providerName);
    }
    return typeof provider === 'string' ? ioc.get(provider) : provider;
  }

  getCollectionProvider(collectionName) {
    const providerName =
      this.collectionProviders.get(collectionName) || this.defaultProviderName;
    return providerName ? this.getProvider(providerName) : undefined;
  }

  addCollectionProvider(collectionName, providerName) {
    this.collectionProviders.set(collectionName, providerName);
  }

  getCollection(collectionName) {
    const provider = this.getCollectionProvider(collectionName);
    if (!provider) {
      throw new Error(
        `Database provider not found for collection ${collectionName}`
      );
    }
    return provider.getCollection(collectionName);
  }

  setCollection(collectionName, collection) {
    const provider = this.getCollectionProvider(collectionName);
    if (!provider) {
      throw new Error(
        `Database provider not found for collection ${collectionName}`
      );
    }
    return provider.setCollection(collectionName, collection);
  }

  aggregate(name, agg) {
    return this.getCollection(name).aggregate(agg);
  }

  find(
    name,
    condition,
    limit,
    offset,
    sort,
    projection,
    collation,
    returnCursor
  ) {
    return this.getCollection(name).find(
      condition,
      limit,
      offset,
      sort,
      projection,
      collation,
      returnCursor
    );
  }

  findOne(name, condition, projection) {
    return this.getCollection(name).findOne(condition, projection);
  }

  exists(name, condition) {
    return this.getCollection(name).exists(condition);
  }

  findById(name, id, projection) {
    return this.getCollection(name).findById(id, projection);
  }

  existsById(name, id) {
    return this.getCollection(name).existsById(id);
  }

  insertOne(name, item) {
    return this.getCollection(name).insertOne(item);
  }

  insertMany(name, items) {
    return this.getCollection(name).insertMany(items);
  }

  update(name, item) {
    return this.getCollection(name).update(item);
  }

  updateMany(name, filter, updateFilter, options) {
    return this.getCollection(name).updateMany(filter, updateFilter, options);
  }

  replace(name, item) {
    return this.getCollection(name).replace(item);
  }

  save(name, item) {
    return this.getCollection(name).save(item);
  }

  remove(name, condition, justOne = false) {
    return this.getCollection(name).remove(condition, justOne);
  }

  removeById(name, id) {
    return this.getCollection(name).removeById(id);
  }

  addIndex(name, index, options = undefined) {
    return this.getCollection(name).addIndex(index, options);
  }

  count(name, condition = {}, options = {}) {
    return this.getCollection(name).count(condition, options);
  }

  drop(name) {
    return this.getCollection(name).drop();
  }

  dropIndex(name, indexName, options) {
    return this.getCollection(name).dropIndex(indexName, options);
  }

  insertByBatches(name, items, batchSize = 100) {
    return this.getCollection(name).insertByBatches(items, batchSize);
  }

  updateByBatches(name, items, batchSize = 100) {
    return this.getCollection(name).updateByBatches(items, batchSize);
  }

  removeByIdByBatches(name, ids, batchSize = 100) {
    return this.getCollection(name).removeByIdByBatches(ids, batchSize);
  }

  findOneAndReplace(name, query, item, options) {
    return this.getCollection(name).findOneAndReplace(query, item, options);
  }

  findOneAndUpdate(name, query, operations, options) {
    return this.getCollection(name).findOneAndUpdate(
      query,
      operations,
      options
    );
  }

  findOneAndDelete(name, query, options) {
    return this.getCollection(name).findOneAndDelete(query, options);
  }

  rename(name, newName) {
    return this.getCollection(name).rename(newName);
  }

  async addCollectionFromConfig(providerName, collectionName, config = {}) {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Database provider ${providerName} not found`);
    }
    this.addCollectionProvider(collectionName, providerName);
    const collection = provider.getCollection(collectionName);
    if (config.envelopes) {
      for (let i = 0; i < config.envelopes.length; i += 1) {
        const current = config.envelopes[i];
        const type = typeof current === 'string' ? current : current.type;
        const typeName = `${type[0].toUpperCase()}${type.slice(1)}`;
        const envelope =
          factory.getInstance(typeName, current) ||
          factory.getInstance(
            `${typeName}Envelope`,
            typeof current === 'string' ? {} : current
          );
        if (!envelope) {
          throw new Error(`Envelope type "${current.type}" not found`);
        }
        collection.addEnvelope(envelope);
      }
    }
  }

  async addProviderFromConfig(providerName, config) {
    const provider =
      factory.getInstance(config.provider, config) ||
      factory.getInstance(`${config.provider}Provider`, config);
    if (!provider) {
      throw new Error(`Database provider ${config.provider} not found`);
    }
    this.addProvider(providerName, provider);
    if (config.collections) {
      const keys = Object.keys(config.collections);
      for (let i = 0; i < keys.length; i += 1) {
        const currentConfig = config.collections[keys[i]];
        currentConfig.envelopes = [
          ...(config.envelopes || []),
          ...(currentConfig.envelopes || []),
        ];
        // eslint-disable-next-line no-await-in-loop
        await this.addCollectionFromConfig(
          providerName,
          keys[i],
          currentConfig
        );
      }
    }
  }

  async fromConfig(config) {
    const keys = Object.keys(config);
    for (let i = 0; i < keys.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.addProviderFromConfig(keys[i], config[keys[i]]);
    }
  }
}

module.exports = { Database };
