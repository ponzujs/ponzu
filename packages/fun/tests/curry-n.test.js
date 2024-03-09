const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { _, curryN } = require('../lib');

function fn1(a) {
  return a;
}

function fn2(a, b) {
  return a * 10 + b;
}

function min(...args) {
  return Math.min(...args);
}

function fn3(a, b, c) {
  return a * 100 + b * 10 + c;
}

function fn4(a, b, c, d) {
  return a * 1000 + b * 100 + c * 10 + d;
}

describe('Curry N', () => {
  it('Should currify functions of 1 param', () => {
    const cfn1 = curryN(1, fn1);
    expect(cfn1(1)).toEqual(1);
  });
  it('Should currify functions of 2 param', () => {
    const cfn2 = curryN(2, fn2);
    expect(cfn2(1, 2)).toEqual(12);
  });
  it('Should currify functions of 3 param', () => {
    const cfn3 = curryN(3, fn3);
    expect(cfn3(1, 2, 3)).toEqual(123);
  });
  it('Should currify functions of 4 param', () => {
    const cfn4 = curryN(4, fn4);
    expect(cfn4(1, 2, 3, 4)).toEqual(1234);
    expect(cfn4(1)(2, 3, 4)).toEqual(1234);
  });
  it('allows to have placeholders', () => {
    const cfn4 = curryN(4, fn4);
    const cfn4x23x = cfn4(_, 2, 3, _);
    expect(cfn4x23x(1, 4)).toEqual(1234);
    expect(cfn4x23x(1)(4)).toEqual(1234);
  });
  it('Should allow to overflow', () => {
    const cmin = curryN(6, min);
    expect(cmin(10, 9, 8, 7, 6, 5, 4, 3, 1, 2)).toEqual(1);
  });
});
