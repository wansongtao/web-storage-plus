import { test, expect } from 'vitest';
import {
  setGlobalPrefix,
  setStorage,
  getStorage,
  removeStorage
} from '../index';

test('storage', () => {
  expect(setGlobalPrefix('t-'));
  expect(setStorage('key', 'value'));
  expect(getStorage('key')).toBe('value');

  expect(setStorage('k1', 'v1', { isLocalStorage: false, maxAge: -1 }));
  expect(getStorage('k1', { isLocalStorage: false })).toBeNull();

  expect(
    setStorage('k2', 'v2', { isLocalStorage: true, maxAge: 1, prefix: 's-' })
  );
  expect(getStorage('k2', { isLocalStorage: true, prefix: 's-' })).toBe('v2');

  expect(
    setStorage('k3', 'v3', { isLocalStorage: true, maxAge: -11, prefix: 's-' })
  );
  expect(
    getStorage('k3', {
      isLocalStorage: true,
      prefix: 's-',
      isDeleteExpired: true
    })
  ).toBeNull();

  expect(setStorage('k4', { a: 1, b: true, c: [1, null, 2, false] }));
  expect(getStorage('k4')).toEqual({ a: 1, b: true, c: [1, null, 2, false] });

  expect(removeStorage('k4'));
});
