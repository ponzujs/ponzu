const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { lt } = require('../lib');

describe('lt', () => {
  it('Should return true if a < b', () => {
    expect(lt(8, 9)).toBeTruthy();
  });
  it('Should return false if a = b', () => {
    expect(lt(8, 8)).toBeFalsy();
  });
  it('Should return false if a > b', () => {
    expect(lt(8, 7)).toBeFalsy();
  });
});
