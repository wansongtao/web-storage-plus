import { test, expect } from 'vitest';
import {
  setGlobalPrefix,
  setGlobalStringifyFn,
  setGlobalParseFn,
  setStorage,
  getStorage,
  removeStorage,
  stringify,
  parse
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
  console.log(val, val.d(), val.i(), val.j());
});
