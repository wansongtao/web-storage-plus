let globalPrefix = 'st-';
/**
 * @param {string} prefix
 */
export const setGlobalPrefix = (prefix: string) => {
  globalPrefix = prefix;
};

type IStringifyFn = (data: any) => string;
let globalStringifyFn: IStringifyFn | undefined = undefined;
/**
 * set a global method to converts a JavaScript value to a JSON string
 * @param {function} fn
 */
export const setGlobalStringifyFn = (fn: IStringifyFn) => {
  globalStringifyFn = fn;
};

export interface IConfig {
  isLocalStorage?: boolean;
  maxAge?: number;
  prefix?: string;
  stringifyFn?: IStringifyFn;
}

interface IStorage<T = unknown> {
  data: T;
  expire: number;
}

/**
 * set localStorage/sessionStorage, if maxAge is set, it will be expired
 * after maxAge seconds
 * @param {string} key
 * @param {any} value
 * @param {object} [config]
 * @param {boolean} [config.isLocalStorage] default true,
 * true - localStorage, false - sessionStorage
 * @param {number} [config.maxAge] Expiration time, in seconds
 * @param {string} [config.prefix] default globalPrefix
 * @param {function} [config.stringifyFn] default globalStringifyFn,
 * falsy - JSON.stringify,
 * This method converts the JavaScript value to a JSON string
 * @returns {void}
 */
export const setStorage = <T = unknown>(
  key: string,
  value: T,
  {
    isLocalStorage = true,
    maxAge,
    prefix = globalPrefix,
    stringifyFn = globalStringifyFn
  }: IConfig = {}
): void => {
  try {
    const storage: IStorage = { data: value, expire: 0 };

    if (maxAge) {
      storage.expire = Date.now() + maxAge * 1000;
    }
    if (!stringifyFn) {
      stringifyFn = JSON.stringify;
    }

    const name = `${prefix}${key}`;
    const json = stringifyFn(storage);

    if (isLocalStorage) {
      localStorage.setItem(name, json);
      return;
    }
    sessionStorage.setItem(name, json);
  } catch (ex) {
    console.error(ex);
  }
};

export interface IGetStorageConfig {
  isLocalStorage?: boolean;
  prefix?: string;
  isDeleteExpired?: boolean;
  parseFn?: IParseFn;
}

type IParseFn = (data: string) => any;
let globalParseFn: IParseFn | undefined = undefined;
/**
 * set a global method that parses a JSON string
 * @param {function} fn
 */
export const setGlobalParseFn = (fn: IParseFn) => {
  globalParseFn = fn;
};

/**
 * @param {string} key
 * @param {object} [config]
 * @param {boolean} [config.isLocalStorage] default true,
 * true - localStorage, false - sessionStorage
 * @param {string} [config.prefix] default globalPrefix
 * @param {boolean} [config.isDeleteExpired] default false, delete expired data
 * @param {function} [config.parseFn] default globalParseFn, falsy - JSON.parse,
 * This method parses a JSON string
 * @returns
 */
export const getStorage = <T = unknown>(
  key: string,
  {
    isLocalStorage = true,
    prefix = globalPrefix,
    isDeleteExpired,
    parseFn = globalParseFn
  }: IGetStorageConfig = {}
) => {
  try {
    const name = `${prefix}${key}`;
    const jsonText = isLocalStorage
      ? localStorage.getItem(name)
      : sessionStorage.getItem(name);

    if (jsonText === null) {
      console.warn(`not found ${name}`);
      return null;
    }
    if (!parseFn) {
      parseFn = JSON.parse;
    }

    const storage: IStorage<T> = parseFn(jsonText);
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
 * @param {boolean} [config.isLocalStorage] default true, 
 * true - localStorage, false - sessionStorage
 * @param {string} [config.prefix] default globalPrefix
 */
export const removeStorage = (
  key: string,
  {
    isLocalStorage = true,
    prefix = globalPrefix
  }: { isLocalStorage?: boolean; prefix?: string } = {}
) => {
  try {
    const name = `${prefix}${key}`;
    
    if (isLocalStorage) {
      localStorage.removeItem(name);
      return;
    }

    sessionStorage.removeItem(name);
  } catch (ex) {
    console.error(ex);
  }
};
