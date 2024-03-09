const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { clamp } = require('../lib');

describe('Clamp', () => {
  it('Shoud clamp a value', () => {
    expect(clamp(5, 95, 3)).toEqual(5);
    expect(clamp(5, 95, 100)).toEqual(95);
    expect(clamp(5, 95, 60)).toEqual(60);
  });
  it('Should allow curry', () => {
    const myclamp = clamp(5, 95);
    expect(myclamp(3)).toEqual(5);
    expect(myclamp(100)).toEqual(95);
    expect(myclamp(60)).toEqual(60);
  });
  it('Should throw an exception if min > max', () => {
    expect(() => clamp(95, 5, 5)).toThrow(
      'Max should be greater than max in clamp(min, max, value)'
    );
  });
});
