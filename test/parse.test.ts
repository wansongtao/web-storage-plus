import { parse } from '../index';
import { test, expect } from 'vitest';

test('parse', () => {
  expect(parse('"type: {{number}}-value: {{-Infinity}}"')).toBe(-Infinity);
  expect(parse(`"type: {{undefined}}-value: {{undefined}}"`)).toBe(undefined);
  expect(parse(`"type: {{undefined}}-value: {{text}}"`)).toBe(
    'type: {{undefined}}-value: {{text}}'
  );
  expect(
    parse(
      '"type: {{original}}-value: {{type: {{undefined}}-value: {{undefined}}}}"'
    )
  ).toBe('type: {{undefined}}-value: {{undefined}}');
  
  expect(parse(`{"test": "type: {{number}}-value: {{Infinity}}"}`)).toEqual({
    test: Infinity
  });

  expect(parse(`"type: {{regexp}}-value: {{Infinity}}"`)).toEqual(
    'type: {{regexp}}-value: {{Infinity}}'
  );

  expect(
    parse(
      `{"a": "test","b": "type: {{regexp}}-value: {{/0+/gi}}", "date": "type: {{date}}-value: {{1688543045842}}"}`
    )
  ).toEqual({ a: 'test', b: /0+/gi, date: new Date(1688543045842) });

  expect(
    parse(
      `{"a": "type: {{bigint}}-value: {{123}}","b": "type: {{number}}-value: {{NaN}}"}`
    )
  ).toEqual({ a: 123n, b: NaN });

  expect(
    parse(
      `["type: {{undefined}}-value: {{undefined}}","type: {{date}}-value: {{1688543045842}}"]`
    )
  ).toEqual([undefined, new Date(1688543045842)]);

  expect.extend({
    toBeFunc: (received, expected) => {
      if (received instanceof Function && expected instanceof Function) {
        return {
          message: () => `${received.toString()} equal to ${expected.toString()}`,
          pass: true
        };
      }

      return {
        message: () => `${received.toString()} not equal to ${expected.toString()}`,
        pass: false
      };
    }
  });
  expect(parse(`"type: {{function}}-value: {{() => {\\n  }}}"`)).toBeFunc(
    () => {}
  );

  expect(
    parse('"type: {{function}}-value: {{() {\\n      console.log(\\"test\\");\\n    }}}"')
  ).toBeFunc(function () {
    console.log('test');
  });

  expect(
    parse('{"a":2,"b":4}', (_k, v) => {
      return v / 2;
    })
  ).toStrictEqual({ a: 1, b: 2 });
});
