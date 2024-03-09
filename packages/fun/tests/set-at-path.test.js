const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { setAtPath } = require('../lib');

describe('setAtPath', () => {
  it('Should clone an object and change a property by path', () => {
    const input = [
      { a: 1, b: 2, c: 3, d: 4 },
      { a: 1, b: [1, 2, 3], c: 3, d: 4 },
    ];
    const actual = setAtPath(input, '[1].b[2]', 7);
    expect(actual).toNotBe(input);
    expect(input[1].b[2]).toBe(3);
    expect(actual).toEqual([
      { a: 1, b: 2, c: 3, d: 4 },
      { a: 1, b: [1, 2, 7], c: 3, d: 4 },
    ]);
  });
});
