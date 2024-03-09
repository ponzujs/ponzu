const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { reduceRight } = require('../lib');

describe('reduce', () => {
  it('Should reduce null and undefined to default value', () => {
    expect(reduceRight(undefined, (p, c) => p + c, 0)).toEqual(0);
    expect(reduceRight(null, (p, c) => p + c, 0)).toEqual(0);
  });
  it('Should reduce an array', () => {
    const input = [2, 4, 16];
    const actual = reduceRight(input, (p, c) => p / c, 32);
    expect(actual).toEqual(0.25);
  });
  it('Should reduce an ArrayBuffer', () => {
    const input = new Uint32Array([2, 4, 16]);
    const actual = reduceRight(input, (p, c) => p / c, 32);
    expect(actual).toEqual(0.25);
  });
});
