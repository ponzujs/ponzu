const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { or } = require('../lib');

describe('or', () => {
  it('Should calculate or of two parameters', () => {
    expect(or(true, true)).toBeTruthy();
    expect(or(true, false)).toBeTruthy();
    expect(or(false, true)).toBeTruthy();
    expect(or(false, false)).toBeFalsy();
    expect(or(true)(true)).toBeTruthy();
    expect(or(true)(false)).toBeTruthy();
    expect(or(false)(true)).toBeTruthy();
    expect(or(false)(false)).toBeFalsy();
  });
  it('Should allow to overflow parameters', () => {
    expect(or(true, true, true, true)).toBeTruthy();
    expect(or(true, true, true, false)).toBeTruthy();
    expect(or(false, false, false, false)).toBeFalsy();
  });
});
