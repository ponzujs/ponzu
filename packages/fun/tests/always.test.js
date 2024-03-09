const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { always } = require('../lib');

describe('Always', () => {
  it('Should return a function that always return the same value', () => {
    expect(always(5)()).toEqual(5);
  });
});
