const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { isString } = require('../lib');

describe('isString', () => {
  it('Should return true if a string is provided', () => {
    expect(isString('str')).toBeTruthy();
  });
  it('Should return true if an object string is provided', () => {
    // eslint-disable-next-line no-new-wrappers
    expect(isString(new String('str'))).toBeTruthy();
  });
  it('Should return false if no string is provided', () => {
    expect(isString(5)).toBeFalsy();
  });
});
