const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { forEachRight, range } = require('../lib');

describe('forEachRight', () => {
  it('Should not iterate undefined or null', () => {
    const actual = [];
    forEachRight(undefined, (x) => actual.push(x));
    forEachRight(null, (x) => actual.push(x));
    expect(actual).toEqual([]);
  });
  it('Should iterate an array', () => {
    const input = [1, 2, 3];
    const actual = [];
    forEachRight(input, (x) => actual.push(x));
    expect(actual).toEqual([3, 2, 1]);
  });
  it('Should iterate an ArrayBuffer', () => {
    const input = new Uint32Array([1, 2, 3]);
    const actual = [];
    forEachRight(input, (x) => actual.push(x));
    expect(actual).toEqual([3, 2, 1]);
  });
  it('Should iterate a String', () => {
    const input = 'Hello';
    const actual = [];
    forEachRight(input, (x) => actual.push(x));
    expect(actual).toEqual(['o', 'l', 'l', 'e', 'H']);
  });
  it('Should iterate a non iterable object', () => {
    const input = { a: 1, b: 2, c: 3 };
    const actual = [];
    forEachRight(input, (x, index) => actual.push([index, x]));
    expect(actual).toEqual([
      ['c', 3],
      ['b', 2],
      ['a', 1],
    ]);
  });
  it('Should iterate a basic type', () => {
    const input = 1;
    const actual = [];
    forEachRight(input, (x) => actual.push(x));
    expect(actual).toEqual([1]);
  });
  it('Should iterate an Iterable', () => {
    const input = range(0, 5);
    const actual = [];
    forEachRight(input, (x) => actual.push(x));
    expect(actual).toEqual([4, 3, 2, 1, 0]);
  });
});
