# web-storage-plus
增强浏览器的localStorage和sessionStorage API，支持设置过期时间、命名空间、异步/同步、自定义json化与解析函数、加解密函数。  
提供stringify/parse函数，相比JSON.stringify/JSON.parse方法，额外支持了function、regexp、date、undefined、NaN、Infinity、-Infinity、bigint。  
提供encode/decode函数，用于将字符串转换为base64编码或将base64编码转换为字符串，安全性要求不高时可用来加密，安全性要求较高时，推荐使用您自己编写的加解密函数。  
以上函数都是可选的，如果您不需要，可以不用引入。
## 安装
```bash
$ npm install web-storage-plus

$ yarn add web-storage-plus

$ pnpm add web-storage-plus
```
## 示例
### 简单使用
```typescript
import { setStorage, getStorage } from 'web-storage-plus'

const data = { name: 'test', data: 'this is a test.' }

setStorage('storage', data)
getStorage<{ name: string; data: string; }>('storage') // { name: 'test', data: 'this is a test.' }

setStorage('test', data, { maxAge: 60 * 60 * 24 })
getStorage('test', { isDeleteExpired: true })

setStorage('test', data, { isAsync: true }).then(() => {
  console.log('setStorage success.');
});
(getStorage('test', { isAsync: true }) as Promise<{ name: string; data: string; } | null>).then((data) => {
  console.log('getStorage success.', data);
});
```
``` javascript
// 浏览器中运行
import { setStorage, getStorage } from 'web-storage-plus';

const data = { name: 'test', data: 'this is a test.' };

setStorage('test', data, { maxAge: 60 * 60 * 24 });
getStorage('test', { isDeleteExpired: true });

setStorage('test', data, { isAsync: true }).then(() => {
  console.log('setStorage success.');
});
getStorage('test', { isAsync: true }).then((data) => {
  console.log('getStorage success.', data);
});
```
## 方法
### setStorage(key, value, [options])
将给定的键值对以JSON字符串的形式存储在localStorage或sessionStorage中。  
如果提供了options对象：
- `options.maxAge` - 一个数字，表示过期时间，单位为秒(默认不过期)。
- `options.prefix` - 一个字符串，表示键名的前缀(默认 globalPrefix)。
- `options.isLocalStorage` - 一个布尔值，表示Web Storage的类型(默认 true)。
- `options.stringifyFn` - 一个函数，表示将js值转换为JSON字符串的函数(默认 globalStringifyFn)。
- `options.encryptFn` - 一个函数，表示加密JSON字符串的函数(默认不加密)。
- `options.isAsync` - 一个布尔值，表示是否异步存储(默认 false)。
### getStorage(key, [options])
根据给定的键名从localStorage或sessionStorage中获取值。  
如果提供了options对象：
- `options.prefix` - 一个字符串，表示键名的前缀(默认 globalPrefix)。
- `options.isLocalStorage` - 一个布尔值，表示Web Storage的类型(默认 true)。
- `options.isDeleteExpired` - 一个布尔值，表示是否删除过期的键值对(默认 false)。
- `options.parseFn` - 一个函数，表示解析JSON字符串的函数(默认 globalParseFn)。
- `options.decryptFn` - 一个函数，表示解密JSON字符串的函数(默认 null)。
- `options.isAsync` - 一个布尔值，表示是否异步获取(默认 false)。
### removeStorage(key, [options])
根据给定的键名从localStorage或sessionStorage中删除值。  
如果提供了options对象：
- `options.prefix` - 一个字符串，表示键名的前缀(默认 globalPrefix)。
- `options.isLocalStorage` - 一个布尔值，表示Web Storage的类型(默认 true)。
- `options.isAsync` - 一个布尔值，表示是否异步删除(默认 false)。
### setGlobalPrefix(prefix)
设置键名的全局前缀。`globalPrefix` 默认值为 `'st-'`。
### setGlobalStringifyFn(stringifyFn)
设置将js值转换为JSON字符串的全局函数。`globalStringifyFn` 默认值为 `JSON.stringify`。
### setGlobalParseFn(parseFn)
设置解析JSON字符串的全局函数。`globalParseFn` 默认值为 `JSON.parse`。
### setGlobalEncryptFn(encryptFn)
设置加密字符串的全局函数。`globalEncryptFn` 默认值为 `null`。
### setGlobalDecryptFn(decryptFn)
设置解密已加密字符串的全局函数。`globalDecryptFn` 默认值为 `null`。
### stringify(data, [replacer])
增强版的 `JSON.stringify`，额外支持function、regexp、date、undefined、NaN、Infinity、-Infinity、bigint类型。  
如果指定了一个 replacer 函数，则可以选择性地替换值。
```typescript
import { stringify } from 'web-storage-plus'

const test = { a: 1,b: 2 }

stringify(test, (key, value) => {
  if (key === 'a') {
    return value + 1
  }
  return value
}) // {"a":2,"b":2}
```
### parse(json, [reviver])
增强版的 `JSON.parse`，额外支持function、regexp、date、undefined、NaN、Infinity、-Infinity、bigint类型。  
提供可选的 reviver 函数用以在返回之前对所得到的对象执行变换 (操作)。
```typescript
import { parse } from 'web-storage-plus'

const json = '{"a":1,"b":2}'

parse(json, (key, value) => {
  if (key === 'a') {
    return value + 1
  }
  return value
}) // {a: 2, b: 2}
```
### encode(str)
将字符串编码为base64格式。
### decode(str)
将base64格式的字符串解码。
## 测试
[测试用例](https://github.com/wansongtao/web-storage-plus/blob/main/test/storage.test.ts)
## 许可证
[MIT](https://github.com/wansongtao/web-storage-plus/blob/main/LICENSE)