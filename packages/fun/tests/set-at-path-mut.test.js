const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { setAtPathMut } = require('../lib');

describe('setAtPathMut', () => {
  it('Should change a property by path in the given object (mutable) ending by array index', () => {
    const input = [
      { a: 1, b: 2, c: 3, d: 4 },
      { a: 1, b: [1, 2, 3], c: 3, d: 4 },
    ];
    const actual = setAtPathMut(input, '[1].b[2]', 7);
    expect(actual).toBe(input);
    expect(input[1].b[2]).toBe(7);
  });
  it('Should change a property by path in the given object (mutable) ending by object index', () => {
    const input = [
      { a: 1, b: 2, c: 3, d: 4 },
      { a: 1, b: [1, 2, 3], c: 3, d: 4 },
    ];
    const actual = setAtPathMut(input, '[1].c', 7);
    expect(actual).toBe(input);
    expect(input[1].c).toBe(7);
  });
});
