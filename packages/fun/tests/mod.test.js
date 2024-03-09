const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { mod } = require('../lib');

describe('Mod', () => {
  it('Should calculate modulus', () => {
    expect(mod(45, 7)).toEqual(3);
  });
});
