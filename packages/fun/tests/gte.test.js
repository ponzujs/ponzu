const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { gte } = require('../lib');

describe('gte', () => {
  it('Should return true if a > b', () => {
    expect(gte(8, 7)).toBeTruthy();
  });
  it('Should return true if a = b', () => {
    expect(gte(8, 8)).toBeTruthy();
  });
  it('Should return false if a < b', () => {
    expect(gte(8, 9)).toBeFalsy();
  });
});
