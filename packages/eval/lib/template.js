const { evaluate } = require('./evaluator');

const dictionary = {};
const iteratorName = '_iterator_';

function getProgram(str) {
  const re = /{{\s*([^}]+)\s*}}/g;
  let lastIndex = 0;
  const programBlock = { type: 'program', blocks: [], parent: null };
  let currentBlock = programBlock;
  let slice;
  let match = re.exec(str);
  while (match != null) {
    slice = { type: 'literal', text: str.slice(lastIndex, match.index) };
    currentBlock.blocks.push(slice);
    const expression = match[1].trim();
    if (expression.startsWith('#')) {
      const block = {
        type: 'forEach',
        text: str.slice(match.index, match.index + match[0].length),
        value: expression.slice(1),
        blocks: [],
        parent: currentBlock,
      };
      currentBlock.blocks.push(block);
      currentBlock = block;
    } else if (expression.startsWith('/#')) {
      currentBlock = currentBlock.parent;
    } else {
      slice = {
        type: 'expression',
        text: str.slice(match.index, match.index + match[0].length),
        value: expression,
      };
      currentBlock.blocks.push(slice);
    }
    lastIndex = match.index + match[0].length;
    match = re.exec(str);
  }
  slice = { type: 'literal', text: str.slice(lastIndex) };
  if (slice.text) {
    currentBlock.blocks.push(slice);
  }
  return programBlock;
}

async function executeBlock(block, context) {
  if (block.type === 'forEach') {
    const value = await evaluate(block.value, context);
    if (Array.isArray(value)) {
      const result = [];
      for (let i = 0; i < value.length; i += 1) {
        const item = value[i];
        const itemContext = { ...item, _parent_: context, _current_: item };
        for (let j = 0; j < block.blocks.length; j += 1) {
          const child = block.blocks[j];
          // eslint-disable-next-line no-await-in-loop
          const val = await executeBlock(child, itemContext);
          result.push(val);
        }
      }
      return result.join('');
    }
    return '';
  }
  if (block.type === 'literal') {
    return block.text;
  }
  if (block.type === 'expression') {
    const value = await evaluate(block.value, context);
    return value !== null && value !== undefined ? value : '';
  }
  if (block.type === 'program') {
    const values = [];
    for (let i = 0; i < block.blocks.length; i += 1) {
      const child = block.blocks[i];
      // eslint-disable-next-line no-await-in-loop
      const val = await executeBlock(child, context);
      values.push(val);
    }
    return values.join('');
  }
  return '';
}

function processString(str, context) {
  if (dictionary[str] === undefined) {
    dictionary[str] = getProgram(str);
  }
  const program = dictionary[str];
  return executeBlock(program, context);
}

async function process(obj, context) {
  if (typeof obj === 'string') {
    return processString(obj, context);
  }
  if (Array.isArray(obj)) {
    const result = [];
    for (let i = 0; i < obj.length; i += 1) {
      const item = obj[i];
      if (
        item &&
        item[iteratorName] &&
        typeof item[iteratorName] === 'string' &&
        item[iteratorName].startsWith('#')
      ) {
        const iterable = context[item[iteratorName].slice(1)];
        for (let j = 0; j < iterable.length; j += 1) {
          const subitem = iterable[j];
          const itemContext = {
            ...subitem,
            _parent_: context,
            _current_: subitem,
          };
          // eslint-disable-next-line no-await-in-loop
          const subresult = await process(item, itemContext);
          delete subresult[iteratorName];
          result.push(subresult);
        }
      } else {
        // eslint-disable-next-line no-await-in-loop
        result.push(await process(item, context));
      }
    }
    return result;
  }
  if (obj !== null && typeof obj === 'object') {
    const keys = Object.keys(obj);
    const result = {};
    for (let i = 0; i < keys.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      result[keys[i]] = await process(obj[keys[i]], context);
    }
    return result;
  }
  return obj;
}

function compile(str) {
  return (context = {}) => process(str, context);
}

function template(str, context) {
  return compile(str)(context);
}

module.exports = {
  compile,
  template,
};
