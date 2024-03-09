const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { atPath } = require('../lib');

describe('atPath', () => {
  it('Should extract path tokens from string', () => {
    expect(atPath('[0].a[1].b.c')).toEqual(['[0]', 'a', '[1]', 'b', 'c']);
  });
});
