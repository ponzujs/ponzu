const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { mapRight, range } = require('../lib');

describe('mapRight', () => {
  it('Should map undefined or null into empty array', () => {
    expect(mapRight(undefined, (x) => x * 2)).toEqual([]);
    expect(mapRight(null, (x) => x * 2)).toEqual([]);
  });
  it('Should map an array', () => {
    const input = [1, 2, 3];
    const actual = mapRight(input, (x) => x * 2);
    expect(actual).toEqual([6, 4, 2]);
  });
  it('Should map an ArrayBuffer', () => {
    const input = new Uint32Array([1, 2, 3]);
    const actual = mapRight(input, (x) => x * 2);
    expect(actual).toEqual([6, 4, 2]);
  });
  it('Should map a String', () => {
    const input = 'Hello';
    const actual = mapRight(input, (x) => x.toUpperCase());
    expect(actual).toEqual(['O', 'L', 'L', 'E', 'H']);
  });
  it('Should map a non iterable object', () => {
    const input = { a: 1, b: 2, c: 3 };
    const actual = mapRight(input, (x, index) => [index, x * 2]);
    expect(actual).toEqual([
      ['c', 6],
      ['b', 4],
      ['a', 2],
    ]);
  });
  it('Should map a basic type', () => {
    const input = 1;
    const actual = mapRight(input, (x) => x * 2);
    expect(actual).toEqual([2]);
  });
  it('Should map an Iterable', () => {
    const input = range(0, 5);
    const actual = mapRight(input, (x) => x * 2);
    expect(actual).toEqual([8, 6, 4, 2, 0]);
  });
});
