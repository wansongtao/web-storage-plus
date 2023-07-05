/**
 * enhanced JSON.stringify, support function, regexp, date, undefined, 
 * NaN, Infinity, -Infinity, bigint
 * @param obj
 * @example new Date() => "'type': {{date}}-'value':{{1625673600000}}"
 * @returns
 */
export const stringify = (obj: any): string => {
  Date.prototype.toJSON = function () {
    return `'type': {{date}}-'value':{{${this.getTime()}}}`;
  };

  return JSON.stringify(obj, (_key, value) => {
    if (value instanceof Function) {
      return `'type': {{function}}-'value':{{${value
        .toString()
        .replace(/^function/, '')}}}`;
    }
    if (value instanceof RegExp) {
      return `'type': {{regexp}}-'value':{{${value.toString()}}}`;
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
    if (typeof value === 'bigint') {
      return `'type': {{bigint}}-'value':{{${value.toString()}}}`;
    }

    return value;
  });
};

/**
 * enhanced JSON.parse, support function, regexp, date, undefined, 
 * NaN, Infinity, -Infinity, bigint
 * @param str 
 * @example "'type': {{regexp}}-'value':{{/0/gi}}" => new RegExp('0', 'gi')
 * @returns 
 */
export const parse = <T = any>(str: string): T => {
  const regexp =
    /^'type': {{(number|undefined|date|regexp|function|bigint)}}-'value':{{([^]+)}}$/;

  type IType = 'number' | 'undefined' | 'date' | 'regexp' | 'function' | 'bigint';
  const strategies: Record<IType, (text: string) => any> = {
    function: (text: string) => {
      if (/^\(\) =>/.test(text)) {
        return new Function(`return ${text}`)();
      }

      return new Function(`return function ${text}`)();
    },
    regexp: (text: string) => {
      const regMatch = /^\/([^]+)\/([gimsuy]{0,})$/.exec(text);
      if (regMatch) {
        return new RegExp(regMatch[1], regMatch[2]);
      }

      return new RegExp(text);
    },
    date: (text: string) => {
      return new Date(Number(text));
    },
    number: (text: string) => {
      return Number(text);
    },
    undefined: (_text?: string) => {
      return undefined;
    },
    bigint: (text: string) => {
      return BigInt(text);
    }
  };

  return JSON.parse(str, (_key, value) => {
    if (typeof value !== 'string') {
      return value;
    }

    try {
      const match = regexp.exec(value);
      if (!match) {
        return value;
      }

      const type = match[1] as IType;
      if (strategies[type]) {
        return strategies[type](match[2]);
      }
    } catch (e) {
      console.error(e);
    }

    return value;
  });
};
