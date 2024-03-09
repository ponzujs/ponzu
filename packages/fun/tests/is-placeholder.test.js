const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { _, isPlaceholder } = require('../lib');

describe('Placeholder', () => {
  describe('isPlaceholder', () => {
    it('Should return true if value provided is placeholder', () => {
      const actual = isPlaceholder(_);
      expect(actual).toBeTruthy();
    });

    it('Should return false if value provided is not a placeholder', () => {
      const actual = isPlaceholder({});
      expect(actual).toBeFalsy();
    });
  });
});
