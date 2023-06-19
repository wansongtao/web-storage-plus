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
 * set global prefix
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
 * get localStorage/sessionStorage
 * @param {string} key
 * @param {object} [config]
 * @param {boolean} [config.isLocalStorage] true - localStorage, false - sessionStorage, default true
 * @param {string} [config.prefix] default globalPrefix
 * @returns
 */
export const getStorage = <T = unknown>(
  key: string,
  { isLocalStorage = true, prefix = globalPrefix }: IConfig = {}
): T | null => {
  const name = `${prefix}${key}`;
  const jsonText = isLocalStorage
    ? localStorage.getItem(name)
    : sessionStorage.getItem(name);

  if (jsonText === null) {
    console.warn(`not found ${name}`);
    return null;
  }

  try {
    const storage: IStorage<T> = JSON.parse(jsonText);
    if (storage.expire && storage.expire <= Date.now()) {
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
 * remove localStorage/sessionStorage
 * @param {string} key
 * @param {object} [config]
 * @param {boolean} [config.isLocalStorage] true - localStorage, false - sessionStorage, default true
 * @param {string} [config.prefix] default globalPrefix
 */
export const removeStorage = (
  key: string,
  { isLocalStorage = true, prefix = globalPrefix }: IConfig = {}
) => {
  const name = `${prefix}${key}`;

  if (isLocalStorage) {
    localStorage.removeItem(name);
  } else {
    sessionStorage.removeItem(name);
  }
};
