const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { inc } = require('../lib');

describe('Inc', () => {
  it('Should add 1', () => {
    expect(inc(10)).toEqual(11);
  });
});
