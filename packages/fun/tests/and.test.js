const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { and } = require('../lib');
const Vector = require('./vector');

describe('And', () => {
  it('Should calculate and of two parameters', () => {
    expect(and(true, true)).toBeTruthy();
    expect(and(true, false)).toBeFalsy();
    expect(and(false, true)).toBeFalsy();
    expect(and(false, false)).toBeFalsy();
    expect(and(true)(true)).toBeTruthy();
    expect(and(true)(false)).toBeFalsy();
    expect(and(false)(true)).toBeFalsy();
    expect(and(false)(false)).toBeFalsy();
  });
  it('Should allow to overflow parameters', () => {
    expect(and(true, true, true, true)).toBeTruthy();
    expect(and(true, true, true, false)).toBeFalsy();
  });
  it('Should calculate and when some parameters are instances from class with andOp', () => {
    const vectorA = new Vector([1, 2, 3]);
    const vectorB = new Vector([-1, -2, -3]);
    expect(and(true, vectorA)).toBeTruthy();
    expect(and(false, vectorA)).toBeFalsy();
    expect(and(vectorA, vectorA)).toBeTruthy();
    expect(and(vectorA, true)).toBeTruthy();
    expect(and(true, vectorB)).toBeFalsy();
    expect(and(vectorB, vectorB)).toBeFalsy();
    expect(and(vectorB, true)).toBeFalsy();
  });
});
