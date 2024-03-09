const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { mapRightSrc, range } = require('../lib');

describe('mapRightSrc', () => {
  it('Should return undefined if input is undefined', () => {
    expect(mapRightSrc(undefined, (x) => x * 2)).toEqual(undefined);
  });
  it('Should return null if input is null', () => {
    expect(mapRightSrc(null, (x) => x * 2)).toEqual(null);
  });
  it('Should return a map of an array', () => {
    expect(mapRightSrc([1, 2, 3], (x) => x * 2)).toEqual([6, 4, 2]);
  });
  it('Should return a map of an Iterable', () => {
    expect(mapRightSrc(range(0, 5), (x) => x * 2)).toEqual([8, 6, 4, 2, 0]);
  });
  it('Should return a map of an object as an object', () => {
    expect(mapRightSrc({ a: 1, b: 2, c: 3 }, (x) => x * 2)).toEqual({
      c: 6,
      b: 4,
      a: 2,
    });
  });
  it('Should return a map of a string as an string', () => {
    expect(mapRightSrc('abcd', (x) => x.toUpperCase())).toEqual('DCBA');
  });
  it('Should return a map of a number as a number', () => {
    expect(mapRightSrc(7, (x) => x * 2)).toEqual(14);
  });
  it('Should return an ArrayBuffer if input is ArrayBuffer', () => {
    expect(mapRightSrc(new Uint32Array([1, 2, 3]), (x) => x * 2)).toEqual(
      new Uint32Array([6, 4, 2])
    );
  });
});
