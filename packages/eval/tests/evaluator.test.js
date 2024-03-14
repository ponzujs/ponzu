const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { evaluate, Scope } = require('../lib');
const Vector = require('./vector');

describe('Evaluator', () => {
  it('should create a variable with let without initialization', async () => {
    const script = 'let a;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: undefined });
  });
  it('should create a variable with var without initialization', async () => {
    const script = 'var a;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: undefined });
  });
  it('should throw an exception if create a constant without initialization', async () => {
    const script = 'const a;';
    const scope = new Scope();
    expect(() => evaluate(script, scope)).toThrow('Unexpected token (2:7)');
  });
  it('should create a variable with let', async () => {
    const script = 'let a = 3;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 3 });
  });
  it('should create a variable with var', async () => {
    const script = 'var a = 3;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 3 });
  });
  it('should create a constant', async () => {
    const script = 'const a = 3;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: true, value: 3 });
  });
  it('should create a variable by direct assignment', async () => {
    const script = 'a = 3;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 3 });
  });
  it('should allow to change value of a non initialized let', async () => {
    const script = 'let a; a = 3;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 3 });
  });
  it('should allow to change value of an initialized let', async () => {
    const script = 'let a = 8; a = 3;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 3 });
  });
  it('should allow to change value of a non initialized var', async () => {
    const script = 'var a; a = 3;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 3 });
  });
  it('should allow to change value of an initialized var', async () => {
    const script = 'var a = 8; a = 3;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 3 });
  });
  it('should allow to change value of a variable created by direct assignment', async () => {
    const script = 'a = 8; a = 3;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 3 });
  });
  it('should throw an exception if trying to assign a constant', async () => {
    const script = 'const a = 8; a = 3;';
    const scope = new Scope();
    expect(() => evaluate(script, scope)).toThrow(
      'Cannot assign to constant variable a'
    );
  });
  it('should allow to initialize a variable to an object', async () => {
    const script = 'let a = { b: 7 };';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: { b: 7 } });
  });
  it('should allow to initialize a variable to an array', async () => {
    const script = 'let a = [1, 2, 3];';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: [1, 2, 3] });
  });
  it('should allow to initialize a variable to a more complex object', async () => {
    const script = 'let a = { b: 7, c: [1,2,3] };';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({
      constant: false,
      value: { b: 7, c: [1, 2, 3] },
    });
  });
  it('should allow to initialize a variable to the instance of a class', async () => {
    const script = 'let a = new Vector([1, 2, 3]);';
    const scope = new Scope({ Vector });
    await evaluate(script, scope);
    expect(scope.vars.a.value).toBeInstanceOf(Vector);
    expect(scope.vars.a.value.arr).toEqual([1, 2, 3]);
  });
  it('should allow to modify a member of an array', async () => {
    const script = 'let a = [1, 2, 3]; a[1] = 7;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: [1, 7, 3] });
  });
  it('Should evaluate a member expression of a complex object with arrays', async () => {
    const script = 'const a = { b: 7, c: [{ d: 8 }] }; b = a.c[0].d;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.b).toEqual({ constant: false, value: 8 });
  });
  it('should allow to modify a member of an object', async () => {
    const script = 'const a = { b: 7, c: [{ d: 8 }] }; a.c[0].d = 3;';
    const scope = new Scope();
    await evaluate(script, scope);
    expect(scope.vars.a).toEqual({
      constant: true,
      value: { b: 7, c: [{ d: 3 }] },
    });
  });
  it('should do an unary + operation over a literal', async () => {
    const script = '+17';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(17);
  });
  it('should do an unary - operation over a literal', async () => {
    const script = '-17';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(-17);
  });
  it('should do an unary ~ operation over a literal', async () => {
    const script = '~17';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(-18);
  });
  it('should do an unary ! operation over a literal', async () => {
    const script = '!false';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(true);
  });
  it('should do an unary + operation over an identifier', async () => {
    const script = 'a = 17; +a';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(17);
  });
  it('should do an unary - operation over an identifier', async () => {
    const script = 'a = 17; -a';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(-17);
  });
  it('should do an unary ~ operation over an identifier', async () => {
    const script = 'a = 17; ~a';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(-18);
  });
  it('should do an unary ! operation over an identifier', async () => {
    const script = 'a = false; !a';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(true);
  });
  it('should do an unary + operation over a member of array', async () => {
    const script = 'a = [1, 2, 17]; +a[2]';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(17);
  });
  it('should do an unary - operation over a member of array', async () => {
    const script = 'a = [1, 2, 17]; -a[2]';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(-17);
  });
  it('should do an unary ~ operation over a member of array', async () => {
    const script = 'a = [1,2,17]; ~a[2]';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(-18);
  });
  it('should do an unary ! operation over a member of array', async () => {
    const script = 'a = [1,2,false]; !a[2]';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(true);
  });
  it('should do an unary + operation over a member of object', async () => {
    const script = 'a = { b: 17 }; +a.b';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(17);
  });
  it('should do an unary - operation over a member of object', async () => {
    const script = 'a = { b: 17 }; -a.b';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(-17);
  });
  it('should do an unary ~ operation over a member of object', async () => {
    const script = 'a = { b: 17 }; ~a.b';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(-18);
  });
  it('should do an unary ! operation over a member of object', async () => {
    const script = 'a = { b: false }; !a.b';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual(true);
  });
  it('should do an unary + operation over an instance', async () => {
    const script = 'a = new Vector([1, 2, 3]); +a';
    const scope = new Scope({ Vector });
    const result = await evaluate(script, scope);
    expect(result).toBeInstanceOf(Vector);
    expect(result.arr).toEqual([1, 2, 3]);
    expect(result).toNotBe(scope.vars.a.value);
  });
  it('should do an unary + operation over a string', async () => {
    const script = 'a = "hello"; +a';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(result).toEqual('hello');
  });
  it('should do an unary - operation over an instance with NEGATE_TAG', async () => {
    const script = 'a = new Vector([1, 2, 3]); -a';
    const scope = new Scope({ Vector });
    const result = await evaluate(script, scope);
    expect(result).toBeInstanceOf(Vector);
    expect(result.arr).toEqual([-1, -2, -3]);
  });
  it('should do += assignment', async () => {
    const script = 'a = 1; a += 7;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 8 });
    expect(result).toEqual(8);
  });
  it('should do -= assignment', async () => {
    const script = 'a = 1; a -= 7;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: -6 });
    expect(result).toEqual(-6);
  });
  it('should do *= assignment', async () => {
    const script = 'a = 3; a *= 7;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 21 });
    expect(result).toEqual(21);
  });
  it('should do /= assignment', async () => {
    const script = 'a = 3; a /= 2;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 1.5 });
    expect(result).toEqual(1.5);
  });
  it('should do %= assignment', async () => {
    const script = 'a = 3; a %= 2;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 1 });
    expect(result).toEqual(1);
  });
  it('should do |= assignment', async () => {
    const script = 'a = 3; a |= 9;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 11 });
    expect(result).toEqual(11);
  });
  it('should do &= assignment', async () => {
    const script = 'a = 12; a &= 5;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 4 });
    expect(result).toEqual(4);
  });
  it('should do ^= assignment', async () => {
    const script = 'a = 12; a ^= 5;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 9 });
    expect(result).toEqual(9);
  });
  it('should do **= assignment', async () => {
    const script = 'a = 2; a **= 8;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 256 });
    expect(result).toEqual(256);
  });
  it('should do <<= assignment', async () => {
    const script = 'a = 5; a <<= 2;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 20 });
    expect(result).toEqual(20);
  });
  it('should do &&= assignment', async () => {
    const script = 'a = 1; b = 0; a &&= 2; b &&= 2;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 2 });
    expect(scope.vars.b).toEqual({ constant: false, value: 0 });
    expect(result).toEqual(0);
  });
  it('should do ||= assignment, skipping if already haves a value', async () => {
    const script = 'a = { duration: 50 }; a.duration ||= 10;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: { duration: 50 } });
    expect(result).toEqual(50);
  });
  it('should do ||= assignment, assigning if value is 0', async () => {
    const script = 'a = { duration: 0 }; a.duration ||= 10;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: { duration: 10 } });
    expect(result).toEqual(10);
  });
  it('should do ||= assignment, assigning if member does not exists', async () => {
    const script = 'a = {}; a.duration ||= 10;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: { duration: 10 } });
    expect(result).toEqual(10);
  });
  it('should do ??= assignment, skipping if already haves a value', async () => {
    const script = 'a = { duration: 50 }; a.duration ??= 10;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: { duration: 50 } });
    expect(result).toEqual(50);
  });
  it('should do ??= assignment, skipping if value is 0', async () => {
    const script = 'a = { duration: 0 }; a.duration ??= 10;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: { duration: 0 } });
    expect(result).toEqual(0);
  });
  it('should do ??= assignment, assigning if member does not exists', async () => {
    const script = 'a = {}; a.duration ??= 10;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: { duration: 10 } });
    expect(result).toEqual(10);
  });
  it('should do >>= assignment', async () => {
    const script = 'a = -5; a >>= 2;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: -2 });
    expect(result).toEqual(-2);
  });
  it('should do >>>= assignment', async () => {
    const script = 'a = -5; a >>>= 2;';
    const scope = new Scope();
    const result = await evaluate(script, scope);
    expect(scope.vars.a).toEqual({ constant: false, value: 1073741822 });
    expect(result).toEqual(1073741822);
  });
  it('should do == comparison', async () => {
    let result = await evaluate('1 == 1');
    expect(result).toEqual(true);
    result = await evaluate('2 == 1');
    expect(result).toEqual(false);
  });
  it('should do === comparison', async () => {
    let result = await evaluate('1 === 1');
    expect(result).toEqual(true);
    result = await evaluate('2 === 1');
    expect(result).toEqual(false);
  });
  it('should do != comparison', async () => {
    let result = await evaluate('1 != 1');
    expect(result).toEqual(false);
    result = await evaluate('2 != 1');
    expect(result).toEqual(true);
  });
  it('should do !== comparison', async () => {
    let result = await evaluate('1 !== 1');
    expect(result).toEqual(false);
    result = await evaluate('2 !== 1');
    expect(result).toEqual(true);
  });
  it('should do + operation', async () => {
    const result = await evaluate('1 + 2');
    expect(result).toEqual(3);
  });
  it('should do + operation for two vectors', async () => {
    const a = new Vector([1, 2, 3, 4, 5]);
    const b = new Vector([2, 4, 6, 8, 10]);
    const result = await evaluate('a + b', { a, b });
    expect(result.arr).toEqual([3, 6, 9, 12, 15]);
  });
  it('should do - operation', async () => {
    const result = await evaluate('1 - 4');
    expect(result).toEqual(-3);
  });
  it('should do - operation for two vectors', async () => {
    const a = new Vector([1, -1, 6, 8, 10]);
    const b = new Vector([1, 2, 3, 4, 5]);
    const result = await evaluate('a - b', { a, b });
    expect(result.arr).toEqual([0, -3, 3, 4, 5]);
  });
  it('should do ** operation', async () => {
    const result = await evaluate('2 ** 7');
    expect(result).toEqual(128);
  });
  it('should do * operation', async () => {
    const result = await evaluate('2 * 7');
    expect(result).toEqual(14);
  });
  it('should do / operation', async () => {
    const result = await evaluate('7 / 2');
    expect(result).toEqual(3.5);
  });
  it('should do % operation', async () => {
    const result = await evaluate('8 % 3');
    expect(result).toEqual(2);
  });
  it('should do < comparison', async () => {
    let result = await evaluate('1 < 2');
    expect(result).toEqual(true);
    result = await evaluate('2 < 1');
    expect(result).toEqual(false);
  });
  it('should do <= comparison', async () => {
    let result = await evaluate('1 <= 2');
    expect(result).toEqual(true);
    result = await evaluate('2 <= 1');
    expect(result).toEqual(false);
    result = await evaluate('2 <= 2');
    expect(result).toEqual(true);
  });
  it('should do > comparison', async () => {
    let result = await evaluate('1 > 2');
    expect(result).toEqual(false);
    result = await evaluate('2 > 1');
    expect(result).toEqual(true);
  });
  it('should do >= comparison', async () => {
    let result = await evaluate('1 >= 2');
    expect(result).toEqual(false);
    result = await evaluate('2 >= 1');
    expect(result).toEqual(true);
    result = await evaluate('2 >= 2');
    expect(result).toEqual(true);
  });
  it('should do | operation', async () => {
    const result = await evaluate('9 | 3');
    expect(result).toEqual(11);
  });
  it('should do & operation', async () => {
    const result = await evaluate('12 & 5');
    expect(result).toEqual(4);
  });
  it('should do ^ operation', async () => {
    const result = await evaluate('12 ^ 5');
    expect(result).toEqual(9);
  });
  it('should do || operation', async () => {
    let result = await evaluate('false || true');
    expect(result).toEqual(true);
    result = await evaluate('true || false');
    expect(result).toEqual(true);
    result = await evaluate('false || false');
    expect(result).toEqual(false);
    result = await evaluate('undefined || "something"');
    expect(result).toEqual('something');
    result = await evaluate('a || b', { a: 0, b: 7 });
    expect(result).toEqual(7);
    result = await evaluate('a || b', { a: -1, b: 7 });
    expect(result).toEqual(-1);
  });
  it('should do && operation', async () => {
    let result = await evaluate('false && true');
    expect(result).toEqual(false);
    result = await evaluate('true && false');
    expect(result).toEqual(false);
    result = await evaluate('true && true');
    expect(result).toEqual(true);
  });
  it('should do << operation', async () => {
    const result = await evaluate('5 << 2');
    expect(result).toEqual(20);
  });
  it('should do >> operation', async () => {
    const result = await evaluate('20 >> 2');
    expect(result).toEqual(5);
  });
  it('should do >>> operation', async () => {
    const result = await evaluate('-5 >>> 2');
    expect(result).toEqual(1073741822);
  });
  it('should do ?? operation', async () => {
    let result = await evaluate('1 ?? 2');
    expect(result).toEqual(1);
    result = await evaluate('undefined ?? 2');
    expect(result).toEqual(2);
    result = await evaluate('null ?? 2');
    expect(result).toEqual(2);
    result = await evaluate('0 ?? 2');
    expect(result).toEqual(0);
  });
  it('should return NaN if left term is undefined in a + operation', async () => {
    const result = await evaluate('c + a', { a: 1, b: 2 });
    expect(result).toBeNaN();
  });
  it('should return NaN if right term is undefined in a + operation', async () => {
    const result = await evaluate('a + c', { a: 1, b: 2 });
    expect(result).toBeNaN();
  });
  it('should be able to operate with arrays', async () => {
    const result = await evaluate('c = [a,b]; d = c[0] + c[1];', {
      a: 12,
      b: 2,
    });
    expect(result).toEqual(14);
  });
  it('should return undefined if an array member does not exists', async () => {
    const result = await evaluate('c = [a, b]; d = e[0] + e[1];', {
      a: 12,
      b: 2,
    });
    expect(result).toBeUndefined();
  });
  it('should return NaN when then member cannot be resolved inside an operation', async () => {
    const result = await evaluate('c = [a, b, d]; e = c[0] + c[1] + c[2];', {
      a: 12,
      b: 2,
    });
    expect(result).toBeNaN();
  });
  it('should be able to work with "this"', async () => {
    const result = await evaluate('this.a;', { this: { a: 17 } });
    expect(result).toEqual(17);
  });
  it('should operate ++', async () => {
    const scope = new Scope({ a: 17 });
    let result = await evaluate('a++;', scope);
    expect(result).toEqual(17);
    expect(scope.vars.a).toEqual({ constant: false, value: 18 });
    result = await evaluate('++a;', scope);
    expect(result).toEqual(19);
    expect(scope.vars.a).toEqual({ constant: false, value: 19 });
  });
  it('should operate --', async () => {
    const scope = new Scope({ a: 17 });
    let result = await evaluate('a--;', scope);
    expect(result).toEqual(17);
    expect(scope.vars.a).toEqual({ constant: false, value: 16 });
    result = await evaluate('--a;', scope);
    expect(result).toEqual(15);
    expect(scope.vars.a).toEqual({ constant: false, value: 15 });
  });
  it('should evaluate map function of array', async () => {
    const scope = new Scope();
    const result = await evaluate(
      '[1, 2, 3].map(function(n) { return n * 2 })',
      scope
    );
    expect(result).toEqual([2, 4, 6]);
  });
  it('should evaluate map of objects', async () => {
    const scope = new Scope();
    const result = await evaluate(
      '({a: 1, b: 2, c: 3}).map(function(n) { return n * 2 })',
      scope
    );
    expect(result).toEqual([2, 4, 6]);
  });
  it('should evaluate map of strings', async () => {
    const scope = new Scope();
    const result = await evaluate(
      '"hola".map(function(n) { return n.toUpperCase() })',
      scope
    );
    expect(result).toEqual(['H', 'O', 'L', 'A']);
  });
  it('shouuld evaluate mapSrc of objecs', async () => {
    const scope = new Scope();
    const result = await evaluate(
      '({a: 1, b: 2, c: 3}).mapSrc(function(n) { return n * 2 })',
      scope
    );
    expect(result).toEqual({ a: 2, b: 4, c: 6 });
  });
  it('should evaluate mapSrc of strings', async () => {
    const scope = new Scope();
    const result = await evaluate(
      '"hola".mapSrc(function(n) { return n.toUpperCase() })',
      scope
    );
    expect(result).toEqual('HOLA');
  });
  it('should evaluate mapRight of arrays', async () => {
    const scope = new Scope();
    const result = await evaluate(
      '[1, 2, 3].mapRight(function(n) { return n * 2 })',
      scope
    );
    expect(result).toEqual([6, 4, 2]);
  });
  it('should evaluate mapRight of objects', async () => {
    const scope = new Scope();
    const result = await evaluate(
      '({a: 1, b: 2, c: 3}).mapRight(function(n) { return n * 2 })',
      scope
    );
    expect(result).toEqual([6, 4, 2]);
  });
  it('should evaluate mapRight of strings', async () => {
    const scope = new Scope();
    const result = await evaluate(
      '"hola".mapRight(function(n) { return n.toUpperCase() })',
      scope
    );
    expect(result).toEqual(['A', 'L', 'O', 'H']);
  });
  it('should evaluate mapRightSrc of objects', async () => {
    const scope = new Scope();
    const result = await evaluate(
      '({a: 1, b: 2, c: 3}).mapRightSrc(function(n) { return n * 2 })',
      scope
    );
    expect(result).toEqual({ a: 2, b: 4, c: 6 });
  });
  it('should evaluate mapRightSrc of strings', async () => {
    const scope = new Scope();
    const result = await evaluate(
      '"hola".mapRightSrc(function(n) { return n.toUpperCase() })',
      scope
    );
    expect(result).toEqual('ALOH');
  });
  it('should evaluate more complex expressions with functions provided in the scope', async () => {
    const context = { n: 6, foo: (x) => x * 100, obj: { x: { y: 555 } } };
    const question = '3+4*foo(3+5) - obj[""+"x"].y';
    const answer = await evaluate(question, context);
    expect(answer).toEqual(2648);
  });
  it('should allow to define and execute functions', async () => {
    const script = `
    function splitString(str) {
      return str.split(/\\r?\\n/);
    }
    const input = 'hola\\nadios';
    const output = splitString(input);
    output;
    `;
    const result = await evaluate(script);
    expect(result).toEqual(['hola', 'adios']);
  });
  it('should evaluate a ternary operator', async () => {
    const context = { a: 12, b: 2 };
    const questionTrue = 'b === 2 ? a-- : a++;';
    await evaluate(questionTrue, context);
    expect(context.a).toEqual(11);
    context.a = 12;
    const questionFalse = 'b < 2 ? a-- : a++;';
    await evaluate(questionFalse, context);
    expect(context.a).toEqual(13);
  });
  it('should return correct ternary if some term is not defined', async () => {
    const context = { a: 12, b: 2 };
    const questionTrue = 'c === 2 ? --a : ++a;';
    const result = await evaluate(questionTrue, context);
    expect(result).toEqual(13);
  });
  it('Should evaluate ArrayPattern', async () => {
    const context = {};
    const question = '[a, b, c, d, e] = [1, 2, 3, 4, 5];';
    const answer = await evaluate(question, context);
    expect(context.a).toEqual(1);
    expect(context.b).toEqual(2);
    expect(context.c).toEqual(3);
    expect(context.d).toEqual(4);
    expect(context.e).toEqual(5);
    expect(answer).toEqual([1, 2, 3, 4, 5]);
  });
  it('Should evaluate ArrayPattern with less elements at left', async () => {
    const context = {};
    const question = '[a, b, c, d] = [1, 2, 3, 4, 5];';
    const answer = await evaluate(question, context);
    expect(context.a).toEqual(1);
    expect(context.b).toEqual(2);
    expect(context.c).toEqual(3);
    expect(context.d).toEqual(4);
    expect(answer).toEqual([1, 2, 3, 4]);
  });
  it('Should evaluate ArrayPattern with less elements at right', async () => {
    const context = {};
    const question = '[a, b, c, d, e, f] = [1, 2, 3, 4, 5];';
    const answer = await evaluate(question, context);
    expect(context.a).toEqual(1);
    expect(context.b).toEqual(2);
    expect(context.c).toEqual(3);
    expect(context.d).toEqual(4);
    expect(context.e).toEqual(5);
    expect(context.f).toBeUndefined();
    expect(answer).toEqual([1, 2, 3, 4, 5, undefined]);
  });
  it('Should evaluate ArrayPattern with an slice operator ', async () => {
    const context = {};
    const question = '[a, b, ...rest] = [1, 2, 3, 4, 5];';
    const answer = await evaluate(question, context);
    expect(context.a).toEqual(1);
    expect(context.b).toEqual(2);
    expect(context.rest).toEqual([3, 4, 5]);
    expect(answer).toEqual([1, 2, [3, 4, 5]]);
  });
  it('Should evaluate ArrayPattern without some element ', async () => {
    const context = {};
    const question = '[a, , ...rest] = [1, 2, 3, 4, 5];';
    const answer = await evaluate(question, context);
    expect(context.a).toEqual(1);
    expect(context.rest).toEqual([3, 4, 5]);
    expect(answer).toEqual([1, null, [3, 4, 5]]);
  });
  it('Should resolve if-then-else expressions (then path)', async () => {
    const context = { a: 12, b: 2 };
    const question = 'if (a > 10) { c = 7; b++ } else { c = 3; b-- }';
    const result = await evaluate(question, context);
    expect(result).toEqual(2);
    expect(context.c).toEqual(7);
    expect(context.b).toEqual(3);
  });
  it('Should resolve if-then-else expressions (else path)', async () => {
    const context = { a: 12, b: 2 };
    const question = 'if (a < 10) { c = 7; b++ } else { c = 3; b-- }';
    const result = await evaluate(question, context);
    expect(result).toEqual(2);
    expect(context.c).toEqual(3);
    expect(context.b).toEqual(1);
  });
  it('Should resolve if-then expressions (then path)', async () => {
    const context = { a: 12, b: 2 };
    const question = 'if (a > 10) { c = 7; b++ }; d = 1;';
    const result = await evaluate(question, context);
    expect(result).toEqual(1);
    expect(context.c).toEqual(7);
    expect(context.b).toEqual(3);
  });
  it('Should resolve if-then expressions (else path)', async () => {
    const context = { a: 12, b: 2 };
    const question = 'if (a < 10) { c = 7; b++ }; d = 1;';
    const result = await evaluate(question, context);
    expect(result).toEqual(1);
    expect(context.c).toBeUndefined();
    expect(context.b).toEqual(2);
  });
  it('should allow to define and execute arrow functions', async () => {
    const script = `
    const splitString = (str) => str.split(/\\r?\\n/);
    const input = 'hola\\nadios';
    const output = splitString(input);
    output;
    `;
    const result = await evaluate(script);
    expect(result).toEqual(['hola', 'adios']);
  });
  it('should allow to assign default values to arguments of functions', async () => {
    const script = `
    function fn(a, b = 7) {
      return a + b;
    }
    const output = fn(2);
    output;
    `;
    const result = await evaluate(script);
    expect(result).toEqual(9);
  });
  it('should allow to assign default values to arguments of arrow functions', async () => {
    const script = `
    const fn = (a, b = 7) => a + b;
    const output = fn(2);
    output;
    `;
    const result = await evaluate(script);
    expect(result).toEqual(9);
  });
  it('should be able to create new instances', async () => {
    const script = `
    new Date('2020-01-01');
    `;
    const result = await evaluate(script, { Date });
    expect(result).toEqual(new Date('2020-01-01'));
  });
  it('should evaluate a template literal', async () => {
    const context = { a: 12, b: 2 };
    // eslint-disable-next-line
    const question = '`${a}-${b}`';
    const result = await evaluate(question, context);
    expect(result).toEqual('12-2');
  });
  it('should evaluate a tagged template literal', async () => {
    const context = {
      a: 12,
      b: 2,
      tag: (literals, a, b) => `${literals.join('-')}-${a}-${b}`,
    };
    // eslint-disable-next-line
    const question = "tag`Hello ${a}hi${b}`";
    const result = await evaluate(question, context);
    expect(result).toEqual('Hello -hi--12-2');
  });
  it('should return undefined if no term is provided', async () => {
    const result = await evaluate('', {});
    expect(result).toBeUndefined();
  });
  it('should allow optional chaining', async () => {
    const context = { a: { b: { c: 7 } } };
    const result = await evaluate('a?.b?.c', context);
    expect(result).toEqual(7);
  });
  it('should evaluate allowIndexes of an array', async () => {
    const context = { a: [1, 2, 3] };
    const result = await evaluate('a.allowIndexes([0,2])', context);
    expect(result).toEqual([1, 3]);
  });
  it('should evaluate allowIndexes of an object', async () => {
    const context = { a: 1, b: 2, c: 3 };
    const result = await evaluate(
      '({a, b, c}).allowIndexes(["a","c"])',
      context
    );
    expect(result).toEqual([1, 3]);
  });
  it('should evaluate allowIndexes of a string', async () => {
    const context = { a: 'hola' };
    const result = await evaluate('a.allowIndexes([0,2])', context);
    expect(result).toEqual(['h', 'l']);
  });
  it('should evaluate allowIndexesSrc of an object', async () => {
    const context = { a: 1, b: 2, c: 3 };
    const result = await evaluate(
      '({a, b, c}).allowIndexesSrc(["a","c"])',
      context
    );
    expect(result).toEqual({ a: 1, c: 3 });
  });
  it('should evaluate allowIndexesSrc of a string', async () => {
    const context = { a: 'hola' };
    const result = await evaluate('a.allowIndexesSrc([0,2])', context);
    expect(result).toEqual('hl');
  });
  it('should evaluate denyIndexes of an array', async () => {
    const context = { a: [1, 2, 3] };
    const result = await evaluate('a.denyIndexes([0,2])', context);
    expect(result).toEqual([2]);
  });
  it('should evaluate denyIndexes of an object', async () => {
    const context = { a: 1, b: 2, c: 3 };
    const result = await evaluate(
      '({a, b, c}).denyIndexes(["a","c"])',
      context
    );
    expect(result).toEqual([2]);
  });
  it('should evaluate denyIndexes of a string', async () => {
    const context = { a: 'hola' };
    const result = await evaluate('a.denyIndexes([0,2])', context);
    expect(result).toEqual(['o', 'a']);
  });
  it('should evaluate denyIndexesSrc of an object', async () => {
    const context = { a: 1, b: 2, c: 3 };
    const result = await evaluate(
      '({a, b, c}).denyIndexesSrc(["a","c"])',
      context
    );
    expect(result).toEqual({ b: 2 });
  });
  it('should evaluate denyIndexesSrc of a string', async () => {
    const context = { a: 'hola' };
    const result = await evaluate('a.denyIndexesSrc([0,2])', context);
    expect(result).toEqual('oa');
  });
  it('should evaluate every of an array', async () => {
    const context = { a: [1, 2, 3] };
    let result = await evaluate('a.every((x) => x > 0)', context);
    expect(result).toEqual(true);
    result = await evaluate('a.every((x) => x > 1)', context);
    expect(result).toEqual(false);
  });
  it('should evaluate every of an object', async () => {
    const context = { a: { b: 1, c: 2, d: 3 } };
    let result = await evaluate('a.every((x) => x > 0)', context);
    expect(result).toEqual(true);
    result = await evaluate('a.every((x) => x > 1)', context);
    expect(result).toEqual(false);
  });
  it('should evaluate every of a string', async () => {
    const context = { a: 'hola' };
    let result = await evaluate(
      'a.every((x) => x === x.toLowerCase())',
      context
    );
    expect(result).toEqual(true);
    context.a = 'hOla';
    result = await evaluate('a.every((x) => x === x.toLowerCase())', context);
    expect(result).toEqual(false);
  });
  it('should evaluate filter of an array', async () => {
    const context = { a: [1, 2, 3] };
    const result = await evaluate('a.filter((x) => x > 1)', context);
    expect(result).toEqual([2, 3]);
  });
  it('should evaluate filter of an object', async () => {
    const context = { a: { b: 1, c: 2, d: 3 } };
    const result = await evaluate('a.filter((x) => x > 1)', context);
    expect(result).toEqual([2, 3]);
  });
  it('should evaluate filter of a string', async () => {
    const context = { a: 'hOLa' };
    const result = await evaluate(
      'a.filter((x) => x === x.toLowerCase())',
      context
    );
    expect(result).toEqual(['h', 'a']);
  });
  it('should evaluate filterSrc of an object', async () => {
    const context = { a: { b: 1, c: 2, d: 3 } };
    const result = await evaluate('a.filterSrc((x) => x > 1)', context);
    expect(result).toEqual({ c: 2, d: 3 });
  });
  it('should evaluate filterSrc of a string', async () => {
    const context = { a: 'hOLa' };
    const result = await evaluate(
      'a.filterSrc((x) => x === x.toLowerCase())',
      context
    );
    expect(result).toEqual('ha');
  });
});
