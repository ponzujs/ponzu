const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { filterSrc, range } = require('../lib');

describe('filterSrc', () => {
  it('Should return undefined if input is undefined', () => {
    expect(filterSrc(undefined, (x) => x % 2)).toEqual(undefined);
  });
  it('Should return null if input is null', () => {
    expect(filterSrc(null, (x) => x % 2)).toEqual(null);
  });
  it('Should filter an array', () => {
    expect(filterSrc([1, 2, 3], (x) => x % 2)).toEqual([1, 3]);
  });
  it('Should filter an Iterable', () => {
    expect(filterSrc(range(0, 5), (x) => x % 2)).toEqual([1, 3]);
  });
  it('Should filter an object as an object', () => {
    expect(filterSrc({ a: 1, b: 2, c: 3 }, (x) => x % 2)).toEqual({
      a: 1,
      c: 3,
    });
  });
  it('Should filter a string as an string', () => {
    expect(filterSrc('ABcDe', (x) => x === x.toUpperCase())).toEqual('ABD');
  });
  it('Should filter a number as a number or undefined if not match the predicate', () => {
    expect(filterSrc(7, (x) => x % 2)).toEqual(7);
    expect(filterSrc(8, (x) => x % 2)).toEqual(undefined);
  });
  it('Should filter an ArrayBuffer as ArrayBuffer', () => {
    expect(filterSrc(new Uint32Array([1, 2, 3]), (x) => x % 2)).toEqual(
      new Uint32Array([1, 3])
    );
  });
});
