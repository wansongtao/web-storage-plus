/**
 * enhanced JSON.stringify, support function, regexp, date, undefined,
 * NaN, Infinity, -Infinity, bigint
 * @param obj
 * @param replacer A function that alters the behavior of the stringification process
 * @example new Date(1625673600000) => "type: {{date}}-value: {{1625673600000}}"
 * @example "type: {{test}}-value: {{t}}" => "type: {{original}}-value: {{type: {{test}}-value: {{t}}}}"
 * @returns
 */
export const stringify = (
  obj: any,
  replacer?: (k: any, v: any) => string | number | boolean | null
): string => {
  try {
    const toJSON = Date.prototype.toJSON;
    Date.prototype.toJSON = null as any;

    const regexp =
      /^type: {{(original|number|undefined|date|regexp|function|bigint)}}-value: {{([^]+)}}$/;

    const jsonStr = JSON.stringify(obj, (key, value) => {
      try {
        if (regexp.test(value)) {
          value = `type: {{original}}-value: {{${value}}}`;
        } else if (value instanceof Function) {
          value = `type: {{function}}-value: {{${value
            .toString()
            .replace(/^function/, '')}}}`;
        } else if (value instanceof RegExp) {
          value = `type: {{regexp}}-value: {{${value.toString()}}}`;
        } else if (value === undefined) {
          value = `type: {{undefined}}-value: {{undefined}}`;
        } else if (Number.isNaN(value)) {
          return `type: {{number}}-value: {{NaN}}`;
        } else if (value === Infinity) {
          value = `type: {{number}}-value: {{Infinity}}`;
        } else if (value === -Infinity) {
          value = `type: {{number}}-value: {{-Infinity}}`;
        } else if (typeof value === 'bigint') {
          value = `type: {{bigint}}-value: {{${value.toString()}}}`;
        } else if (value instanceof Date) {
          value = `type: {{date}}-value: {{${value.getTime()}}}`;
        }

        if (key !== '' && replacer) {
          value = replacer(key, value);
        }
      } catch (e) {
        console.error(e);
      }

      return value;
    });

    Date.prototype.toJSON = toJSON;
    return jsonStr;
  } catch (e) {
    console.error(e);
    return '';
  }
};

/**
 * enhanced JSON.parse, support function, regexp, date, undefined,
 * NaN, Infinity, -Infinity, bigint
 * @param str
 * @param reviver A function that transforms the results
 * @example "type: {{regexp}}-value: {{/0/gi}}" => new RegExp('0', 'gi')
 * @returns
 */
export const parse = <T = any>(
  str: string,
  reviver?: (k: string, v: any) => any
): T => {
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

  return JSON.parse(str, (key, value) => {
    try {
      // When traversed to the top level and the resolved value is an object, all its values have been converted
      if (key === '' && typeof value === 'object') {
        return value;
      }

      const match = regexp.exec(value);
      if (match) {
        const type = match[1] as IType;
        if (strategies[type]) {
          value = strategies[type](match[2]);
        }
      }

      if (reviver) {
        return reviver(key, value);
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
