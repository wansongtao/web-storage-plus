/**
 * enhanced JSON.stringify, support function, regexp, date, undefined,
 * NaN, Infinity, -Infinity, bigint
 * @param obj
 * @example new Date(1625673600000) => "type: {{date}}-value: {{1625673600000}}"
 * @returns
 */
export const stringify = (obj: any): string => {
  const toJSON = Date.prototype.toJSON;
  Date.prototype.toJSON = function () {
    return `type: {{date}}-value: {{${this.getTime()}}}`;
  };

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
    /^type: {{(number|undefined|date|regexp|function|bigint)}}-value: {{([^]+)}}$/;

  type IType =
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

export interface IConfig {
  isLocalStorage?: boolean;
  maxAge?: number;
  prefix?: string;
}

interface IStorage<T = unknown> {
  data: T;
  expire: number;
}

let globalPrefix = 'st-';

/**
 * @param {string} prefix
 */
export const setGlobalPrefix = (prefix: string) => {
  globalPrefix = prefix;
};

/**
 * set localStorage/sessionStorage, if maxAge is set, it will be expired after maxAge seconds
 * @param {string} key
 * @param {any} value
 * @param {object} [config]
 * @param {boolean} [config.isLocalStorage] true - localStorage, false - sessionStorage, default true
 * @param {number} [config.maxAge] Expiration time, in seconds
 * @param {string} [config.prefix] default globalPrefix
 * @returns {void}
 */
export const setStorage = <T = unknown>(
  key: string,
  value: T,
  { isLocalStorage = true, maxAge, prefix = globalPrefix }: IConfig = {}
): void => {
  const storage: IStorage = { data: value, expire: 0 };
  if (maxAge) {
    storage.expire = Date.now() + maxAge * 1000;
  }

  try {
    const value = JSON.stringify(storage);
    const name = `${prefix}${key}`;

    if (isLocalStorage) {
      localStorage.setItem(name, value);
      return;
    }

    sessionStorage.setItem(name, value);
  } catch (ex) {
    console.error(ex);
  }
};

/**
 * @param {string} key
 * @param {object} [config]
 * @param {boolean} [config.isLocalStorage] true - localStorage, false - sessionStorage, default true
 * @param {string} [config.prefix] default globalPrefix
 * @param {boolean} [config.isDeleteExpired] delete expired data, default false
 * @returns
 */
export const getStorage = <T = unknown>(
  key: string,
  {
    isLocalStorage = true,
    prefix = globalPrefix,
    isDeleteExpired
  }: {
    isLocalStorage?: boolean;
    prefix?: string;
    isDeleteExpired?: boolean;
  } = {}
) => {
  const name = `${prefix}${key}`;
  try {
    const jsonText = isLocalStorage
      ? localStorage.getItem(name)
      : sessionStorage.getItem(name);

    if (jsonText === null) {
      console.warn(`not found ${name}`);
      return null;
    }

    const storage: IStorage<T> = JSON.parse(jsonText);
    if (storage.expire && storage.expire <= Date.now()) {
      if (isDeleteExpired) {
        removeStorage(key, { isLocalStorage, prefix });
      }

      console.warn(`${name}: data expired!`);
      return null;
    }

    return storage.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * @param {string} key
 * @param {object} [config]
 * @param {boolean} [config.isLocalStorage] true - localStorage, false - sessionStorage, default true
 * @param {string} [config.prefix] default globalPrefix
 */
export const removeStorage = (
  key: string,
  {
    isLocalStorage = true,
    prefix = globalPrefix
  }: { isLocalStorage?: boolean; prefix?: string } = {}
) => {
  const name = `${prefix}${key}`;

  try {
    if (isLocalStorage) {
      localStorage.removeItem(name);
      return;
    }

    sessionStorage.removeItem(name);
  } catch (ex) {
    console.error(ex);
  }
};
