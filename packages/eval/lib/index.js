const conditionalTransformer = require('./conditional-transformer');
const evaluator = require('./evaluator');
const scope = require('./scope');
const switchTransformer = require('./switch-transformer');
const template = require('./template');
const transform = require('./transform');
const transformer = require('./transformer');
const twoWaysTransformer = require('./two-ways-transformer');

module.exports = {
  ...conditionalTransformer,
  ...evaluator,
  ...scope,
  ...switchTransformer,
  ...template,
  ...transform,
  ...transformer,
  ...twoWaysTransformer,
};
