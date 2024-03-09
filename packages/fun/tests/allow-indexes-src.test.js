const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { allowIndexesSrc, range } = require('../lib');

describe('allowIndexesSrc', () => {
  it('Should return undefined if input is undefined', () => {
    expect(allowIndexesSrc(undefined, [0, 2])).toEqual(undefined);
  });
  it('Should return null if input is null', () => {
    expect(allowIndexesSrc(null, [0, 2])).toEqual(null);
  });
  it('Should filter an array', () => {
    expect(allowIndexesSrc([1, 2, 3], [0, 2])).toEqual([1, 3]);
  });
  it('Should filter an Iterable', () => {
    expect(allowIndexesSrc(range(0, 5), [0, 2])).toEqual([0, 2]);
  });
  it('Should filter an object as an object', () => {
    expect(allowIndexesSrc({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({
      a: 1,
      c: 3,
    });
  });
  it('Should filter a string as an string', () => {
    expect(allowIndexesSrc('ABCDE', [0, 1, 3])).toEqual('ABD');
  });
  it('Should filter a number as a number or undefined if not in allowed index', () => {
    expect(allowIndexesSrc(7, [0])).toEqual(7);
    expect(allowIndexesSrc(8, [1])).toEqual(undefined);
  });
  it('Should filter an ArrayBuffer as ArrayBuffer', () => {
    expect(allowIndexesSrc(new Uint32Array([1, 2, 3]), [0, 2])).toEqual(
      new Uint32Array([1, 3])
    );
  });
});
