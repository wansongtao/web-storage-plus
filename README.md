English | [简体中文](https://github.com/wansongtao/web-storage-plus/blob/main/README.zh-CN.md)
# web-storage-plus
Enhanced browser localStorage and sessionStorage, support for setting expiration time, key name prefix, functions to convert JS values to JSON strings, functions to convert JSON strings to JS values, encrypt functions, and decrypt functions.  

## Install
```bash
$ npm install web-storage-plus

$ yarn add web-storage-plus

$ pnpm add web-storage-plus
```
## Example
### simple
```typescript
import { setStorage, getStorage } from 'web-storage-plus'

const data = { name: 'test', data: 'this is a test.' }

setStorage('storage', data)
getStorage<{ name: string; data: string; }>('storage') // { name: 'test', data: 'this is a test.' }
```
### more
```typescript
import { setStorage, getStorage, removeStorage, stringify, parse, setGlobalStringifyFn, setGlobalParseFn, setGlobalPrefix } from 'web-storage-plus'

const test = {
  a: /[0-9]+/gi,
  b: new Date(1688543045842),
  k: 'type: {{t}}-value: {{1}}',
  test: 1
}

setGlobalPrefix('t-')
setGlobalStringifyFn(JSON.stringify)
setGlobalParseFn(JSON.parse)

setStorage('s', test, { maxAge: 1, prefix: '', isLocalStorage: false, stringifyFn: stringify, encryptFn: (v) => encodeURIComponent(v) })

getStorage('s', { prefix: '', isLocalStorage: false, isDeleteExpired: true, parseFn: parse, decryptFn: (v) => decodeURIComponent(v) })

removeStorage('s', { prefix: '', isLocalStorage: false })

/**
 * {
 * "a":"type: {{regexp}}-value: {{/[0-9]+/gi}}",
 * "b":"type: {{date}}-value: {{1688543045842}}",
 * "k":"type: {{original}}-value: {{type: {{t}}-value: {{1}}}}",
 * "test":1
 * }
 */
const json = stringify(test)
parse(json) // {a: /[0-9]+/gi, b: new Date(1688543045842),k: 'type: {{t}}-value: {{1}}', test: 1}
```
## API
### setStorage(key, value, [options])
Set the given key-value pair, in the form of a JSON string, in localStorage or sessionStorage.  
If the options object is provided:
- `options.maxAge` -  a number representing the seconds from for expiry(it does not expire by default).
- `options.prefix` - a string representing the prefix of the key name(default globalPrefix).
- `options.isLocalStorage` - a boolean representing the type of Web Storage(default true).
- `options.stringifyFn` - a function representing the function to convert JS values to JSON strings(default globalStringifyFn).
- `options.encryptFn` - a function representing the function to encrypt the JSON string(default null).
### getStorage(key, [options])
Get the value of the given key in localStorage or sessionStorage.  
If the options object is provided:
- `options.prefix` - a string representing the prefix of the key name(default globalPrefix).
- `options.isLocalStorage` - a boolean representing the type of Web Storage(default true).
- `options.isDeleteExpired` - a boolean representing whether to delete the expired key-value(default false).
- `options.parseFn` - a function representing the function to convert JSON strings to JS values(default globalParseFn).
- `options.decryptFn` - a function representing the function to decrypt the encrypted string(default null).
### removeStorage(key, [options])
Remove the given key in localStorage or sessionStorage.  
If the options object is provided:
- `options.prefix` - a string representing the prefix of the key name(default globalPrefix).
- `options.isLocalStorage` - a boolean representing the type of Web Storage(default true).
### setGlobalPrefix(prefix)
Set the global prefix of the key name. `globalPrefix` default `'st-'`.
### setGlobalStringifyFn(stringifyFn)
Set the global function to convert JS values to JSON strings. `globalStringifyFn` default `JSON.stringify`.
### setGlobalParseFn(parseFn)
Set the global function to convert JSON strings to JS values. `globalParseFn` default `JSON.parse`.
### setGlobalEncryptFn(encryptFn)
Set the global function to encrypt the string. `globalEncryptFn` default `null`.
### setGlobalDecryptFn(decryptFn)
Set the global function to decrypt the encrypted string. `globalDecryptFn` default `null`.
### stringify(data)
enhanced `JSON.stringify`, support function, regexp, date, undefined, NaN, Infinity, -Infinity, bigint.
### parse(json)
enhanced `JSON.parse`, support function, regexp, date, undefined, NaN, Infinity, -Infinity, bigint.
### encode(data)
encode string to base64.
### decode(data)
decode base64 to string.
## Test
[Test cases](https://github.com/wansongtao/web-storage-plus/blob/main/test/storage.test.ts)
## License
[MIT](https://github.com/wansongtao/web-storage-plus/blob/main/LICENSE)