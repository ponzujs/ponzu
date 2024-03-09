const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { isPromise } = require('../lib');

function fnPromise() {
  return new Promise((resolve) => {
    resolve(7);
  });
}

describe('isPromise', () => {
  it('Should return true if a promise is provided', () => {
    expect(isPromise(fnPromise())).toBeTruthy();
  });
  it('Should return true if is promise like', () => {
    expect(isPromise({ then: () => 5 })).toBeTruthy();
  });
  it('Should return false if is no promise is provided', () => {
    expect(isPromise({ then: 7 })).toBeFalsy();
  });
});
