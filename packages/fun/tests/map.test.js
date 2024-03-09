const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { map, range } = require('../lib');

describe('map', () => {
  it('Should map undefined or null into empty array', () => {
    expect(map(undefined, (x) => x * 2)).toEqual([]);
    expect(map(null, (x) => x * 2)).toEqual([]);
  });
  it('Should map an array', () => {
    const input = [1, 2, 3];
    const actual = map(input, (x) => x * 2);
    expect(actual).toEqual([2, 4, 6]);
  });
  it('Should map an ArrayBuffer', () => {
    const input = new Uint32Array([1, 2, 3]);
    const actual = map(input, (x) => x * 2);
    expect(actual).toEqual([2, 4, 6]);
  });
  it('Should map a String', () => {
    const input = 'Hello';
    const actual = map(input, (x) => x.toUpperCase());
    expect(actual).toEqual(['H', 'E', 'L', 'L', 'O']);
  });
  it('Should map a non iterable object', () => {
    const input = { a: 1, b: 2, c: 3 };
    const actual = map(input, (x, index) => [index, x * 2]);
    expect(actual).toEqual([
      ['a', 2],
      ['b', 4],
      ['c', 6],
    ]);
  });
  it('Should map a basic type', () => {
    const input = 1;
    const actual = map(input, (x) => x * 2);
    expect(actual).toEqual([2]);
  });
  it('Should map an Iterable', () => {
    const input = range(0, 5);
    const actual = map(input, (x) => x * 2);
    expect(actual).toEqual([0, 2, 4, 6, 8]);
  });
});
