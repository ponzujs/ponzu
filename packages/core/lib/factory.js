const { ShelveManager } = require('./shelve-manager');

const CLASSES_SHELVE = 'classes';
const INITIALIZERS_SHELVE = 'initializers';
const SINGLETONS_SHELVE = 'singletons';
const CLONERS_SHELVE = 'cloners';
const SERIALIZERS_SHELVE = 'serializers';
const DESERIALIZERS_SHELVE = 'deserializers';

class Factory {
  shelves = new ShelveManager();

  static getName(obj) {
    if (typeof obj === 'string') {
      return obj;
    }
    return obj.constructor?.name !== 'Function'
      ? obj.constructor.name
      : obj.name;
  }

  getFromShelve(shelveName, name) {
    return this.shelves.getFromShelve(shelveName, Factory.getName(name));
  }

  setIntoShelve(shelveName, name, value) {
    this.shelves.setIntoShelve(shelveName, Factory.getName(name), value);
  }

  register(name, clazz) {
    const shelve = this.shelves.getShelve(CLASSES_SHELVE);
    if (typeof name === 'string') {
      shelve.set(name, clazz);
    } else {
      shelve.set(name.name, name);
    }
  }

  getClass(name) {
    return this.getFromShelve(CLASSES_SHELVE, name);
  }

  registerInitializer(name, initializer) {
    this.setIntoShelve(INITIALIZERS_SHELVE, name, initializer);
  }

  getInitializer(obj) {
    return (
      this.getFromShelve(INITIALIZERS_SHELVE, obj) ||
      ((Clazz, settings) => new Clazz(settings))
    );
  }

  registerCloner(name, cloner) {
    this.setIntoShelve(CLONERS_SHELVE, name, cloner);
  }

  getCloner(obj) {
    return this.getFromShelve(CLONERS_SHELVE, obj);
  }

  registerSerializer(name, serializer) {
    this.setIntoShelve(SERIALIZERS_SHELVE, name, serializer);
  }

  getSerializer(obj) {
    return this.getFromShelve(SERIALIZERS_SHELVE, obj);
  }

  registerDeserializer(name, deserializer) {
    this.setIntoShelve(DESERIALIZERS_SHELVE, name, deserializer);
  }

  getDeserializer(obj) {
    return this.getFromShelve(DESERIALIZERS_SHELVE, obj);
  }

  registerSingleton(name, singleton) {
    this.setIntoShelve(SINGLETONS_SHELVE, name, singleton);
  }

  getSingleton(name) {
    return this.getFromShelve(SINGLETONS_SHELVE, name);
  }

  getInstance(obj, settings) {
    const name = Factory.getName(obj);
    const clazz = this.getClass(name);
    if (!clazz) {
      return undefined;
    }
    const initializer = this.getInitializer(name);
    return initializer(clazz, settings);
  }
}

const factory = new Factory();

module.exports = {
  Factory,
  factory,
};
