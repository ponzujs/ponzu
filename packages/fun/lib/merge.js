const { clone } = require('@ponzujs/core');
const { isObject } = require('./is-object');

function mergeInto(a, b) {
  if (isObject(a) && isObject(b)) {
    // eslint-disable-next-line
    for (const key in b) {
      if (Object.hasOwnProperty.call(b, key) !== false) {
        if (isObject(b[key])) {
          if (!a[key]) {
            // eslint-disable-next-line no-param-reassign
            a[key] = {};
          }
          mergeInto(a[key], b[key]);
        } else {
          // eslint-disable-next-line no-param-reassign
          a[key] = b[key];
        }
      }
    }
  }
}

function merge(...objs) {
  const target = clone(objs[0]);
  for (let i = 1; i < objs.length; i += 1) {
    mergeInto(target, objs[i]);
  }
  return target;
}

module.exports = { merge };
