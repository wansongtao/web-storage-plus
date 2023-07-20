import { test, expect } from 'vitest';
import {
  setGlobalPrefix,
  setGlobalStringifyFn,
  setGlobalParseFn,
  setGlobalDecryptFn,
  setGlobalEncryptFn,
  setStorage,
  getStorage,
  removeStorage,
  stringify,
  parse,
  decode,
  encode
} from '../index';

test('storage', () => {
  expect(setStorage('key', 'value'));
  expect(getStorage('key')).toBe('value');

  expect(
    setStorage('k', 'v', {
      isLocalStorage: false,
      maxAge: 1,
      prefix: 't-'
    })
  );
  expect(getStorage('k', { isLocalStorage: false, prefix: 't-' })).toBe('v');
  expect(removeStorage('k', { isLocalStorage: false, prefix: 't-' }));

  expect(setStorage('k1', { a: 1, b: true, c: 'test' }, { maxAge: -1 }));
  expect(getStorage('k1')).toBeNull();
  expect(getStorage('k1', { isDeleteExpired: true })).toBeNull();
  expect(getStorage('k1')).toBeNull();

  expect(setGlobalPrefix('s-'));
  expect(setGlobalParseFn(parse));
  expect(setGlobalStringifyFn(stringify));

  const a1 = { a: 1, b: true, c: 'test', d: new Date(1688543045842) };
  expect(setStorage('k2', a1));
  expect(getStorage('k2')).toEqual(a1);

  const date = new Date(1688543045842);
  expect(
    setStorage('k3', { a: 'test', b: date }, { stringifyFn: null as any })
  );
  expect(getStorage('k3')).toEqual({ a: 'test', b: date.toJSON() });
  expect(getStorage('k3', { parseFn: null as any })).toEqual({
    a: 'test',
    b: date.toJSON()
  });

  const test = {
    a: /[0-9]+/gi,
    b: new Date(1688543045842),
    c: undefined,
    d: () => {
      console.log('test');
    },
    e: Infinity,
    f: -Infinity,
    g: NaN,
    h: 1234534n,
    i() {
      const a = Infinity;
      console.log(a);
    },
    j: function () {
      return 1 + 2;
    },
    k: 'type: {{regexp}}-value: {{/[0-9]+/gi}}'
  };
  expect(setStorage('k4', test, { maxAge: 10 }));
  const val = getStorage('k4') as any;
  expect(val).toEqual({
    a: expect.any(RegExp),
    b: expect.any(Date),
    c: undefined,
    d: expect.any(Function),
    e: Infinity,
    f: -Infinity,
    g: NaN,
    h: 1234534n,
    i: expect.any(Function),
    j: expect.any(Function),
    k: 'type: {{regexp}}-value: {{/[0-9]+/gi}}'
  });
  // console.log(val, val.d(), val.i(), val.j());

  expect(setStorage('k5', 'value', { encryptFn: (v) => v }));
  expect(getStorage('k5', { decryptFn: (v) => v })).toBe('value');

  expect(setGlobalEncryptFn(encode));
  expect(setGlobalDecryptFn(decode));
  expect(setStorage('k6', 'value'));
  expect(getStorage('k6')).toBe('value');

  (test as any).cn = '中文😜';
  expect(setStorage('k7', test, { maxAge: 1 }));
  expect(getStorage('k7')).toEqual({
    a: expect.any(RegExp),
    b: expect.any(Date),
    c: undefined,
    d: expect.any(Function),
    e: Infinity,
    f: -Infinity,
    g: NaN,
    h: 1234534n,
    i: expect.any(Function),
    j: expect.any(Function),
    k: 'type: {{regexp}}-value: {{/[0-9]+/gi}}',
    cn: '中文😜'
  });

  // console.log(getStorage('k7', { isDeleteExpired: true }));
});

test('storage: async/sync', async () => {
  expect(setStorage('async1', 'value', { isAsync: true, maxAge: 1 }));
  expect(getStorage('async1', { isDeleteExpired: true })).toBe(null);

  expect(setStorage('async2', 'value', { isAsync: false }));
  expect(getStorage('async2')).toBe('value');
  expect(removeStorage('async2'));

  expect(setStorage('async3', 'value', { isAsync: true }));
  expect(await getStorage('async3', { isAsync: true })).toBe('value');
  expect(removeStorage('async3', { isAsync: true }));
});
