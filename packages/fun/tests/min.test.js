const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { min } = require('../lib');

describe('Min', () => {
  it('Should return the min value of a pair', () => {
    expect(min(2, 1)).toEqual(1);
    expect(min(2, 3)).toEqual(2);
    expect(min(2)(1)).toEqual(1);
    expect(min(2)(3)).toEqual(2);
  });
  it('Should allow param overflow', () => {
    expect(min(2, 1, 3, 4, 5, -1, 6)).toEqual(-1);
  });
});
