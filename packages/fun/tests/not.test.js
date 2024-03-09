const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { not } = require('../lib');
const Vector = require('./vector');

describe('not', () => {
  it('Should negate value provided', () => {
    expect(not(true)).toEqual(false);
    expect(not(false)).toEqual(true);
  });
  it('Should not an object with notOp', () => {
    const inputA = new Vector([1, 2, 3]);
    const inputB = new Vector([1, 2, -3]);
    expect(not(inputA)).toEqual(false);
    expect(not(inputB)).toEqual(true);
  });
});
