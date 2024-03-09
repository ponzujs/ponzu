const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { median, range } = require('../lib');

describe('median', () => {
  it('Should calculate the median of an array of numbers', () => {
    expect(median([2, 9, 7])).toEqual(7);
    expect(median([7, 2, 10, 9])).toEqual(8);
  });
  it('Should calculate the median of parameters', () => {
    expect(median(2, 9, 7)).toEqual(7);
    expect(median(7, 2, 10, 9)).toEqual(8);
  });
  it('Should rerturn NaN if no numbers provided', () => {
    expect(median([])).toBeNaN();
    expect(median()).toBeNaN();
  });
  it('Should calculate the median from an object', () => {
    expect(median({ a: 2, b: 9, c: 7 })).toEqual(7);
    expect(median({ a: 7, b: 2, c: 10, d: 9 })).toEqual(8);
  });
  it('Should calculate the median from an iterable', () => {
    expect(median(range(0, 5))).toEqual(2);
    expect(median(range(0, 10))).toEqual(4.5);
  });
});
