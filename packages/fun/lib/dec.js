const { _ } = require('./_');
const { add } = require('./add');

module.exports = { dec: add(_, -1) };
