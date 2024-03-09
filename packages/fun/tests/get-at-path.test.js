const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { getAtPath } = require('../lib');

const input = [
  { a: 1, b: 2, c: 3, d: 4 },
  { a: 1, b: [1, 2, 3], c: 3, d: 4 },
];

describe('getAtPath', () => {
  it('Should return property value of given path', () => {
    const actual = getAtPath(input, '[1].b[2]');
    expect(actual).toEqual(3);
  });
  it('Should return undefined if input is undefined or null', () => {
    expect(getAtPath(undefined, '[1].b[2]')).toBeUndefined();
    expect(getAtPath(null, '[1].b[2]')).toBeUndefined();
  });
  it('Should return undefined if path does not exists at input', () => {
    expect(getAtPath(input, '[2].b[2]')).toBeUndefined();
    expect(getAtPath(input, '[no].b[2]')).toBeUndefined();
  });
});
