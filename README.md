# web-storage-plus
Enhanced browser localStorage and sessionStorage, with support for setting expiration time and key name prefixes.  
浏览器本地存储与会话存储加强，支持设置过期时间与键名前缀。
## install
```bash
$ npm install web-storage-plus

$ yarn add web-storage-plus

$ pnpm add web-storage-plus
```
## example
### TS
```typescript
import { setStorage, getStorage, removeStorage, setGlobalPrefix } from 'web-storage-plus'

const data = { name: 'test', data: 'this is a test.' }
setGlobalPrefix('test_')

setStorage('storage', data, { maxAge: 60 * 60 * 24 * 7 })

getStorage<{ name: string; data: string; }>('storage') // { name: 'test', data: 'this is a test.' }

removeStorage('storage')
```
### JS
```javascript
import { setStorage, getStorage, removeStorage } from 'web-storage-plus'

const data = { name: 'test', data: 'this is a test.' }

setStorage('storage', data, { maxAge: 60 * 60 * 24 * 7, prefix: 'test-', isLocalStorage: false })

getStorage('storage', { prefix: 'test-', isLocalStorage: false }) // { name: 'test', data: 'this is a test.' }

removeStorage('storage', { prefix: 'test-', isLocalStorage: false })
```
## API
### setStorage(key, value, [options])
Set the given key-value pair, in the form of a JSON string, in localStorage or sessionStorage.  
If the options object is provided:
- `options.maxAge` -  a number representing the seconds from for expiry(it does not expire by default).
- `options.prefix` - a string representing the prefix of the key name(default globalPrefix).
- `options.isLocalStorage` - a boolean representing the type of Web Storage(default true).
### getStorage(key, [options])
Get the value of the given key in localStorage or sessionStorage.  
If the options object is provided:
- `options.prefix` - a string representing the prefix of the key name(default globalPrefix).
- `options.isLocalStorage` - a boolean representing the type of Web Storage(default true).
- `options.isDeleteExpired` - a boolean representing whether to delete the expired key-value(default false).

### removeStorage(key, [options])
Remove the given key in localStorage or sessionStorage.  
If the options object is provided:
- `options.prefix` - a string representing the prefix of the key name(default globalPrefix).
- `options.isLocalStorage` - a boolean representing the type of Web Storage(default true).
### setGlobalPrefix(prefix)
Set the global prefix of the key name.  
## License
[MIT](https://github.com/wansongtao/web-storage-plus/blob/main/LICENSE)