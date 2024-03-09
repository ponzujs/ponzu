const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { fromPairs } = require('../lib');

describe('fromPairs', () => {
  it('Should create an object from array of pairs', () => {
    expect(
      fromPairs([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    ).toEqual({ a: 1, b: 2, c: 3 });
  });
});
