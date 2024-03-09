const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { forWhile, range } = require('../lib');

describe('forWhile', () => {
  it('Should not iterate undefined or null', () => {
    const actual = [];
    forWhile(undefined, (x) => actual.push(x));
    forWhile(null, (x) => actual.push(x));
    expect(actual).toEqual([]);
  });
  it('Should iterate an array and break based on a condition', () => {
    const input = [1, 2, 3];
    const actual = [];
    forWhile(input, (x) => {
      actual.push(x);
      return !(x >= 2);
    });
    expect(actual).toEqual([1, 2]);
  });
  it('Should iterate an ArrayBuffer', () => {
    const input = new Uint32Array([1, 2, 3]);
    const actual = [];
    forWhile(input, (x) => {
      actual.push(x);
      return !(x >= 2);
    });
    expect(actual).toEqual([1, 2]);
  });
  it('Should iterate a String', () => {
    const input = 'Hello';
    const actual = [];
    forWhile(input, (x) => {
      actual.push(x);
      return x !== 'l';
    });
    expect(actual).toEqual(['H', 'e', 'l']);
  });
  it('Should iterate a non iterable object', () => {
    const input = { a: 1, b: 2, c: 3 };
    const actual = [];
    forWhile(input, (x, index) => {
      actual.push([index, x]);
      return index !== 'b';
    });
    expect(actual).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
  });
  it('Should iterate a basic type', () => {
    const input = 1;
    const actual = [];
    forWhile(input, (x) => actual.push(x));
    expect(actual).toEqual([1]);
  });
  it('Should iterate an Iterable', () => {
    const input = range(0, 5);
    const actual = [];
    forWhile(input, (x) => {
      actual.push(x);
      return !(x >= 3);
    });
    expect(actual).toEqual([0, 1, 2, 3]);
  });
});
