const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { some, range } = require('../lib');

describe('some', () => {
  it('Should return false if input is undefined or null', () => {
    expect(some(undefined, (x) => x === 3)).toBeFalsy();
    expect(some(null, (x) => x === 3)).toBeFalsy();
  });
  it('Should return true if at least one element of ArrayLike match the predicate', () => {
    expect(some([2, 1, 3, 2], (x) => x === 3)).toBeTruthy();
  });
  it('Should return false if none element of ArrayLike match the predicate', () => {
    expect(some([2, 2, 2, 1], (x) => x === 3)).toBeFalsy();
  });
  it('Should return true if at least one element of iterable match the predicate', () => {
    expect(some(range(0, 10), (x) => x === 5)).toBeTruthy();
  });
  it('Should return false if none element of iterable match the predicate', () => {
    expect(some(range(0, 10), (x) => x > 10)).toBeFalsy();
  });
  it('Should return true if at least one element of an object match the predicate', () => {
    expect(some({ a: 1, b: 2, c: 3 }, (x) => x === 2)).toBeTruthy();
  });
  it('Should return false if none element of an object match the predicate', () => {
    expect(some({ a: 1, b: 3, c: 3 }, (x) => x === 2)).toBeFalsy();
  });
  it('Should return true if input is a basic type and match the predicate', () => {
    expect(some(5, (x) => x < 10)).toBeTruthy();
  });
  it('Should return false if input is a basic type and match the predicate', () => {
    expect(some(11, (x) => x < 10)).toBeFalsy();
  });
});
