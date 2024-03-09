const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { mapSrc, range } = require('../lib');

describe('mapSrc', () => {
  it('Should return undefined if input is undefined', () => {
    expect(mapSrc(undefined, (x) => x * 2)).toEqual(undefined);
  });
  it('Should return null if input is null', () => {
    expect(mapSrc(null, (x) => x * 2)).toEqual(null);
  });
  it('Should return a map of an array', () => {
    expect(mapSrc([1, 2, 3], (x) => x * 2)).toEqual([2, 4, 6]);
  });
  it('Should return a map of an Iterable', () => {
    expect(mapSrc(range(0, 5), (x) => x * 2)).toEqual([0, 2, 4, 6, 8]);
  });
  it('Should return a map of an object as an object', () => {
    expect(mapSrc({ a: 1, b: 2, c: 3 }, (x) => x * 2)).toEqual({
      a: 2,
      b: 4,
      c: 6,
    });
  });
  it('Should return a map of a string as an string', () => {
    expect(mapSrc('abcd', (x) => x.toUpperCase())).toEqual('ABCD');
  });
  it('Should return a map of a number as a number', () => {
    expect(mapSrc(7, (x) => x * 2)).toEqual(14);
  });
  it('Should return an ArrayBuffer if input is ArrayBuffer', () => {
    expect(mapSrc(new Uint32Array([1, 2, 3]), (x) => x * 2)).toEqual(
      new Uint32Array([2, 4, 6])
    );
  });
});
