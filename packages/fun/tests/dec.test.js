const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { dec } = require('../lib');

describe('Dec', () => {
  it('Should substract 1 from a number', () => {
    expect(dec(10)).toEqual(9);
  });
});
