const { describe, it } = require('node:test');
const { expect } = require('@ponzujs/core');
const { compile, template } = require('../lib');

const deepContext = {
  name: 'Products',
  category: 'something',
  products: [
    {
      code: 'PR1',
      name: 'Product 1',
      price: 100,
      parts: ['a', 'b', 'c'],
    },
    {
      code: 'PR2',
      name: 'Product 2',
      price: 200,
      parts: ['d', 'e', 'f'],
    },
    {
      code: 'PR3',
      name: 'Product 3',
      price: 300,
      parts: ['g', 'h', 'i'],
    },
  ],
};

describe('Compile', () => {
  describe('compile', () => {
    it('Should return a function', async () => {
      const actual = await compile(`Hello {{ something }}`);
      expect(actual).toBeInstanceOf(Function);
    });
  });

  describe('execute', () => {
    it('Should return the same string if no variables', async () => {
      const answer = await compile('Hello')();
      expect(answer).toEqual('Hello');
    });
    it('Should return input if is not string, array or object', async () => {
      const answer = await compile(7)();
      expect(answer).toEqual(7);
    });
    it('Should replace variables from the context', async () => {
      const context = {
        name: 'Jesus',
        a: 43,
      };
      const answer = await compile('Hello {{ name }} {{ a }}')(context);
      expect(answer).toEqual('Hello Jesus 43');
    });
    it('Should store strings in dictionary when compiled', async () => {
      const context = {
        name: 'Jesus',
        a: 43,
      };
      const answer = await compile('Hello {{ name }} {{ a }}')(context);
      expect(answer).toEqual('Hello Jesus 43');
      const answer2 = await compile('Hello {{ name }} {{ a }}')(context);
      expect(answer2).toEqual('Hello Jesus 43');
    });
    it('Should be able to call functions of the context', async () => {
      const context = {
        name: 'Jesus',
        a: 43,
        double: (x) => x * 2,
      };
      const answer = await compile('Hello {{ name }} {{ double(a) }}')(context);
      expect(answer).toEqual('Hello Jesus 86');
    });
    it('Should be able to do operations with variables of the context', async () => {
      const context = {
        name: 'Jesus',
        a: 43,
        b: 10,
        double: (x) => x * 2,
      };
      const answer = await compile('Hello {{ name }} {{ double(a + b) }}')(
        context
      );
      expect(answer).toEqual('Hello Jesus 106');
    });
    it('Should be able to process arrays', async () => {
      const context = {
        name: 'Jesus',
        a: 43,
        b: 10,
        double: (x) => x * 2,
      };
      const answer = await compile([
        'Hello {{ name }}',
        'This is {{ double(a + b) }}',
      ])(context);
      expect(answer).toEqual(['Hello Jesus', 'This is 106']);
    });
    it('Should be able to process objects', async () => {
      const context = {
        name: 'Jesus',
        a: 43,
        b: 10,
        double: (x) => x * 2,
      };
      const obj = {
        name: '{{ name }}',
        nested: {
          id: '{{ double(a+b) }}',
        },
      };
      const answer = await compile(obj)(context);
      expect(answer).toEqual({ name: 'Jesus', nested: { id: '106' } });
    });
  });
});

describe('Template', () => {
  describe('execute', () => {
    it('Should return the same string if no variables', async () => {
      const answer = await template('Hello');
      expect(answer).toEqual('Hello');
    });
    it('Should return input if is not string, array or object', async () => {
      const answer = await template(7);
      expect(answer).toEqual(7);
    });
    it('Should replace variables from the context', async () => {
      const context = {
        name: 'Jesus',
        a: 43,
      };
      const answer = await template('Hello {{ name }} {{ a }}', context);
      expect(answer).toEqual('Hello Jesus 43');
    });
    it('Should store strings in dictionary when compiled', async () => {
      const context = {
        name: 'Jesus',
        a: 43,
      };
      const answer = await template('Hello {{ name }} {{ a }}', context);
      expect(answer).toEqual('Hello Jesus 43');
      const answer2 = await template('Hello {{ name }} {{ a }}', context);
      expect(answer2).toEqual('Hello Jesus 43');
    });
    it('Should be able to call functions of the context', async () => {
      const context = {
        name: 'Jesus',
        a: 43,
        double: (x) => x * 2,
      };
      const answer = await template(
        'Hello {{ name }} {{ double(a) }}',
        context
      );
      expect(answer).toEqual('Hello Jesus 86');
    });
    it('Should be able to do operations with variables of the context', async () => {
      const context = {
        name: 'Jesus',
        a: 43,
        b: 10,
        double: (x) => x * 2,
      };
      const answer = await template(
        'Hello {{ name }} {{ double(a + b) }}',
        context
      );
      expect(answer).toEqual('Hello Jesus 106');
    });
    it('Should be able to process arrays', async () => {
      const context = {
        name: 'Jesus',
        a: 43,
        b: 10,
        double: (x) => x * 2,
      };
      const answer = await template(
        ['Hello {{ name }}', 'This is {{ double(a + b) }}'],
        context
      );
      expect(answer).toEqual(['Hello Jesus', 'This is 106']);
    });
    it('Should be able to process objects', async () => {
      const context = {
        name: 'Jesus',
        a: 43,
        b: 10,
        double: (x) => x * 2,
      };
      const obj = {
        name: '{{ name }}',
        nested: {
          id: '{{ double(a+b) }}',
        },
      };
      const answer = await template(obj, context);
      expect(answer).toEqual({ name: 'Jesus', nested: { id: '106' } });
    });
  });

  describe('Loops', () => {
    it('should iterate forEach', async () => {
      const input =
        'The name is {{ name }} the category is {{ category }}.' +
        '{{ #products }}Code: {{ code }} Name: {{ name }} Price: {{ price }} Parts: {{ parts }}{{ /# }}';

      const actual = await template(input, deepContext);
      expect(actual).toEqual(
        'The name is Products the category is something.Code: PR1 Name: Product 1 Price: 100 Parts: a,b,cCode: PR2 Name: Product 2 Price: 200 Parts: d,e,fCode: PR3 Name: Product 3 Price: 300 Parts: g,h,i'
      );
    });
    it('should iterate forEach filtered', async () => {
      const input =
        'The name is {{ name }} the category is {{ category }}.' +
        '{{ #products.filter(x => x.price > 150) }}Code: {{ code }} Name: {{ name }} Price: {{ price }} Parts: {{ parts }}{{ /# }}';

      const actual = await template(input, deepContext);
      expect(actual).toEqual(
        'The name is Products the category is something.Code: PR2 Name: Product 2 Price: 200 Parts: d,e,fCode: PR3 Name: Product 3 Price: 300 Parts: g,h,i'
      );
    });
    it('should give access to current as _current_', async () => {
      const input =
        'The name is {{ name }} the category is {{ category }}.' +
        '{{ #products }}Code: {{ code }} Name: {{ name }} Price: {{ price }} Parts: {{ #parts }}{{ _current_ }}{{/#}}{{ /# }}';
      const actual = await template(input, deepContext);
      expect(actual).toEqual(
        'The name is Products the category is something.Code: PR1 Name: Product 1 Price: 100 Parts: abcCode: PR2 Name: Product 2 Price: 200 Parts: defCode: PR3 Name: Product 3 Price: 300 Parts: ghi'
      );
    });
    it('should give access to parent as _parent_', async () => {
      const input =
        'The name is {{ name }} the category is {{ category }}.' +
        '{{ #products }}Code: {{ code }} Name: {{ name }} Price: {{ price }} Category: {{ _parent_.category }}{{/#}}{{ /# }}';
      const actual = await template(input, deepContext);
      expect(actual).toEqual(
        'The name is Products the category is something.Code: PR1 Name: Product 1 Price: 100 Category: somethingCode: PR2 Name: Product 2 Price: 200 Category: somethingCode: PR3 Name: Product 3 Price: 300 Category: something'
      );
    });
    it('should loop on _iterator_ parts of objects', async () => {
      const source = {
        name: '{{ name }}',
        category: '{{ category }}',
        cards: [
          {
            _iterator_: '#products',
            name: '{{ name }}',
            value: '{{ value }}',
          },
        ],
      };
      const context = {
        name: 'Products',
        category: 'software',
        products: [
          {
            code: 'SO1',
            name: 'Software 1',
            value: 500,
            parts: ['a', 'b', 'c'],
          },
          {
            code: 'SO2',
            name: 'Software 2',
            value: 600,
            parts: ['d', 'e', 'f'],
          },
          {
            code: 'SO3',
            name: 'Software 3',
            value: 700,
            parts: ['g', 'h', 'i'],
          },
        ],
      };
      const expected = {
        name: 'Products',
        category: 'software',
        cards: [
          { name: 'Software 1', value: '500' },
          { name: 'Software 2', value: '600' },
          { name: 'Software 3', value: '700' },
        ],
      };
      const actual = await template(source, context);
      expect(actual).toEqual(expected);
    });
  });
});
