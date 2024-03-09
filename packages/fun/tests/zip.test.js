const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { zip, range } = require('../lib');

describe('zip', () => {
  it('Should zip two arrays', () => {
    expect(zip(['a', 'b', 'c'], [1, 2, 3])).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });
  it('if first array is longer, use length of second array', () => {
    expect(zip(['a', 'b', 'c', 'd'], [1, 2, 3])).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });
  it('if second array is longer, use length of second array', () => {
    expect(zip(['a', 'b', 'c'], [1, 2, 3, 4])).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });
  it('should zip also iterables', () => {
    expect(zip(['a', 'b', 'c'], range(1, 5))).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });
  it('should zip also objects', () => {
    expect(zip(['a', 'b', 'c'], { name: 1, age: 2, other: 3 })).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
  });
});
