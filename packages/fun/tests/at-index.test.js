const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { atIndex } = require('../lib');

describe('atIndex', () => {
  it('Should return the index if inside the length range', () => {
    expect(atIndex(6, 3)).toEqual(3);
  });
  it('Should return the invese index if negative and inside the length range', () => {
    expect(atIndex(6, -2)).toEqual(4);
  });
  it('Should return -1 if positive and outside length range', () => {
    expect(atIndex(6, 6)).toEqual(-1);
    expect(atIndex(6, 8)).toEqual(-1);
  });
  it('Should return -1 if negatve and outside length range', () => {
    expect(atIndex(6, -7)).toEqual(-1);
    expect(atIndex(6, -8)).toEqual(-1);
  });
});
