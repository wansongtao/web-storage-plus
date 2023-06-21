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
