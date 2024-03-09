const assert = require('node:assert');

function expect(actual) {
  return {
    toNotBe(expected) {
      assert.notStrictEqual(actual, expected);
    },
    toBe(expected) {
      assert.strictEqual(actual, expected);
    },
    toBeNull() {
      assert.strictEqual(actual, null);
    },
    toEqual(expected) {
      assert.deepStrictEqual(actual, expected);
    },
    toBeDefined() {
      assert.notStrictEqual(actual, undefined);
    },
    toBeUndefined() {
      assert.strictEqual(actual, undefined);
    },
    toBeTruthy() {
      assert.ok(actual);
    },
    toBeFalsy() {
      assert.ok(!actual);
    },
    toBeInstanceOf(expected) {
      assert.ok(actual instanceof expected);
    },
    toHaveLength(expected) {
      assert.strictEqual(actual.length, expected);
    },
    toThrow(expected) {
      assert.throws(actual, `Error: ${expected}$`);
    },
    toBeNaN() {
      assert.ok(isNaN(actual));
    }
  };
}
module.exports = { expect };
