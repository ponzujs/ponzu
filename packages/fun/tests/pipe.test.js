const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { pipe } = require('../lib');

const negate = (x) => -x;
const pow = (x, y) => x ** y;
const inc = (x) => x + 1;

describe('Pipe', () => {
  it('Should pipe functions', () => {
    const fn = pipe(negate, inc);
    expect(fn(8)).toEqual(-7);
  });
  it('Should allow the first function to receive several params', () => {
    const fn = pipe(pow, negate, inc);
    expect(fn(3, 5)).toEqual(-242);
  });
  it('Should return identity if no function has been provided', () => {
    const fn = pipe();
    expect(fn(7)).toEqual(7);
  });
});
