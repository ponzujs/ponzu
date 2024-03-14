const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { String } = require('../lib');

describe('String Type', () => {
  it('Should allow undefined if not mandatory', () => {
    const type = String({ mandatory: false });
    expect(type.validate(undefined)).toBeUndefined();
  });
  it('Should return an error if mandatory and value is undefined', () => {
    const type = String();
    expect(type.validate(undefined)).toBe('Value is mandatory');
  });
  it('Should return an error if value is not string', () => {
    const type = String();
    expect(type.validate(7)).toBe('Value must be a string');
  });
  it('Should return undefined if value is valid string', () => {
    const type = String();
    expect(type.validate('hello')).toBeUndefined();
  });
  it('Should return an error if value is too short', () => {
    const type = String({ min: 5 });
    expect(type.validate('hi')).toBe(
      'Value must be at least 5 characters long'
    );
  });
  it('Should return an error if value is too long', () => {
    const type = String({ max: 5 });
    expect(type.validate('hello world')).toBe(
      'Value must be at most 5 characters long'
    );
  });
  it('Should return undefined if value is within range', () => {
    const type = String({ min: 5, max: 10 });
    expect(type.validate('hello')).toBeUndefined();
  });
});
