const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { _, mult } = require('../lib');

describe('mult', () => {
  it('Should allow to multiply two terms', () => {
    expect(mult(6, 8)).toEqual(48);
  });
  it('Should allow placeholders', () => {
    const double = mult(_, 2);
    expect(double(7.5)).toEqual(15);
  });
});
