const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { _, orFn, gt, lt } = require('../lib');

describe('orFn', () => {
  it('Should calculate or of two parameters', () => {
    expect(orFn(true, true)()).toBeTruthy();
    expect(orFn(true, false)()).toBeTruthy();
    expect(orFn(false, true)()).toBeTruthy();
    expect(orFn(false, false)()).toBeFalsy();
    expect(orFn(true)(true)()).toBeTruthy();
    expect(orFn(true)(false)()).toBeTruthy();
    expect(orFn(false)(true)()).toBeTruthy();
    expect(orFn(false)(false)()).toBeFalsy();
  });
  it('Should allow to overflow parameters', () => {
    expect(orFn(true, true, true, true)()).toBeTruthy();
    expect(orFn(true, true, true, false)()).toBeTruthy();
    expect(orFn(false, false, false, false)()).toBeFalsy();
  });
  it('Should do the or of two functions', () => {
    // function to check that x less than 0 or greater than 10;
    const outRange = orFn(lt(_, 0), gt(_, 10));
    expect(outRange(-1)).toBeTruthy();
    expect(outRange(0)).toBeFalsy();
    expect(outRange(1)).toBeFalsy();
    expect(outRange(9)).toBeFalsy();
    expect(outRange(10)).toBeFalsy();
    expect(outRange(11)).toBeTruthy();
  });
});
