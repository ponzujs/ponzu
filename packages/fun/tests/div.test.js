const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { _, div } = require('../lib');
const Vector = require('./vector');

describe('div', () => {
  it('Should allow to divide two terms', () => {
    expect(div(41, 4)).toEqual(10.25);
  });
  it('Should allow placeholders', () => {
    const half = div(_, 2);
    expect(half(41)).toEqual(20.5);
  });
  it('Should allow to use divOp method of objects', () => {
    const vector = new Vector([1, 2, 3, 4]);
    const actual = div(vector, 2);
    expect(actual).toNotBe(vector);
    expect(actual).toBeInstanceOf(Vector);
    expect(actual.arr).toEqual([0.5, 1, 1.5, 2]);
  });
  it('Should allow to use divOp method of objects to divide a between object', () => {
    const vector = new Vector([1, 2, 4, 8]);
    const actual = div(2, vector);
    expect(actual).toNotBe(vector);
    expect(actual).toBeInstanceOf(Vector);
    expect(actual.arr).toEqual([2, 1, 0.5, 0.25]);
  });
  it('If the object does not provide divOp meethod, do standard division', () => {
    const a = { a: 1 };
    expect(div(a, 2)).toBeNaN();
    expect(div(2, a)).toBeNaN();
  });
});
