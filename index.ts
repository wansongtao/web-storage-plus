

export interface IConfig {
  isLocalStorage?: boolean;
  maxAge?: number;
  prefix?: string;
}

interface IStorage<T = unknown> {
  data: T;
  expire: number;
}

/**
 * 默认前缀
 */
let PREFIX = 'st-';
export const setGlobalPrefix = (prefix: string) => {
  PREFIX = prefix;
};

/**
 * 本地/会话存储，支持设置过期时间
 * @param key 键
 * @param value 值
 * @param config 配置
 * @param [config.isLocalStorage] 是否本地存储，默认为true
 * @param [config.maxAge] 多少秒后过期，默认不过期
 * @param [config.prefix] key 前缀，默认为设置的全局前缀
 * @returns
 */
export const setStorage = <T = unknown>(
  key: string,
  value: T,
  { isLocalStorage = true, maxAge, prefix = PREFIX }: IConfig = {}
) => {
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
 * 取出本地/会话存储中未过期的数据，已过期、未找到返回null
 * @param key
 * @param config
 * @param config.isLocalStorage 是否本地存储，默认为true
 * @param config.prefix key 前缀，默认为设置的全局前缀
 * @returns
 */
export const getStorage = <T = unknown>(
  key: string,
  { isLocalStorage = true, prefix = PREFIX }: IConfig = {}
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
 * 删除本地/会话存储中的对应数据
 * @param key
 * @param config
 * @param config.isLocalStorage 是否本地存储，默认为true
 * @param config.prefix key 前缀，默认为设置的全局前缀
 * @returns
 */
export const removeStorage = (
  key: string,
  { isLocalStorage = true, prefix = PREFIX }: IConfig = {}
) => {
  const name = `${prefix}${key}`;

  if (isLocalStorage) {
    localStorage.removeItem(name);
  } else {
    sessionStorage.removeItem(name);
  }
};
