const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { range } = require('../lib');

describe('range', () => {
  it('Should create a range of numbers', () => {
    const numbers = [...range(0, 10)];
    expect(numbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  it('Should create a range of numbers with step', () => {
    const numbers = [...range(0, 10, 2)];
    expect(numbers).toEqual([0, 2, 4, 6, 8]);
  });
  it('If no to is provided, consider the range 0 to from', () => {
    const numbers = [...range(10)];
    expect(numbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
