const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { filter, range } = require('../lib');

describe('filter', () => {
  it('Should filter undefined or null into empty array', () => {
    expect(filter(undefined, (x) => x * 2)).toEqual([]);
    expect(filter(null, (x) => x * 2)).toEqual([]);
  });
  it('Should filter an array', () => {
    const input = [1, 2, 3];
    const actual = filter(input, (x) => x % 2);
    expect(actual).toEqual([1, 3]);
  });
  it('Should filter an ArrayBuffer', () => {
    const input = new Uint32Array([1, 2, 3]);
    const actual = filter(input, (x) => x % 2);
    expect(actual).toEqual([1, 3]);
  });
  it('Should filter a String', () => {
    const input = 'HEllO';
    const actual = filter(input, (x) => x === x.toUpperCase());
    expect(actual).toEqual(['H', 'E', 'O']);
  });
  it('Should filter a non iterable object', () => {
    const input = { a: 1, b: 2, c: 3 };
    const actual = filter(input, (x) => x % 2);
    expect(actual).toEqual([1, 3]);
  });
  it('Should filter a basic type', () => {
    const input = 1;
    const actual = filter(input, (x) => x % 2);
    expect(actual).toEqual([1]);
  });
  it('Should filter an Iterable', () => {
    const input = range(0, 5);
    const actual = filter(input, (x) => x % 2);
    expect(actual).toEqual([1, 3]);
  });
});
