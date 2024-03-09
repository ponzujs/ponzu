const { describe, it } = require('node:test');
const { expect, ShelveManager } = require('../lib');

describe('ShelveManager', () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      const shelveManager = new ShelveManager();
      expect(shelveManager).toBeDefined();
    });
  });

  describe('getShelve', () => {
    it('Should create a new shelve if it does not exist', () => {
      const shelveManager = new ShelveManager();
      const shelve = shelveManager.getShelve('test');
      expect(shelve).toBeDefined();
    });
    it('Should return the same shelve if it exists', () => {
      const shelveManager = new ShelveManager();
      const shelve = shelveManager.getShelve('test');
      const shelve2 = shelveManager.getShelve('test');
      expect(shelve).toBe(shelve2);
    });
  });

  describe('getFromShelve', () => {
    it('Should return undefined if shelve does not exist', () => {
      const shelveManager = new ShelveManager();
      const value = shelveManager.getFromShelve('test', 'test');
      expect(value).toBeUndefined();
    });
    it('Should return undefined if value does not exist', () => {
      const shelveManager = new ShelveManager();
      shelveManager.getShelve('test');
      const value = shelveManager.getFromShelve('test', 'test');
      expect(value).toBeUndefined();
    });
    it('Should return value if it exists', () => {
      const shelveManager = new ShelveManager();
      const shelve = shelveManager.getShelve('test');
      shelve.set('test', 'test');
      const value = shelveManager.getFromShelve('test', 'test');
      expect(value).toEqual('test');
    });
  });

  describe('setIntoShelve', () => {
    it('Should create a new shelve if it does not exist', () => {
      const shelveManager = new ShelveManager();
      shelveManager.setIntoShelve('test', 'test', 'test');
      const shelve = shelveManager.getShelve('test');
      expect(shelve).toBeDefined();
    });
    it('Should set value into shelve', () => {
      const shelveManager = new ShelveManager();
      shelveManager.setIntoShelve('test', 'test', 'test');
      const shelve = shelveManager.getShelve('test');
      expect(shelve.get('test')).toEqual('test');
    });
  });
});
