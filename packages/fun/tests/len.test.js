const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { len, range } = require('../lib');

describe('len', () => {
  it('Should return 0 if input is null, undefined, false or empty string, array or object', () => {
    expect(len(null)).toEqual(0);
    expect(len(undefined)).toEqual(0);
    expect(len(false)).toEqual(0);
    expect(len('')).toEqual(0);
    expect(len([])).toEqual(0);
    expect(len({})).toEqual(0);
  });
  it('Should return 1 if input is true', () => {
    expect(len(true)).toEqual(1);
  });
  it('Should give the length of a string', () => {
    expect(len('Hello')).toEqual(5);
  });
  it('Should give the length of an array', () => {
    expect(len([0, 1, 2, 3])).toEqual(4);
  });
  it('Should give the length of an object', () => {
    expect(len({ a: 1, b: 2, c: 3 })).toEqual(3);
  });
  it('Should give the length of an iterable', () => {
    expect(len(range(0, 10))).toEqual(10);
  });
  it('Should return the number of digits of a number', () => {
    expect(len(1111)).toEqual(4);
  });
  it('Should return the length of a Map', () => {
    const input = new Map();
    input.set('a', 1);
    input.set('b', 2);
    input.set('c', 3);
    expect(len(input)).toEqual(3);
  });
  it('Should return the length of a Set', () => {
    const input = new Set();
    input.add('a');
    input.add('b');
    input.add('c');
    expect(len(input)).toEqual(3);
  });
});
