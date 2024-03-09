const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { curry } = require('../lib');

const fn1 = (a) => a;
const fn2 = (a, b) => a + b;
const fn3 = (a, b, c) => a + b + c;
const fn4 = (a, b, c, d) => a + b + c + d;

describe('curry', () => {
  it('Should currify a function based on the number of arguments', () => {
    const cfn1 = curry(fn1);
    expect(cfn1(1)).toEqual(1);
    const cfn2 = curry(fn2);
    expect(cfn2(1)(2)).toEqual(3);
    const cfn3 = curry(fn3);
    expect(cfn3(1)(2)(3)).toEqual(6);
    const cfn4 = curry(fn4);
    expect(cfn4(1)(2)(3)(4)).toEqual(10);
  });
});
