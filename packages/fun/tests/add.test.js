const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { _, add } = require('../lib');
const Vector = require('./vector');

describe('Add', () => {
  it('Should add two numbers', () => {
    expect(add(1, 2)).toEqual(3);
  });
  it('Should coerce arguments', () => {
    expect(add('1', 2)).toEqual(3);
    expect(add(1, '2')).toEqual(3);
    expect(add(true, true)).toEqual(2);
    expect(add(null, true)).toEqual(1);
    expect(add(undefined, true)).toEqual(NaN);
    expect(add(new Date(1), new Date(2))).toEqual(3);
  });
  it('Should allow param overflow', () => {
    expect(add(1, 2, 3)).toEqual(6);
  });
  it('Should allow placeholder', () => {
    const sum3 = add(_, 3);
    expect(sum3(1)).toEqual(4);
  });
  it('Should add two objects with addOp', () => {
    const a = new Vector([1, 2, 3, 4, 5]);
    const b = new Vector([2, 4, 6, 8, 10]);
    const actual = add(a, b);
    expect(actual).toBeInstanceOf(Vector);
    expect(actual.arr).toEqual([3, 6, 9, 12, 15]);
  });
  it('Should add two objects which class does not provide addOp', () => {
    const a = { name: 'John', age: 30 };
    const b = { name: 'Alice', phone: '555-555-555' };
    const expected = { name: 'Alice', age: 30, phone: '555-555-555' };
    const actual = add(a, b);
    expect(actual).toEqual(expected);
  });
});
