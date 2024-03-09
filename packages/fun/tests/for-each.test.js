const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { forEach, range } = require('../lib');

describe('forEach', () => {
  it('Should not iterate undefined or null', () => {
    const actual = [];
    forEach(undefined, (x) => actual.push(x));
    forEach(null, (x) => actual.push(x));
    expect(actual).toEqual([]);
  });
  it('Should iterate an array', () => {
    const input = [1, 2, 3];
    const actual = [];
    forEach(input, (x) => actual.push(x));
    expect(actual).toEqual([1, 2, 3]);
  });
  it('Should iterate an ArrayBuffer', () => {
    const input = new Uint32Array([1, 2, 3]);
    const actual = [];
    forEach(input, (x) => actual.push(x));
    expect(actual).toEqual([1, 2, 3]);
  });
  it('Should iterate a String', () => {
    const input = 'Hello';
    const actual = [];
    forEach(input, (x) => actual.push(x));
    expect(actual).toEqual(['H', 'e', 'l', 'l', 'o']);
  });
  it('Should iterate a non iterable object', () => {
    const input = { a: 1, b: 2, c: 3 };
    const actual = [];
    forEach(input, (x, index) => actual.push([index, x]));
    expect(actual).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });
  it('Should iterate a basic type', () => {
    const input = 1;
    const actual = [];
    forEach(input, (x) => actual.push(x));
    expect(actual).toEqual([1]);
  });
  it('Should iterate an Iterable', () => {
    const input = range(0, 5);
    const actual = [];
    forEach(input, (x) => actual.push(x));
    expect(actual).toEqual([0, 1, 2, 3, 4]);
  });
});
