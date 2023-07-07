import { test, expect } from 'vitest';
import { encode, decode } from '../index';

test('encode', () => {
  expect(encode('test')).toBe('dGVzdA==');

  expect(encode('type: {{undefined}}-value: {{undefined}}')).toBe(
    'dHlwZSUzQSUyMCU3QiU3QnVuZGVmaW5lZCU3RCU3RC12YWx1ZSUzQSUyMCU3QiU3QnVuZGVmaW5lZCU3RCU3RA=='
  );

  expect(encode('哈哈哈😀')).toBe(
    'JUU1JTkzJTg4JUU1JTkzJTg4JUU1JTkzJTg4JUYwJTlGJTk4JTgw'
  );

});

test('decode', () => {
  expect(decode('dGVzdA==')).toBe('test');

  expect(
    decode(
      'dHlwZSUzQSUyMCU3QiU3QnVuZGVmaW5lZCU3RCU3RC12YWx1ZSUzQSUyMCU3QiU3QnVuZGVmaW5lZCU3RCU3RA=='
    )
  ).toBe('type: {{undefined}}-value: {{undefined}}');

  expect(decode('JUU1JTkzJTg4JUU1JTkzJTg4JUU1JTkzJTg4JUYwJTlGJTk4JTgw')).toBe(
    '哈哈哈😀'
  );
  
});
