const { isFunction } = require('@ponzujs/core');
const add = require('./add');
const allowIndexes = require('./allow-indexes');
const allowIndexesSrc = require('./allow-indexes-src');
const always = require('./always');
const and = require('./and');
const andFn = require('./and-fn');
const andOp = require('./and-op');
const approve = require('./approve');
const asArrayLike = require('./as-array-like');
const atIndex = require('./at-index');
const atPath = require('./at-path');
const boolDict = require('./bool-dict');
const clamp = require('./clamp');
const concat = require('./concat');
const curry = require('./curry');
const curryN = require('./curry-n');
const curry2 = require('./curry2');
const curry3 = require('./curry3');
const dec = require('./dec');
const denyIndexesSrc = require('./deny-indexes-src');
const denyIndexes = require('./deny-indexes');
const divOp = require('./div-op');
const div = require('./div');
const every = require('./every');
const filter = require('./filter');
const filterSrc = require('./filter-src');
const forEach = require('./for-each');
const forEachRight = require('./for-each-right');
const forWhile = require('./for-while');
const fromPairs = require('./from-pairs');
const getAt = require('./get-at');
const getAtPath = require('./get-at-path');
const gt = require('./gt');
const gte = require('./gte');
const has = require('./has');
const identity = require('./identity');
const inc = require('./inc');
const isArrayLike = require('./is-array-like');
const isArray = require('./is-array');
const isInteger = require('./is-integer');
const isNull = require('./is-null');
const isIterable = require('./is-iterable');
const isObject = require('./is-object');
const isPlaceholder = require('./is-placeholder');
const isPromise = require('./is-promise');
const isString = require('./is-string');
const len = require('./len');
const lt = require('./lt');
const lte = require('./lte');
const map = require('./map');
const mapSrc = require('./map-src');
const mapRight = require('./map-right');
const mapRightSrc = require('./map-right-src');
const max = require('./max');
const mean = require('./mean');
const median = require('./median');
const merge = require('./merge');
const min = require('./min');
const modOp = require('./mod-op');
const mod = require('./mod');
const multOp = require('./mult-op');
const mult = require('./mult');
const negate = require('./negate');
const none = require('./none');
const not = require('./not');
const orFn = require('./or-fn');
const orOp = require('./or-op');
const or = require('./or');
const pipe = require('./pipe');
const powOp = require('./pow-op');
const pow = require('./pow');
const range = require('./range');
const reduce = require('./reduce');
const reduceRight = require('./reduce-right');
const setAtPathMut = require('./set-at-path-mut');
const setAtPath = require('./set-at-path');
const setAt = require('./set-at');
const some = require('./some');
const subtractOp = require('./subtract-op');
const subtract = require('./subtract');
const sum = require('./sum');
const tags = require('./tags');
const zipObj = require('./zip-obj');
const zipWith = require('./zip-with');
const zip = require('./zip');
const _ = require('./_');

module.exports = {
  ...add,
  ...allowIndexes,
  ...allowIndexesSrc,
  ...always,
  ...and,
  ...andFn,
  ...andOp,
  ...approve,
  ...asArrayLike,
  ...atIndex,
  ...atPath,
  ...boolDict,
  ...clamp,
  ...concat,
  ...curry,
  ...curryN,
  ...curry2,
  ...curry3,
  ...dec,
  ...denyIndexesSrc,
  ...denyIndexes,
  ...divOp,
  ...div,
  ...every,
  ...filter,
  ...filterSrc,
  ...forEach,
  ...forEachRight,
  ...forWhile,
  ...fromPairs,
  ...getAt,
  ...getAtPath,
  ...gt,
  ...gte,
  ...has,
  ...identity,
  ...inc,
  ...isArrayLike,
  ...isArray,
  ...isInteger,
  ...isIterable,
  ...isNull,
  ...isObject,
  ...isPlaceholder,
  ...isPromise,
  ...isString,
  ...len,
  ...lt,
  ...lte,
  ...map,
  ...mapSrc,
  ...mapRight,
  ...mapRightSrc,
  ...max,
  ...mean,
  ...median,
  ...merge,
  ...min,
  ...modOp,
  ...mod,
  ...multOp,
  ...mult,
  ...negate,
  ...none,
  ...not,
  ...orFn,
  ...orOp,
  ...or,
  ...pipe,
  ...powOp,
  ...pow,
  ...range,
  ...reduce,
  ...reduceRight,
  ...setAtPathMut,
  ...setAtPath,
  ...setAt,
  ...some,
  ...subtractOp,
  ...subtract,
  ...sum,
  ...tags,
  ...zipObj,
  ...zipWith,
  ...zip,
  ..._,
  isFunction,
};
