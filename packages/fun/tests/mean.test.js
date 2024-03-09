const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { mean, range } = require('../lib');

describe('mean', () => {
  it('Should calculate mean of a list of numbers', () => {
    expect(mean([2])).toEqual(2);
    expect(mean([2, 7])).toEqual(4.5);
    expect(mean([2, 7, 9])).toEqual(6);
    expect(mean([2, 7, 9, 10])).toEqual(7);
  });
  it('Should calculate mean of parameters', () => {
    expect(mean(2)).toEqual(2);
    expect(mean(2, 7)).toEqual(4.5);
    expect(mean(2, 7, 9)).toEqual(6);
    expect(mean(2, 7, 9, 10)).toEqual(7);
  });
  it('Should calculate mean of iterable', () => {
    expect(mean(range(0, 10))).toEqual(4.5);
  });
  it('Should calculate mean of object', () => {
    expect(mean({ a: 2, b: 7, c: 9, d: 10 })).toEqual(7);
  });
  it('Should return NaN if undefined, null or empty array is provided', () => {
    expect(mean()).toBeNaN();
    expect(mean(null)).toBeNaN();
    expect(mean([])).toBeNaN();
  });
});
