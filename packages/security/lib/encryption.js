const {
  createCipheriv,
  randomBytes,
  createDecipheriv,
} = require('node:crypto');
const { clone } = require('@ponzujs/core');

const algorithm = 'aes-256-cbc';

function generateIv() {
  return randomBytes(16);
}

function ensure32(text) {
  let result = text.slice(0, 32);
  while (result.length < 32) {
    result = `${result} `;
  }
  return result;
}

function encrypt(secretKey, text) {
  const iv = generateIv();
  const cipher = createCipheriv(algorithm, ensure32(secretKey), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(secretKey, text) {
  const index = text.indexOf(':');
  const iv = Buffer.from(text.slice(0, index), 'hex');
  const encryptedText = Buffer.from(text.slice(index + 1), 'hex');
  const decipher = createDecipheriv(algorithm, ensure32(secretKey), iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decrypted.toString();
}

function isEncryptedWithKey(secretKey, text) {
  try {
    decrypt(secretKey, text);
    return true;
  } catch (err) {
    return false;
  }
}

function ensureEncryptedWithKey(secretKey, text) {
  if (!text) {
    return text;
  }
  return isEncryptedWithKey(secretKey, text) ? text : encrypt(secretKey, text);
}

function ensureDecryptedWithKey(secretKey, text) {
  if (!text) {
    return text;
  }
  return isEncryptedWithKey(secretKey, text) ? decrypt(secretKey, text) : text;
}

function encryptFields(secretKey, srcObj, fields) {
  const obj = clone(srcObj);
  fields.forEach((field) => {
    obj[field] = ensureEncryptedWithKey(secretKey, obj[field]);
  });
  return obj;
}

function decryptFields(secretKey, srcObj, fields) {
  const obj = clone(srcObj);
  fields.forEach((field) => {
    obj[field] = ensureDecryptedWithKey(secretKey, obj[field]);
  });
  return obj;
}

module.exports = {
  encrypt,
  decrypt,
  isEncryptedWithKey,
  ensureEncryptedWithKey,
  ensureDecryptedWithKey,
  encryptFields,
  decryptFields,
};
