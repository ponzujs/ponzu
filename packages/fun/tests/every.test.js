const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { every, range } = require('../lib');

describe('every', () => {
  it('Should return false if input is undefined or null', () => {
    expect(every(undefined, (x) => x === 3)).toBeFalsy();
    expect(every(null, (x) => x === 3)).toBeFalsy();
  });
  it('Should return true if all elements of ArrayLike match the predicate', () => {
    expect(every([3, 3, 3, 3], (x) => x === 3)).toBeTruthy();
  });
  it('Should return false if at least one element of ArrayLike does not match the predicate', () => {
    expect(every([3, 3, 2, 3], (x) => x === 3)).toBeFalsy();
  });
  it('Should return true if all elements of iterable match the predicate', () => {
    expect(every(range(0, 10), (x) => x < 10)).toBeTruthy();
  });
  it('Should return false if all elements of iterable match the predicate', () => {
    expect(every(range(0, 11), (x) => x < 10)).toBeFalsy();
  });
  it('Should return true if all elements of an object match the predicate', () => {
    expect(every({ a: 1, b: 2, c: 3 }, (x) => x < 10)).toBeTruthy();
  });
  it('Should return false if all elements of an object match the predicate', () => {
    expect(every({ a: 1, b: 2, c: 11 }, (x) => x < 10)).toBeFalsy();
  });
  it('Should return true if input is a basic type and match the predicate', () => {
    expect(every(5, (x) => x < 10)).toBeTruthy();
  });
  it('Should return false if input is a basic type and match the predicate', () => {
    expect(every(11, (x) => x < 10)).toBeFalsy();
  });
});
