const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const {
  encrypt,
  decrypt,
  isEncryptedWithKey,
  ensureEncryptedWithKey,
  ensureDecryptedWithKey,
  encryptFields,
  decryptFields,
} = require('../lib');

describe('Encryption', () => {
  describe('encrypt', () => {
    it('Should generate an string, length 65, with : in position 32', () => {
      const actual = encrypt('secret', 'this is a text');
      expect(typeof actual).toBe('string');
      expect(actual).toHaveLength(65);
      expect(actual[32]).toBe(':');
    });
  });

  describe('decrypt', () => {
    it('Should decrypt an string', () => {
      const actual = decrypt(
        'secret',
        '5c17d2f2d37e23debf43fa26743b2b01:1c4caff50f51d1346e1447f932bf9c5b'
      );
      expect(actual).toBe('this is a test');
    });
  });

  describe('isEncryptedWithKey', () => {
    it('Should return true if the string is encrypted with the key', () => {
      const crypted = encrypt('secret', 'this is a text');
      const actual = isEncryptedWithKey('secret', crypted);
      expect(actual).toBe(true);
    });
    it('Should return false if the string is not encrypted with the key', () => {
      const crypted = encrypt('secret', 'this is a text');
      const actual = isEncryptedWithKey('secreto', crypted);
      expect(actual).toBe(false);
    });
  });

  describe('ensureEncryptedWithKey', () => {
    it('Should encrypt if not already encrypted', () => {
      const crypted = ensureEncryptedWithKey('secret', 'this is a text');
      const actual = isEncryptedWithKey('secret', crypted);
      expect(actual).toBe(true);
    });
    it('Should return false if the string is not encrypted with the key', () => {
      const crypted0 = encrypt('secret', 'this is a text');
      const crypted1 = ensureEncryptedWithKey('secret', crypted0);
      const actual = isEncryptedWithKey('secret', crypted1);
      expect(actual).toBe(true);
      expect(crypted0).toBe(crypted1);
    });
    it('Should return source if is falsy', () => {
      const crypted = ensureEncryptedWithKey('secret', null);
      expect(crypted).toBe(null);
    });
  });

  describe('ensureDecryptedWithKey', () => {
    it('Should decrypt if not already decrypted', () => {
      const crypted = encrypt('secret', 'this is a text');
      const decrypted = ensureDecryptedWithKey('secret', crypted);
      expect(decrypted).toBe('this is a text');
    });
    it('Should return the text if not crypted', () => {
      const decrypted = ensureDecryptedWithKey('secret', 'this is a text');
      expect(decrypted).toBe('this is a text');
    });
    it('Should return source if is falsy', () => {
      const decrypted = ensureDecryptedWithKey('secret', null);
      expect(decrypted).toBe(null);
    });
  });

  describe('encryptFields', () => {
    it('Should encrypt the fields', () => {
      const obj = {
        name: 'John',
        email: 'john@doe.com',
        year: 2000,
        type: 'user',
      };
      const actual = encryptFields('secret', obj, ['name', 'email']);
      expect(actual.name).toNotBe(obj.name);
      expect(actual.email).toNotBe(obj.email);
      expect(actual.year).toBe(obj.year);
      expect(actual.type).toBe(obj.type);
    });
  });

  describe('decryptFields', () => {
    it('Should decrypt the fields', () => {
      const obj = {
        name: 'John',
        email: 'john@doe.com',
        year: 2000,
        type: 'user',
      };
      const crypted = encryptFields('secret', obj, ['name', 'email']);
      const decrypted = decryptFields('secret', crypted, ['name', 'email']);
      expect(decrypted).toEqual(obj);
    });
  });
});
