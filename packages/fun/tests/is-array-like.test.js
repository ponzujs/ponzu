const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { isArrayLike } = require('../lib');

describe('IsArrayLike', () => {
  it('Should identity an array', () => {
    expect(isArrayLike([])).toBeTruthy();
  });
  it('Should return false if no array is provided', () => {
    expect(isArrayLike(undefined)).toBeFalsy();
    expect(isArrayLike(null)).toBeFalsy();
    expect(isArrayLike({})).toBeFalsy();
    expect(isArrayLike('str')).toBeFalsy();
  });
  it('Should identify any object with length and first and last element', () => {
    const input = { length: 3, 0: 'a', 1: 'b', 2: 'c' };
    expect(isArrayLike(input)).toBeTruthy();
  });
  it('Should identify any object with length 0', () => {
    const input = { length: 0 };
    expect(isArrayLike(input)).toBeTruthy();
  });
});
