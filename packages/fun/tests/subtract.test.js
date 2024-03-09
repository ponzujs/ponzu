const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { _, subtract } = require('../lib');
const Vector = require('./vector');

describe('Subtract', () => {
  it('Should subtract a number from another', () => {
    expect(subtract(10, 3)).toEqual(7);
  });
  it('Should allow placeholder', () => {
    const minus3 = subtract(_, 3);
    expect(minus3(10)).toEqual(7);
  });
  it('Shoud allow param overflow', () => {
    expect(subtract(10, 3, 2, 1)).toEqual(4);
  });
  it('Should subtract two objects if second have negate', () => {
    const a = new Vector([1, -1, 6, 8, 10]);
    const b = new Vector([1, 2, 3, 4, 5]);
    const actual = subtract(a, b);
    expect(actual).toBeInstanceOf(Vector);
    expect(actual.arr).toEqual([0, -3, 3, 4, 5]);
  });
});
