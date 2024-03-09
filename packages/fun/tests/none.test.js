const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { none, range } = require('../lib');

describe('none', () => {
  it('Should return true if input is undefined or null', () => {
    expect(none(undefined, (x) => x === 3)).toBeTruthy();
    expect(none(null, (x) => x === 3)).toBeTruthy();
  });
  it('Should return true if none element of ArrayLike match the predicate', () => {
    expect(none([2, 2, 2, 2], (x) => x === 3)).toBeTruthy();
  });
  it('Should return false if at least one element of ArrayLike does match the predicate', () => {
    expect(none([2, 2, 2, 3], (x) => x === 3)).toBeFalsy();
  });
  it('Should return true if none elements of iterable match the predicate', () => {
    expect(none(range(0, 10), (x) => x > 10)).toBeTruthy();
  });
  it('Should return false if at least one element of iterable match the predicate', () => {
    expect(none(range(0, 11), (x) => x === 10)).toBeFalsy();
  });
  it('Should return true if none element of an object match the predicate', () => {
    expect(none({ a: 1, b: 2, c: 3 }, (x) => x === 4)).toBeTruthy();
  });
  it('Should return false if at least one element of an object match the predicate', () => {
    expect(none({ a: 1, b: 2, c: 4 }, (x) => x === 4)).toBeFalsy();
  });
  it('Should return false if input is a basic type and match the predicate', () => {
    expect(none(5, (x) => x < 10)).toBeFalsy();
  });
  it('Should return true if input is a basic type and match the predicate', () => {
    expect(none(11, (x) => x < 10)).toBeTruthy();
  });
});
