const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { boolDict, range } = require('../lib');

describe('boolDict', () => {
  it('Should generate an empty object if input is undefined or null', () => {
    expect(boolDict(undefined)).toEqual({});
    expect(boolDict(null)).toEqual({});
  });
  it('Should iterate an array', () => {
    const input = [1, 2, 3];
    const actual = boolDict(input);
    const expected = { 1: true, 2: true, 3: true };
    expect(actual).toEqual(expected);
  });
  it('Should iterate an ArrayBuffer', () => {
    const input = new Uint32Array([1, 2, 3]);
    const actual = boolDict(input);
    const expected = { 1: true, 2: true, 3: true };
    expect(actual).toEqual(expected);
  });
  it('Should generate a bool dict from a String', () => {
    const input = 'Hello';
    const actual = boolDict(input);
    const expected = { Hello: true };
    expect(actual).toEqual(expected);
  });
  it('Should generate a bool dict from keys of the object', () => {
    const input = { a: 1, b: 2, c: 3 };
    const actual = boolDict(input);
    const expected = { a: true, b: true, c: true };
    expect(actual).toEqual(expected);
  });
  it('Should generat a bool dict from a basic type', () => {
    const input = 1;
    const actual = boolDict(input);
    const expected = { 1: true };
    expect(actual).toEqual(expected);
  });
  it('Should generate a bool dict from an Iterable', () => {
    const input = range(0, 5);
    const actual = boolDict(input);
    const expected = { 0: true, 1: true, 2: true, 3: true, 4: true };
    expect(actual).toEqual(expected);
  });
});
