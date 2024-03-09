const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { denyIndexes, range } = require('../lib');

describe('denyIndexes', () => {
  it('Should filter undefined or null into empty array', () => {
    expect(denyIndexes(undefined, [0, 2])).toEqual([]);
    expect(denyIndexes(null, [0, 2])).toEqual([]);
  });
  it('Should filter an array', () => {
    const input = [1, 2, 3];
    const actual = denyIndexes(input, [0, 2]);
    expect(actual).toEqual([2]);
  });
  it('Should filter an ArrayBuffer', () => {
    const input = new Uint32Array([1, 2, 3]);
    const actual = denyIndexes(input, [0, 2]);
    expect(actual).toEqual([2]);
  });
  it('Should filter a String', () => {
    const input = 'Hello';
    expect(denyIndexes(input, [0, 2])).toEqual(['e', 'l', 'o']);
  });
  it('Should filter a non iterable object', () => {
    const input = { a: 1, b: 2, c: 3 };
    const actual = denyIndexes(input, ['a', 'c']);
    expect(actual).toEqual([2]);
  });
  it('Should filter a basic type', () => {
    const input = 1;
    expect(denyIndexes(input, [0])).toEqual([]);
    expect(denyIndexes(input, [1])).toEqual([1]);
  });
  it('Should filter an Iterable', () => {
    const input = range(3, 10);
    const actual = denyIndexes(input, [0, 2]);
    expect(actual).toEqual([4, 6, 7, 8, 9]);
  });
});
