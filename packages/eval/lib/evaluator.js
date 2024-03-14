const { Parser } = require('acorn');
const { generate } = require('escodegen');
const { ioc } = require('@ponzujs/core');
const {
  negate,
  approve,
  not,
  add,
  subtract,
  mod,
  div,
  mult,
  pow,
  map,
  mapSrc,
  mapRight,
  mapRightSrc,
  allowIndexes,
  allowIndexesSrc,
  denyIndexes,
  denyIndexesSrc,
  every,
  filter,
  filterSrc,
  forEach,
  forEachRight,
} = require('@ponzujs/fun');
const { Scope } = require('./scope');

const logger = ioc.get('logger');
const FAIL_RESULT = {};
const compile = (code) => `(async () => {\n${code}\n})();`;
const walkLiteral = (node) => node.value;
let walk;

async function walkVariableDeclarator(node, scope, kind = 'let') {
  scope.declare(node.id.name, kind === 'const');
  if (!node.init) {
    return undefined;
  }
  const value = await walk(node.init, scope);
  scope.set(node.id.name, value, true);
  return value;
}

async function walkVariableDeclaration(node, scope) {
  let result;
  for (let i = 0; i < node.declarations.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    result = await walkVariableDeclarator(
      node.declarations[i],
      scope,
      node.kind
    );
  }
  return result;
}

function operateValue(operator, leftValue, value) {
  switch (operator) {
    case '=':
      return value;
    case '+=':
      return add(leftValue, value);
    case '-=':
      return subtract(leftValue, value);
    case '*=':
      return mult(leftValue, value);
    case '/=':
      return div(leftValue, value);
    case '%=':
      return mod(leftValue, value);
    // eslint-disable-next-line
    case '|=': return leftValue | value;
    // eslint-disable-next-line
    case '&=': return leftValue & value;
    // eslint-disable-next-line
    case '^=': return leftValue ^ value;
    case '**=':
      return pow(leftValue, value);
    case '<<=':
      // eslint-disable-next-line
      return leftValue << value;
    case '&&=':
      // eslint-disable-next-line
      return leftValue && value;
    case '||=':
      // eslint-disable-next-line
      return leftValue || value;
    case '??=':
      // eslint-disable-next-line
      return leftValue ?? value;
    case '>>=':
      // eslint-disable-next-line
      return leftValue >> value;
    case '>>>=':
      // eslint-disable-next-line
      return leftValue >>> value;
    default:
      logger.warn(
        `Failed to walk assignment expression, operator is ${operator}`
      );
      return FAIL_RESULT;
  }
}

async function walkArrayPattern(leftNode, value, scope) {
  let j = 0;
  const result = [];
  for (let i = 0; i < leftNode.elements.length; i += 1) {
    const element = leftNode.elements[i];
    if (element) {
      if (element.type === 'Identifier') {
        if (!scope.has(element.name)) {
          scope.declare(element.name);
        }
        scope.set(element.name, value[j]);
        result.push(value[j]);
      } else if (element.type === 'RestElement') {
        if (!scope.has(element.argument.name)) {
          scope.declare(element.argument.name);
        }
        scope.set(element.argument.name, value.slice(j));
        result.push(scope.get(element.argument.name));
      }
    } else {
      result.push(null);
    }
    j += 1;
  }
  return result;
}

async function walkObjectExpression(node, scope) {
  const result = {};
  for (let i = 0, l = node.properties.length; i < l; i += 1) {
    const property = node.properties[i];
    // eslint-disable-next-line no-await-in-loop
    const value = await walk(property.value, scope);
    if (value === FAIL_RESULT) {
      return value;
    }
    result[property.key.value || property.key.name] = value;
  }
  return result;
}

async function walkArrayExpression(node, scope) {
  const result = [];
  for (let i = 0, l = node.elements.length; i < l; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const x = await walk(node.elements[i], scope);
    if (x === FAIL_RESULT) {
      return x;
    }
    result.push(x);
  }
  return result;
}

function walkSetIdentifier(node, scope, value) {
  scope.set(node.name, value);
  return value;
}

async function walkSetMember(node, scope, value) {
  const obj = await walk(node.object, scope);
  if (obj === FAIL_RESULT) {
    return FAIL_RESULT;
  }
  if (typeof obj === 'function') {
    logger.warn(`Failed to walk set member object, object type is function`);
    return FAIL_RESULT;
  }
  if (node.property.type === 'Identifier') {
    obj[node.property.name] = value;
    return value;
  }
  const prop = await walk(node.property, scope);
  if (prop === FAIL_RESULT) {
    return prop;
  }
  if (!obj) {
    logger.warn(`Failed to walk set member object, object is null`);
    return FAIL_RESULT;
  }
  obj[prop] = value;
  return value;
}

function walkSet(node, scope, value) {
  switch (node.type) {
    case 'Identifier':
      return walkSetIdentifier(node, scope, value);
    case 'MemberExpression':
      return walkSetMember(node, scope, value);
    default:
      logger.warn(`Failed to walk set, node type is ${node.type}`);
      return FAIL_RESULT;
  }
}

async function walkAssignmentExpression(node, scope) {
  const value = await walk(node.right, scope);
  if (value === FAIL_RESULT) {
    return value;
  }
  const leftNode = node.left;
  if (leftNode.type === 'ArrayPattern') {
    return walkArrayPattern(leftNode, value, scope);
  }
  const leftValue = await walk(leftNode, scope);
  if (leftValue === FAIL_RESULT) {
    return leftValue;
  }
  const result = operateValue(node.operator, leftValue, value);
  if (result === FAIL_RESULT) {
    return result;
  }
  await walkSet(node.left, scope, result);
  return result;
}

function walkIdentifier(node, scope) {
  if (!scope.has(node.name)) {
    scope.declare(node.name);
  }
  return scope.get(node.name);
}

async function walkNewExpression(node, scope) {
  const Clazz = await walk(node.callee, scope);
  const args = [];
  for (let i = 0, l = node.arguments.length; i < l; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const x = await walk(node.arguments[i], scope);
    args.push(x);
  }
  const result = new Clazz(...args);
  return result;
}

async function walkMemberExpression(node, scope) {
  const obj = await walk(node.object, scope);
  if (obj === FAIL_RESULT) {
    return FAIL_RESULT;
  }
  if (typeof obj === 'function') {
    logger.warn(`Failed to walk member object, object type is function`);
    return FAIL_RESULT;
  }
  if (node.property.type === 'Identifier') {
    if (!obj) {
      if (node.optional) {
        return undefined;
      }
      logger.warn(`Failed to walk member object, object is null`);
      return FAIL_RESULT;
    }
    return obj[node.property.name];
  }
  const prop = await walk(node.property, scope);
  if (prop === FAIL_RESULT) {
    return prop;
  }
  if (!obj) {
    logger.warn(`Failed to walk member object, object is null`);
    return FAIL_RESULT;
  }
  return obj[prop];
}

async function walkUnaryExpression(node, scope) {
  const { argument } = node;
  const value = await walk(argument, scope);
  switch (node.operator) {
    case '+':
      return approve(value);
    case '-':
      return negate(value);
    case '~': // bitwise NOT
      /* eslint-disable no-bitwise */
      return ~value;
    case '!':
      return not(value);
    default:
      logger.warn(`Unknown unary operator in walkUnary: ${node.operator}`);
      return FAIL_RESULT;
  }
}

async function walkBinaryExpression(node, scope) {
  const left = await walk(node.left, scope);
  if (left === FAIL_RESULT) {
    return left;
  }
  if (node.operator === '&&' && !left) {
    return false;
  }
  if (node.operator === '||' && left) {
    return left;
  }
  const right = await walk(node.right, scope);
  if (right === FAIL_RESULT) {
    return right;
  }
  switch (node.operator) {
    case '==':
      /* eslint-disable eqeqeq */
      return left == right;
    case '===':
      return left === right;
    case '!=':
      /* eslint-disable eqeqeq */
      return left != right;
    case '!==':
      return left !== right;
    case '**':
      return pow(left, right);
    case '+':
      return add(left, right);
    case '-':
      return subtract(left, right);
    case '*':
      return mult(left, right);
    case '/':
      return div(left, right);
    case '%':
      return mod(left, right);
    case '<':
      return left < right;
    case '<=':
      return left <= right;
    case '>':
      return left > right;
    case '>=':
      return left >= right;
    case '|':
      /* eslint-disable no-bitwise */
      return left | right;
    case '&':
      /* eslint-disable no-bitwise */
      return left & right;
    case '^':
      /* eslint-disable no-bitwise */
      return left ^ right;
    case '||':
      return left || right;
    case '&&':
      return left && right;
    case '<<':
      /* eslint-disable no-bitwise */
      return left << right;
    case '>>':
      /* eslint-disable no-bitwise */
      return left >> right;
    case '>>>':
      /* eslint-disable no-bitwise */
      return left >>> right;
    case '??':
      return left ?? right;
    default:
      logger.warn(`Unknown binary operator in walkBinary: ${node.operator}`);
      return FAIL_RESULT;
  }
}

function walkThis(node, scope) {
  return scope.get('this');
}

async function walkUpdateExpression(node, scope) {
  const value = await walk(node.argument, scope);
  if (value === FAIL_RESULT) {
    return FAIL_RESULT;
  }
  const newValue = node.operator === '++' ? value + 1 : value - 1;
  if (node.prefix) {
    await walkSet(node.argument, scope, newValue);
    return newValue;
  }
  await walkSet(node.argument, scope, newValue);
  return value;
}

async function walkFunctionExecution(node, parentScope, args) {
  const scope = new Scope({}, parentScope);
  for (let index = 0; index < node.params.length; index += 1) {
    const key = node.params[index];
    if (key.type === 'Identifier') {
      scope.declare(key.name);
      scope.set(key.name, args ? args[index] : undefined);
    } else if (key.type === 'AssignmentPattern') {
      scope.declare(key.left.name);
      scope.set(key.left.name, args ? args[index] : undefined);
      if (scope.get(key.left.name) === undefined) {
        // eslint-disable-next-line no-await-in-loop
        scope.set(key.left.name, await walk(key.right, scope));
      }
    }
  }
  const bodies = node.body.body;
  let value;
  for (let i = 0, l = bodies.length; i < l; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    value = await walk(bodies[i], scope);
    if (value === FAIL_RESULT) {
      return value;
    }
  }
  return value;
}

const defaultMembers = {
  map,
  mapSrc,
  mapRight,
  mapRightSrc,
  allowIndexes,
  allowIndexesSrc,
  denyIndexes,
  denyIndexesSrc,
  every,
  filter,
  filterSrc,
  forEach,
  forEachRight,
};

async function walkCallExpression(node, scope) {
  let callee = await walk(node.callee, scope);
  let calleeReplaced = false;
  if (
    !callee &&
    node.callee.type === 'MemberExpression' &&
    node.callee.property?.type === 'Identifier'
  ) {
    if (defaultMembers[node.callee.property.name]) {
      callee = defaultMembers[node.callee.property.name];
      calleeReplaced = true;
    }
  }
  if (
    !(
      typeof callee === 'function' ||
      (callee && callee.type === 'FunctionExpression')
    )
  ) {
    logger.warn(`Failed to walk call callee`);
    return FAIL_RESULT;
  }
  const ctx = node.callee.object
    ? await walk(node.callee.object, scope)
    : callee;
  if (ctx === FAIL_RESULT) {
    return ctx;
  }
  const args = [];
  for (let i = 0, l = node.arguments.length; i < l; i += 1) {
    const current = node.arguments[i];
    const isSpread = current.type === 'SpreadElement';
    // eslint-disable-next-line no-await-in-loop
    const x = await walk(isSpread ? current.argument : current, scope);
    if (x === FAIL_RESULT) {
      return x;
    }
    if (isSpread) {
      args.push(...x);
    } else {
      args.push(x);
    }
  }
  if (typeof callee === 'function') {
    return calleeReplaced ? callee(ctx, ...args) : callee.apply(ctx, args);
  }
  return walkFunctionExecution(callee, scope, args);
}

async function walkFunctionExpression(node, parentScope) {
  const scope = new Scope({}, parentScope);
  node.params.forEach((key) => {
    if (key.type === 'Identifier') {
      scope.declare(key.name);
      scope.set(key.name, undefined);
    }
  });
  const keys = Object.keys(scope.vars);
  const vals = keys.map((key) => scope.get(key));
  const unparsed = generate(node);
  // eslint-disable-next-line
  return Function(keys.join(', '), `return ${unparsed}`).apply(
    null,
    vals
  );
}

function walkReturnStatement(node, scope) {
  return walk(node.argument, scope);
}

function walkFunctionDeclaration(node, scope) {
  const fn = { ...node };
  fn.type = 'FunctionExpression';
  scope.declare(node.id.name, false);
  scope.set(node.id.name, fn);
}

async function walkConditionalExpression(node, scope) {
  const value = await walk(node.test, scope);
  if (value === FAIL_RESULT) {
    return value;
  }
  if (value) {
    return walk(node.consequent, scope);
  }
  return node.alternate ? walk(node.alternate, scope) : undefined;
}

async function walkBlockStatement(node, scope) {
  if (Array.isArray(node.body)) {
    let result;
    for (let i = 0; i < node.body.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      result = await walk(node.body[i], scope);
    }
    return result;
  }
  return walk(node.body, scope);
}

async function walkExpressionStatement(node, scope) {
  return walk(node.expression, scope);
}

async function walkTemplateLiteral(node, scope) {
  let str = '';
  for (let i = 0; i < node.expressions.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    str += await walk(node.quasis[i], scope);
    // eslint-disable-next-line no-await-in-loop
    str += await walk(node.expressions[i], scope);
  }
  return str;
}

function walkTemplateElement(node) {
  return node.value.cooked;
}

async function walkTaggedTemplateExpression(node, scope) {
  const tag = await walk(node.tag, scope);
  const { quasi } = node;
  const strings = [];
  for (let i = 0; i < quasi.quasis.length; i += 1) {
    const q = quasi.quasis[i];
    // eslint-disable-next-line no-await-in-loop
    const value = await walk(q, scope);
    strings.push(value);
  }
  const values = [];
  for (let i = 0; i < quasi.expressions.length; i += 1) {
    const q = quasi.expressions[i];
    // eslint-disable-next-line no-await-in-loop
    const value = await walk(q, scope);
    values.push(value);
  }
  // eslint-disable-next-line
  return tag.apply(null, [strings].concat(values));
}

async function walkChainExpression(node, scope) {
  return walk(node.expression, scope);
}

function walkAwaitExpression(node, context) {
  return walkCallExpression(node.argument, context);
}

walk = (node, scope) => {
  switch (node.type) {
    case 'ArrayExpression':
      return walkArrayExpression(node, scope);
    case 'ArrayPattern':
      return walkArrayPattern(node, scope);
    case 'ArrowFunctionExpression':
      return walkFunctionExpression(node, scope);
    case 'AssignmentExpression':
      return walkAssignmentExpression(node, scope);
    case 'AwaitExpression':
      return walkAwaitExpression(node, scope);
    case 'BinaryExpression':
      return walkBinaryExpression(node, scope);
    case 'BlockStatement':
      return walkBlockStatement(node, scope);
    case 'CallExpression':
      return walkCallExpression(node, scope);
    case 'ChainExpression':
      return walkChainExpression(node, scope);
    case 'ConditionalExpression':
      return walkConditionalExpression(node, scope);
    case 'ExpressionStatement':
      return walkExpressionStatement(node, scope);
    case 'FunctionDeclaration':
      return walkFunctionDeclaration(node, scope);
    case 'FunctionExpression':
      return walkFunctionExpression(node, scope);
    case 'Identifier':
      return walkIdentifier(node, scope);
    case 'IfStatement':
      return walkConditionalExpression(node, scope);
    case 'Literal':
      return walkLiteral(node, scope);
    case 'LogicalExpression':
      return walkBinaryExpression(node, scope);
    case 'MemberExpression':
      return walkMemberExpression(node, scope);
    case 'NewExpression':
      return walkNewExpression(node, scope);
    case 'ObjectExpression':
      return walkObjectExpression(node, scope);
    case 'ReturnStatement':
      return walkReturnStatement(node, scope);
    case 'TaggedTemplateExpression':
      return walkTaggedTemplateExpression(node, scope);
    case 'TemplateElement':
      return walkTemplateElement(node, scope);
    case 'TemplateLiteral':
      return walkTemplateLiteral(node, scope);
    case 'ThisExpression':
      return walkThis(node, scope);
    case 'UnaryExpression':
      return walkUnaryExpression(node, scope);
    case 'UpdateExpression':
      return walkUpdateExpression(node, scope);
    case 'VariableDeclaration':
      return walkVariableDeclaration(node, scope);
    case 'VariableDeclarator':
      return walkVariableDeclarator(node, scope);
    default:
      console.log(node);
      logger.warn(`Failed to walk node, type is ${node.type}`);
      return FAIL_RESULT;
  }
};

async function evaluate(str, srcScope) {
  const scope = srcScope instanceof Scope ? srcScope : new Scope(srcScope);
  const compiled = Parser.parse(compile(str), { ecmaVersion: 'latest' });
  const { body } = compiled.body[0].expression.callee.body;
  const result = [];
  for (let i = 0; i < body.length; i += 1) {
    const current = body[i];
    const expression = current.expression ? current.expression : current;
    // eslint-disable-next-line no-await-in-loop
    const value = await walk(expression, scope);
    result.push(value === FAIL_RESULT ? undefined : value);
  }
  scope.writeSource();
  return result && result.length ? result[result.length - 1] : undefined;
}

module.exports = {
  evaluate,
};
