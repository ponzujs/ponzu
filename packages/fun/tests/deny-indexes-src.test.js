const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { denyIndexesSrc, range } = require('../lib');

describe('denyIndexesSrc', () => {
  it('Should return undefined if input is undefined', () => {
    expect(denyIndexesSrc(undefined, [0, 2])).toEqual(undefined);
  });
  it('Should return null if input is null', () => {
    expect(denyIndexesSrc(null, [0, 2])).toEqual(null);
  });
  it('Should filter an array', () => {
    expect(denyIndexesSrc([1, 2, 3], [0, 2])).toEqual([2]);
  });
  it('Should filter an Iterable', () => {
    expect(denyIndexesSrc(range(0, 5), [0, 2])).toEqual([1, 3, 4]);
  });
  it('Should filter an object as an object', () => {
    expect(denyIndexesSrc({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({
      b: 2,
    });
  });
  it('Should filter a string as an string', () => {
    expect(denyIndexesSrc('ABCDE', [0, 2])).toEqual('BDE');
  });
  it('Should filter a number as a number or undefined if the index is included', () => {
    expect(denyIndexesSrc(7, [1])).toEqual(7);
    expect(denyIndexesSrc(8, [0])).toEqual(undefined);
  });
  it('Should filter an ArrayBuffer as ArrayBuffer', () => {
    expect(denyIndexesSrc(new Uint32Array([1, 2, 3]), [0, 2])).toEqual(
      new Uint32Array([2])
    );
  });
});
