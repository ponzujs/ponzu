const { describe, it } = require('node:test');
const { expect, cloneBuffer } = require('../lib');

describe('Clone Buffer', () => {
  it('Should clone a buffer', () => {
    const buffer = Buffer.from('123456789abcdefghi');
    const actual = cloneBuffer(buffer);
    expect(actual).toNotBe(buffer);
    expect(actual.toString()).toEqual(buffer.toString());
  });
});
