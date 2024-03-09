const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { _, andFn, gt, lt } = require('../lib');

describe('andFn', () => {
  it('Should calculate and of two parameters', () => {
    expect(andFn(true, true)()).toBeTruthy();
    expect(andFn(true, false)()).toBeFalsy();
    expect(andFn(false, true)()).toBeFalsy();
    expect(andFn(false, false)()).toBeFalsy();
    expect(andFn(true)(true)()).toBeTruthy();
    expect(andFn(true)(false)()).toBeFalsy();
    expect(andFn(false)(true)()).toBeFalsy();
    expect(andFn(false)(false)()).toBeFalsy();
  });
  it('Should allow to overflow parameters', () => {
    expect(andFn(true, true, true, true)()).toBeTruthy();
    expect(andFn(true, true, true, false)()).toBeFalsy();
  });
  it('Should do the and of two functions', () => {
    // function to check that x is 1 to 9;
    const inRange = andFn(gt(_, 0), lt(_, 10));
    expect(inRange(-1)).toBeFalsy();
    expect(inRange(0)).toBeFalsy();
    expect(inRange(1)).toBeTruthy();
    expect(inRange(9)).toBeTruthy();
    expect(inRange(10)).toBeFalsy();
    expect(inRange(11)).toBeFalsy();
  });
});
