const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { setAt, range } = require('../lib');

describe('setAt', () => {
  it('Should clone an array and set value at a given index', () => {
    const input = [1, 2, 3, 4];
    const actual = setAt(input, 1, 5);
    expect(actual).toNotBe(input);
    expect(actual).toEqual([1, 5, 3, 4]);
  });
  it('Should throw an exception if input is undefined or null', () => {
    expect(() => setAt(undefined, 0, 5)).toThrow(
      'Cannot perform setAt on undefined'
    );
    expect(() => setAt(null, 0, 5)).toThrow('Cannot perform setAt on null');
  });
  it('Should throw an exception if input is not valid for setAt', () => {
    expect(() => setAt(5, 0, 5)).toThrow('Cannot perform setAt on input');
  });
  it('Should allow to change a character of a string', () => {
    const input = 'abcde';
    const actual = setAt(input, 1, 'x');
    expect(actual).toEqual('axcde');
  });
  it('Should allow to remove a character from a string', () => {
    const input = 'abcde';
    const actual = setAt(input, 1, undefined);
    expect(actual).toEqual('acde');
  });
  it('Should map an iterable and set value at a given index', () => {
    const input = range(1, 5);
    const actual = setAt(input, 1, 5);
    expect(actual).toNotBe(input);
    expect(actual).toEqual([1, 5, 3, 4]);
  });
  it('Should clone and object and set value at a given property', () => {
    const input = { a: 1, b: 2, c: 3, d: 4 };
    const actual = setAt(input, 'b', 5);
    expect(actual).toNotBe(input);
    expect(actual).toEqual({ a: 1, b: 5, c: 3, d: 4 });
  });
  it('Should clone and object and remove property if set to undefined', () => {
    const input = { a: 1, b: 2, c: 3, d: 4 };
    const actual = setAt(input, 'b', undefined);
    expect(actual).toNotBe(input);
    expect(actual).toEqual({ a: 1, c: 3, d: 4 });
  });
});
