const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { reduce, range } = require('../lib');

describe('reduce', () => {
  it('Should reduce null and undefined to default value', () => {
    expect(reduce(undefined, (p, c) => p + c, 0)).toEqual(0);
    expect(reduce(null, (p, c) => p + c, 0)).toEqual(0);
  });
  it('Should reduce an array', () => {
    const input = [0, 1, 2, 3, 4, 5];
    const actual = reduce(input, (p, c) => p + c, 0);
    expect(actual).toEqual(15);
  });
  it('Should reduce an ArrayBuffer', () => {
    const input = new Uint32Array([0, 1, 2, 3, 4, 5]);
    const actual = reduce(input, (p, c) => p + c, 0);
    expect(actual).toEqual(15);
  });
  it('Should reduce a String', () => {
    const input = 'Hello';
    const actual = reduce(
      input,
      (p, c) => {
        p.push(c);
        return p;
      },
      []
    );
    expect(actual).toEqual(['H', 'e', 'l', 'l', 'o']);
  });
  it('Should reduce a non iterable object', () => {
    const input = { a: 1, b: 2, c: 3 };
    const actual = reduce(input, (p, c) => p + c, 0);
    expect(actual).toEqual(6);
  });
  it('Should reduce a basic type', () => {
    const input = 1;
    const actual = reduce(input, (p, c) => p + c, 0);
    expect(actual).toEqual(1);
  });
  it('Should reduce an Iterable', () => {
    const input = range(0, 5);
    const actual = reduce(input, (p, c) => p + c, 0);
    expect(actual).toEqual(10);
  });
});
