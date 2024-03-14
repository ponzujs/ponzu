const { clone } = require('@ponzujs/core');
const { APPROVE_TAG } = require('./tags');

function approve(x) {
  if (x && x.constructor && x.constructor[APPROVE_TAG]) {
    return x.constructor[APPROVE_TAG](x);
  }
  return clone(x);
}

module.exports = { approve };
