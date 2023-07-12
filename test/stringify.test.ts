import { stringify } from '../index';
import { test, expect } from 'vitest';

test('stringify', () => {
  expect(stringify(undefined)).toBe(
    '"type: {{undefined}}-value: {{undefined}}"'
  );

  expect(stringify('type: {{undefined}}-value: {{undefined}}')).toBe(
    '"type: {{original}}-value: {{type: {{undefined}}-value: {{undefined}}}}"'
  );

  expect(stringify(NaN)).toBe('"type: {{number}}-value: {{NaN}}"');
  expect(stringify(123n)).toBe('"type: {{bigint}}-value: {{123}}"');
  expect(stringify(Infinity)).toBe('"type: {{number}}-value: {{Infinity}}"');
  expect(stringify(-Infinity)).toBe('"type: {{number}}-value: {{-Infinity}}"');

  expect(stringify(new Date(1688543045842))).toBe(
    '"type: {{date}}-value: {{1688543045842}}"'
  );

  expect(stringify(/0+/gi)).toBe('"type: {{regexp}}-value: {{/0+/gi}}"');
  expect(stringify(/0+/)).toBe('"type: {{regexp}}-value: {{/0+/}}"');
  expect(stringify(new RegExp('1+aa'))).toBe(
    '"type: {{regexp}}-value: {{/1+aa/}}"'
  );

  expect(stringify(() => {})).toBe(
    '"type: {{function}}-value: {{() => {\\n  }}}"'
  );
  expect(
    stringify(function () {
      console.log('test');
    })
  ).toBe(
    '"type: {{function}}-value: {{() {\\n      console.log(\\"test\\");\\n    }}}"'
  );

  expect(
    stringify([
      { test: Infinity },
      { date: new Date(1688543045842) },
      new Date(1688543045842),
      123n,
      NaN,
      undefined
    ])
  ).toBe(
    '[{"test":"type: {{number}}-value: {{Infinity}}"},{"date":"type: {{date}}-value: {{1688543045842}}"},"type: {{date}}-value: {{1688543045842}}","type: {{bigint}}-value: {{123}}","type: {{number}}-value: {{NaN}}","type: {{undefined}}-value: {{undefined}}"]'
  );

  expect(
    stringify({ a: 1, b: 2 }, (_k, v) => {
      return v * 2;
    })
  ).toBe('{"a":2,"b":4}');
  expect(stringify(1, (_k, v) => v * 2)).toBe('2');
});
