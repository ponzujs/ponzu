const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { _, curry3 } = require('../lib');

function min(...args) {
  return Math.min(...args);
}

function fn3(a, b, c) {
  return a * 100 + b * 10 + c;
}

describe('Curry 3', () => {
  it('Should currify a 3 params function', () => {
    const cfn3 = curry3(fn3);
    expect(cfn3(1, 2, 3)).toEqual(123);
    expect(cfn3(1, 2)(3)).toEqual(123);
    expect(cfn3(1)(2, 3)).toEqual(123);
    expect(cfn3(1)(2)(3)).toEqual(123);
    expect(cfn3()(1, 2, 3)).toEqual(123);
    expect(cfn3()(1, 2)(3)).toEqual(123);
    expect(cfn3()(1)(2, 3)).toEqual(123);
    expect(cfn3()(1)(2)(3)).toEqual(123);
  });
  it('Should allow a placeholder in a two params function', () => {
    const cfn3 = curry3(fn3);
    const cfn3xx3 = cfn3(_, _, 3);
    const cfn3x23 = cfn3(_, 2, 3);
    const cfn3x2x = cfn3(_, 2, _);
    const cfn31xx = cfn3(1, _, _);
    const cfn31x3 = cfn3(1, _, 3);
    const cfn312x = cfn3(1, 2, _);
    const cfn3x = cfn3(_);
    const cfn3xx = cfn3(_, _);
    const cfn31x = cfn3(1, _);
    const cfn312 = cfn3(1, 2);
    const cfn3x2 = cfn3(_, 2);
    const cfn3xxx = cfn3(_, _, _);
    expect(cfn3xx3(1, 2)).toEqual(123);
    expect(cfn3xx3(1)(2)).toEqual(123);
    expect(cfn3x23(1)).toEqual(123);
    expect(cfn3x2x(1, 3)).toEqual(123);
    expect(cfn3x2x(1)(3)).toEqual(123);
    expect(cfn31xx(2, 3)).toEqual(123);
    expect(cfn31xx(2)(3)).toEqual(123);
    expect(cfn31x3(2)).toEqual(123);
    expect(cfn312x(3)).toEqual(123);
    expect(cfn3x(1, 2, 3)).toEqual(123);
    expect(cfn3xx(1, 2, 3)).toEqual(123);
    expect(cfn31x(2, 3)).toEqual(123);
    expect(cfn31x(2)(3)).toEqual(123);
    expect(cfn312(3)).toEqual(123);
    expect(cfn3x2(1, 3)).toEqual(123);
    expect(cfn3x2(1)(3)).toEqual(123);
    expect(cfn3xxx(1, 2, 3)).toEqual(123);
  });
  it('Should allow to overflow params', () => {
    const cmin = curry3(min);
    expect(cmin(5, 4, 3, 1, 2)).toEqual(1);
  });
});
