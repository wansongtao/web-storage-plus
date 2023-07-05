import { parse } from '../util';
import { test, expect } from 'vitest';

test('parse', () => {
  expect(parse(`"'type': {{number}}-'value':{{-Infinity}}"`)).toBe(-Infinity);
  expect(parse('"test"')).toBe('test');
  expect(parse('1')).toBe(1);
  expect(parse(`"'type': {{undefined}}-'value':{{undefined}}"`)).toBe(undefined);

  expect(parse(`{"test": "'type': {{number}}-'value':{{Infinity}}"}`)).toEqual({
    test: Infinity
  });
  expect(
    parse(
      `{"a": "test","b": "'type': {{regexp}}-'value':{{/0+/gi}}", "date": "'type': {{date}}-'value':{{1688543045842}}"}`
    )
  ).toEqual({a: 'test', b: /0+/gi, date: new Date(1688543045842)});
  expect(
    parse(
      `{"a": "'type': {{bigint}}-'value':{{123}}","b": "'type': {{number}}-'value':{{NaN}}"}`
    )
  ).toEqual({ a: 123n, b: NaN });
  expect(
    parse(
      `["'type': {{undefined}}-'value':{{undefined}}","'type': {{date}}-'value':{{1688543045842}}"]`
    )
  ).toEqual([undefined, new Date(1688543045842)]);
});
