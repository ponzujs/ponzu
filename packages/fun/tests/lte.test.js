const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { lte } = require('../lib');

describe('lte', () => {
  it('Should return true if a < b', () => {
    expect(lte(8, 9)).toBeTruthy();
  });
  it('Should return true if a = b', () => {
    expect(lte(8, 8)).toBeTruthy();
  });
  it('Should return false if a > b', () => {
    expect(lte(8, 7)).toBeFalsy();
  });
});
