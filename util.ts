/**
 * 将js对象或值转换为字符串
 * @param obj
 * @returns
 */
const stringify = (obj: any): string => {
  return JSON.stringify(obj, (key, value) => {
    if (value instanceof Function) {
      return `'type': {{function}}-'value':{{${value
        .toString()
        .replace(/^function/, '')}}}`;
    }
    if (value instanceof RegExp) {
      return `'type': {{regexp}}-'value':{{${value.toString().slice(1, -1)}}}`;
    }
    if (obj[key] instanceof Date) {
      return `'type': {{date}}-'value':{{${obj[key].getTime()}}}`;
    }
    if (value === undefined) {
      return `'type': {{undefined}}-'value':{{undefined}}`;
    }
    if (Number.isNaN(value)) {
      return `'type': {{number}}-'value':{{NaN}}`;
    }
    if (value === Infinity) {
      return `'type': {{number}}-'value':{{Infinity}}`;
    }
    if (value === -Infinity) {
      return `'type': {{number}}-'value':{{-Infinity}}`;
    }

    return value;
  });
};

const a = {
  name: 'wansongtao',
  age: 25,
  hi() {
    return 'my name is wansongtao';
  },
  reg: /[0-9]+/,
  e: undefined,
  a: Infinity,
  b: -Infinity,
  nan: NaN,
  date: new Date()
};
const test = stringify(a);
console.log(test);
