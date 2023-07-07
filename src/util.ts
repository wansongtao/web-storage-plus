/**
 * enhanced JSON.stringify, support function, regexp, date, undefined,
 * NaN, Infinity, -Infinity, bigint
 * @param obj
 * @example new Date(1625673600000) => "type: {{date}}-value: {{1625673600000}}"
 * @example "type: {{test}}-value: {{t}}" => "type: {{original}}-value: {{type: {{test}}-value: {{t}}}}"
 * @returns
 */
export const stringify = (obj: any): string => {
  const toJSON = Date.prototype.toJSON;
  Date.prototype.toJSON = null as any;

  const regexp =
    /^type: {{(original|number|undefined|date|regexp|function|bigint)}}-value: {{([^]+)}}$/;

  const jsonStr = JSON.stringify(obj, (_key, value) => {
    if (value instanceof Function) {
      return `type: {{function}}-value: {{${value
        .toString()
        .replace(/^function/, '')}}}`;
    }
    if (value instanceof RegExp) {
      return `type: {{regexp}}-value: {{${value.toString()}}}`;
    }
    if (value === undefined) {
      return `type: {{undefined}}-value: {{undefined}}`;
    }
    if (Number.isNaN(value)) {
      return `type: {{number}}-value: {{NaN}}`;
    }
    if (value === Infinity) {
      return `type: {{number}}-value: {{Infinity}}`;
    }
    if (value === -Infinity) {
      return `type: {{number}}-value: {{-Infinity}}`;
    }
    if (typeof value === 'bigint') {
      return `type: {{bigint}}-value: {{${value.toString()}}}`;
    }
    if (value instanceof Date) {
      return `type: {{date}}-value: {{${value.getTime()}}}`;
    }
    if (regexp.test(value)) {
      return `type: {{original}}-value: {{${value}}}`;
    }

    return value;
  });

  Date.prototype.toJSON = toJSON;
  return jsonStr;
};

/**
 * enhanced JSON.parse, support function, regexp, date, undefined,
 * NaN, Infinity, -Infinity, bigint
 * @param str
 * @example "type: {{regexp}}-value: {{/0/gi}}" => new RegExp('0', 'gi')
 * @returns
 */
export const parse = <T = any>(str: string): T => {
  const regexp =
    /^type: {{(original|number|undefined|date|regexp|function|bigint)}}-value: {{([^]+)}}$/;

  type IType =
    | 'original'
    | 'number'
    | 'undefined'
    | 'date'
    | 'regexp'
    | 'function'
    | 'bigint';
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

      throw new Error('invalid regexp');
    },
    date: (text: string) => {
      return new Date(Number(text));
    },
    number: (text: string) => {
      return Number(text);
    },
    undefined: (text: string) => {
      if (text === 'undefined') {
        return undefined;
      }

      throw new Error('invalid undefined');
    },
    bigint: (text: string) => {
      return BigInt(text);
    },
    original: (text: string) => {
      return text;
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

/**
 * encode string to base64
 * @param {string} str
 * @returns
 */
export const encode = (str: string) => {
  try {
    return btoa(encodeURIComponent(str));
  } catch (e) {
    console.error(e);
    return str;
  }
};

/**
 * decode base64 to string
 * @param {string} str
 * @returns
 */
export const decode = (str: string) => {
  try {
    return decodeURIComponent(atob(str));
  } catch (e) {
    console.error(e);
    return str;
  }
};
