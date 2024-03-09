const { _ } = require('./_');
const { add } = require('./add');

module.exports = { inc: add(_, 1) };
