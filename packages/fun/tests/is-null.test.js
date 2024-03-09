const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { isNull } = require('../lib');

describe('IsNull', () => {
  it('Should return true if null is provided', () => {
    expect(isNull(null)).toBeTruthy();
  });
  it('Should return false if not null is provided', () => {
    expect(isNull(undefined)).toBeFalsy();
  });
});
