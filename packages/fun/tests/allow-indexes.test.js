const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { allowIndexes, range } = require('../lib');

describe('allowIndexes', () => {
  it('Should filter undefined or null into empty array', () => {
    expect(allowIndexes(undefined, [0, 2])).toEqual([]);
    expect(allowIndexes(null, [0, 2])).toEqual([]);
  });
  it('Should filter an array', () => {
    const input = [1, 2, 3];
    const actual = allowIndexes(input, [0, 2]);
    expect(actual).toEqual([1, 3]);
  });
  it('Should filter an ArrayBuffer', () => {
    const input = new Uint32Array([1, 2, 3]);
    const actual = allowIndexes(input, [0, 2]);
    expect(actual).toEqual([1, 3]);
  });
  it('Should filter a String', () => {
    const input = 'Hello';
    expect(allowIndexes(input, [0, 2])).toEqual(['H', 'l']);
  });
  it('Should filter a non iterable object', () => {
    const input = { a: 1, b: 2, c: 3 };
    const actual = allowIndexes(input, ['a', 'c']);
    expect(actual).toEqual([1, 3]);
  });
  it('Should filter a basic type', () => {
    const input = 1;
    expect(allowIndexes(input, [0])).toEqual([1]);
    expect(allowIndexes(input, [1])).toEqual([]);
  });
  it('Should filter an Iterable', () => {
    const input = range(3, 10);
    const actual = allowIndexes(input, [0, 2]);
    expect(actual).toEqual([3, 5]);
  });
});
