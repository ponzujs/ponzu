const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { _, curry2 } = require('../lib');

function fn2(a, b) {
  return a * 10 + b;
}

function min(...args) {
  return Math.min(...args);
}

describe('Curry 2', () => {
  it('Should currify a two params function', () => {
    const cfn2 = curry2(fn2);
    expect(cfn2(1, 2)).toEqual(12);
    expect(cfn2(1)(2)).toEqual(12);
    expect(cfn2()(1, 2)).toEqual(12);
    expect(cfn2()(1)(2)).toEqual(12);
  });
  it('Should allow a placeholder in a two params function', () => {
    const cfn2 = curry2(fn2);
    const cfn2x2 = cfn2(_, 2);
    const cfn21x = cfn2(1, _);
    const cfn2x = cfn2(_);
    const cfn2xx = cfn2(_, _);
    expect(cfn2x2(1)).toEqual(12);
    expect(cfn2x2(2)).toEqual(22);
    expect(cfn21x(1)).toEqual(11);
    expect(cfn21x(2)).toEqual(12);
    expect(cfn2x(1, 2)).toEqual(12);
    expect(cfn2x(1)(2)).toEqual(12);
    expect(cfn2x()(1, 2)).toEqual(12);
    expect(cfn2x()(1)(2)).toEqual(12);
    expect(cfn2xx(1, 2)).toEqual(12);
    expect(cfn2xx(1)(2)).toEqual(12);
    expect(cfn2xx()(1, 2)).toEqual(12);
    expect(cfn2xx()(1)(2)).toEqual(12);
  });
  it('Should allow to overflow params', () => {
    const cmin = curry2(min);
    expect(cmin(5, 4, 3, 1, 2)).toEqual(1);
  });
});
