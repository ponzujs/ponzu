const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { AloneMemory } = require('../lib');

describe('AloneMemory', () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      const actual = new AloneMemory();
      expect(actual).toBeDefined();
    });
  });

  describe('get', () => {
    it('Shoud get a top level value by slot name', () => {
      const memory = new AloneMemory();
      memory.set({ slotName: 'something', slot: 7 });
      const actual = memory.get({ slotName: 'something' });
      expect(actual).toEqual(7);
    });
    it('Shoud return undefined if top level value do not exists', () => {
      const memory = new AloneMemory();
      const actual = memory.get({ slotName: 'something' });
      expect(actual).toBeUndefined();
    });
  });

  describe('set', () => {
    it('Should set some slots', () => {
      const memory = new AloneMemory();
      memory.set({ slotName: 'a', slot: 1 });
      memory.set({ slotName: 'b', slot: 2 });
      memory.set({ slotName: 'c', slot: 3 });
      expect(memory.get({ slotName: 'a' })).toEqual(1);
      expect(memory.get({ slotName: 'b' })).toEqual(2);
      expect(memory.get({ slotName: 'c' })).toEqual(3);
    });
    it('Should override an slot', () => {
      const memory = new AloneMemory();
      memory.set({ slotName: 'a', slot: 1 });
      memory.set({ slotName: 'a', slot: 2 });
      expect(memory.get({ slotName: 'a' })).toEqual(2);
    });
  });

  describe('remove', () => {
    it('Should remove an existing slot', () => {
      const memory = new AloneMemory();
      memory.set({ slotName: 'a', slot: 1 });
      memory.set({ slotName: 'b', slot: 2 });
      memory.set({ slotName: 'c', slot: 3 });
      memory.remove({ slotName: 'b' });
      expect(memory.get({ slotName: 'a' })).toEqual(1);
      expect(memory.get({ slotName: 'b' })).toBeUndefined();
      expect(memory.get({ slotName: 'c' })).toEqual(3);
    });
    it('Should not crash when removing a non existing slot', () => {
      const memory = new AloneMemory();
      memory.remove({ slotName: 'b' });
      expect(memory.get({ slotName: 'b' })).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('Should remove all slots', () => {
      const memory = new AloneMemory();
      memory.set({ slotName: 'a', slot: 1 });
      memory.set({ slotName: 'b', slot: 2 });
      memory.set({ slotName: 'c', slot: 3 });
      memory.clear();
      expect(memory.get({ slotName: 'a' })).toBeUndefined();
      expect(memory.get({ slotName: 'b' })).toBeUndefined();
      expect(memory.get({ slotName: 'c' })).toBeUndefined();
    });
  });

  describe('setChild', () => {
    it('Should set a child of a dictionary slot', () => {
      const memory = new AloneMemory();
      memory.setChild({ slotName: 'a', childName: 'a1', value: 1 });
      expect(memory.get({ slotName: 'a' })).toEqual({ a1: 1 });
    });
    it('Should set a child of a dictionary slot that already contains data', () => {
      const memory = new AloneMemory();
      memory.setChild({ slotName: 'a', childName: 'a1', value: 1 });
      memory.setChild({ slotName: 'a', childName: 'a2', value: 2 });
      expect(memory.get({ slotName: 'a' })).toEqual({ a1: 1, a2: 2 });
    });
  });

  describe('getChild', () => {
    it('Should get a child of a dictionary slot', () => {
      const memory = new AloneMemory();
      memory.setChild({ slotName: 'a', childName: 'a1', value: 1 });
      const actual = memory.getChild({ slotName: 'a', childName: 'a1' });
      expect(actual).toEqual(1);
    });
  });

  describe('removeChild', () => {
    it('Should remove a child from a dictionary slot', () => {
      const memory = new AloneMemory();
      memory.setChild({ slotName: 'a', childName: 'a1', value: 1 });
      memory.removeChild({ slotName: 'a', childName: 'a1' });
      const actual = memory.getChild({ slotName: 'a', childName: 'a1' });
      expect(actual).toBeUndefined();
    });
  });

  describe('clearChilds', () => {
    it('Should remove all childs from a dictionary slot', () => {
      const memory = new AloneMemory();
      memory.setChild({ slotName: 'a', childName: 'a1', value: 1 });
      memory.setChild({ slotName: 'a', childName: 'a2', value: 2 });
      memory.clearChilds({ slotName: 'a' });
      const actual = memory.get({ slotName: 'a' });
      expect(actual).toEqual({});
    });
  });

  describe('addData', () => {
    it('Should add a new data slot', () => {
      const memory = new AloneMemory();
      memory.addData({ collectionName: 'a' });
      const actual = memory.getChild({ slotName: 'data', childName: 'a' });
      expect(actual.constructor.name).toEqual('Cache');
    });
  });

  describe('removeData', () => {
    it('Should remove an existing data slot', () => {
      const memory = new AloneMemory();
      memory.addData({ collectionName: 'a' });
      memory.removeData({ collectionName: 'a' });
      const actual = memory.getChild({ slotName: 'data', childName: 'a' });
      expect(actual).toBeUndefined();
    });
  });
});
