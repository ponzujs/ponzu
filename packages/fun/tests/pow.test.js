const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { pow } = require('../lib');

describe('Pow', () => {
  it('Should calculate a to the power of b', () => {
    expect(pow(3, 5)).toEqual(243);
  });
});
