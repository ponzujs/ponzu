const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { zipWith } = require('../lib');

function add(a, b) {
  return a + b;
}

describe('zipWith', () => {
  it('Should zip two arrays using a function', () => {
    expect(zipWith([1, 2, 3], [4, 5, 6], add)).toEqual([5, 7, 9]);
  });
});
