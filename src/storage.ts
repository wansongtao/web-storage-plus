let globalPrefix = 'st-';
export const setGlobalPrefix = (prefix: string) => {
  globalPrefix = prefix;
};

type IEncryptFn = (data: string) => string;
type IStringifyFn = (data: any) => string;
export interface IConfig {
  isLocalStorage?: boolean;
  maxAge?: number;
  prefix?: string;
  stringifyFn?: IStringifyFn;
  encryptFn?: IEncryptFn;
  isAsync?: boolean;
}
interface IStorage<T = unknown> {
  data: T;
  expire: number;
}

let globalStringifyFn: IStringifyFn | undefined = undefined;
/**
 * set a global method to converts a JavaScript value to a JSON string
 * @param {function} fn
 */
export const setGlobalStringifyFn = (fn: IStringifyFn) => {
  globalStringifyFn = fn;
};

let globalEncryptFn: IEncryptFn | undefined = undefined;
export const setGlobalEncryptFn = (fn: IEncryptFn) => {
  globalEncryptFn = fn;
};

/**
 * set localStorage/sessionStorage, if maxAge is set, it will be expired
 * after maxAge seconds
 * @param {string} key
 * @param {any} value
 * @param {object} [config]
 * @param {boolean} [config.isLocalStorage] default true, false - sessionStorage
 * @param {number} [config.maxAge] Expiration time, in seconds
 * @param {string} [config.prefix] default globalPrefix('st-')
 * @param {function} [config.stringifyFn] default globalStringifyFn(undefined),
 * falsy - JSON.stringify,
 * This method converts the JavaScript value to a JSON string
 * @param {function} [config.encryptFn] default globalEncryptFn(undefined)
 * @param {boolean} [config.isAsync] default false, true - async
 * @returns
 */
export const setStorage = <T = unknown>(
  key: string,
  value: T,
  {
    isLocalStorage = true,
    maxAge,
    prefix = globalPrefix,
    stringifyFn = globalStringifyFn,
    encryptFn = globalEncryptFn,
    isAsync = false
  }: IConfig = {}
) => {
  const setStorageSync = () => {
    const storage: IStorage = { data: value, expire: 0 };

    if (maxAge) {
      storage.expire = Date.now() + maxAge * 1000;
    }
    if (!stringifyFn) {
      stringifyFn = JSON.stringify;
    }

    const name = `${prefix}${key}`;
    let json = stringifyFn(storage);
    if (encryptFn) {
      json = encryptFn(json);
    }

    if (isLocalStorage) {
      localStorage.setItem(name, json);
      return;
    }
    sessionStorage.setItem(name, json);
  };

  const setStorageAsync = () => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          setStorageSync();
          resolve();
        } catch (ex) {
          reject(ex);
        }
      }, 0);
    });
  };

  if (isAsync) {
    return setStorageAsync();
  }

  try {
    setStorageSync();
  } catch(ex) {
    console.error(ex);
  }
};

export interface IGetStorageConfig {
  isLocalStorage?: boolean;
  prefix?: string;
  isDeleteExpired?: boolean;
  parseFn?: IParseFn;
  decryptFn?: IEncryptFn;
  isAsync?: boolean;
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

let globalDecryptFn: IEncryptFn | undefined = undefined;
export const setGlobalDecryptFn = (fn: IEncryptFn) => {
  globalDecryptFn = fn;
};

/**
 * @param {string} key
 * @param {object} [config]
 * @param {boolean} [config.isLocalStorage] default true, false - sessionStorage
 * @param {string} [config.prefix] default globalPrefix('st-')
 * @param {boolean} [config.isDeleteExpired] default false, delete expired data
 * @param {function} [config.parseFn] default globalParseFn(undefined), falsy - JSON.parse,
 * This method parses a JSON string
 * @param {function} [config.decryptFn] default globalDecryptFn(undefined)
 * @param {boolean} [config.isAsync] default false, true - async
 * @returns
 */
export const getStorage = <T = unknown>(
  key: string,
  {
    isLocalStorage = true,
    prefix = globalPrefix,
    isDeleteExpired,
    parseFn = globalParseFn,
    decryptFn = globalDecryptFn,
    isAsync = false
  }: IGetStorageConfig = {}
) => {
  const getStorageSync = () => {
    try {
      const name = `${prefix}${key}`;
      let json = isLocalStorage
        ? localStorage.getItem(name)
        : sessionStorage.getItem(name);

      if (json === null) {
        console.warn(`not found ${name}`);
        return null;
      }
      if (decryptFn) {
        json = decryptFn(json);
      }
      if (!parseFn) {
        parseFn = JSON.parse;
      }

      const storage: IStorage<T> = parseFn(json);
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

  const getStorageAsync = () => {
    return new Promise<T | null>((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(getStorageSync());
        } catch (ex) {
          reject(ex);
        }
      }, 0);
    });
  };

  if (isAsync) {
    return getStorageAsync();
  }

  return getStorageSync();
};

/**
 * @param {string} key
 * @param {object} [config]
 * @param {boolean} [config.isLocalStorage] default true, false - sessionStorage
 * @param {string} [config.prefix] default globalPrefix
 * @param {boolean} [config.isAsync] default false, true - async
 */
export const removeStorage = (
  key: string,
  {
    isLocalStorage = true,
    prefix = globalPrefix,
    isAsync = false
  }: { isLocalStorage?: boolean; prefix?: string; isAsync?: boolean } = {}
) => {
  const removeStorageSync = () => {
    const name = `${prefix}${key}`;
    if (isLocalStorage) {
      localStorage.removeItem(name);
      return;
    }
    sessionStorage.removeItem(name);
  };

  const removeStorageAsync = () => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          removeStorageSync();
          resolve();
        } catch (ex) {
          reject(ex);
        }
      }, 0);
    });
  };

  if (isAsync) {
    return removeStorageAsync();
  }

  try {
    removeStorageSync();
  } catch (ex) {
    console.error(ex);
  }
};
