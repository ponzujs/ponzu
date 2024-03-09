const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { negate } = require('../lib');
const Vector = require('./vector');

describe('Negate', () => {
  it('Should negate the input', () => {
    expect(negate(8)).toEqual(-8);
  });
  it('Should negate an object with negateOp', () => {
    const input = new Vector([1, 2, 3]);
    const expected = [-1, -2, -3];
    const actual = negate(input);
    expect(actual.arr).toEqual(expected);
  });
});
