const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { getAt, range } = require('../lib');

describe('getAt', () => {
  it('Should return element at position of an array', () => {
    const input = [0, 2, 4, 6, 8];
    expect(getAt(input, 0)).toEqual(0);
    expect(getAt(input, 1)).toEqual(2);
    expect(getAt(input, 2)).toEqual(4);
    expect(getAt(input, 3)).toEqual(6);
    expect(getAt(input, 4)).toEqual(8);
  });
  it('Should return element at negative position of an array', () => {
    const input = [0, 2, 4, 6, 8];
    expect(getAt(input, -1)).toEqual(8);
    expect(getAt(input, -2)).toEqual(6);
    expect(getAt(input, -3)).toEqual(4);
    expect(getAt(input, -4)).toEqual(2);
    expect(getAt(input, -5)).toEqual(0);
  });
  it('Should return undefined in out of scope positions of an array', () => {
    const input = [0, 2, 4, 6, 8];
    expect(getAt(input, 5)).toBeUndefined();
    expect(getAt(input, -6)).toBeUndefined();
  });
  it('Should throw an exception if input is undefined or null', () => {
    expect(() => getAt(undefined, 0)).toThrow(
      'Cannot perform getAt on undefined'
    );
    expect(() => getAt(null, 0)).toThrow('Cannot perform getAt on null');
  });
  it('Should throw an exception if input is non iterable base type', () => {
    expect(() => getAt(5, 0)).toThrow('Cannot perform getAt on input');
  });
  it('Should return element at position of a string', () => {
    const input = 'abcde';
    expect(getAt(input, 0)).toEqual('a');
    expect(getAt(input, 1)).toEqual('b');
    expect(getAt(input, 2)).toEqual('c');
    expect(getAt(input, 3)).toEqual('d');
    expect(getAt(input, 4)).toEqual('e');
  });
  it('Should return element at negative position of a string', () => {
    const input = 'abcde';
    expect(getAt(input, -1)).toEqual('e');
    expect(getAt(input, -2)).toEqual('d');
    expect(getAt(input, -3)).toEqual('c');
    expect(getAt(input, -4)).toEqual('b');
    expect(getAt(input, -5)).toEqual('a');
  });
  it('Should return undefined in out of scope positions of a string', () => {
    const input = 'abcde';
    expect(getAt(input, 5)).toBeUndefined();
    expect(getAt(input, -6)).toBeUndefined();
  });
  it('Should return a field from an object', () => {
    const input = { name: 'John', age: 30 };
    expect(getAt(input, 'name')).toEqual('John');
    expect(getAt(input, 'birthday')).toBeUndefined();
  });
  it('Should return element at position of an iterable', () => {
    const input = range(0, 10, 2);
    expect(getAt(input, 0)).toEqual(0);
    expect(getAt(input, 1)).toEqual(2);
    expect(getAt(input, 2)).toEqual(4);
    expect(getAt(input, 3)).toEqual(6);
    expect(getAt(input, 4)).toEqual(8);
  });
  it('Should return element at negative position of an iterable', () => {
    const input = range(0, 10, 2);
    expect(getAt(input, -1)).toEqual(8);
    expect(getAt(input, -2)).toEqual(6);
    expect(getAt(input, -3)).toEqual(4);
    expect(getAt(input, -4)).toEqual(2);
    expect(getAt(input, -5)).toEqual(0);
  });
  it('Should return undefined in out of scope positions of an iterable', () => {
    const input = range(0, 10, 2);
    expect(getAt(input, 5)).toBeUndefined();
    expect(getAt(input, -6)).toBeUndefined();
  });
});
