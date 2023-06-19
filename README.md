# web-storage-plus
Enhanced browser local storage and session storage, with support for setting expiration time and key name prefixes.  
浏览器本地存储与会话存储加强，支持设置过期时间与键名前缀。

## install
```bash
$ npm install web-storage-plus
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

setStorage('storage', data, { maxAge: 60 * 60 * 24 * 7, prefix: 'test-' })

getStorage('storage', { prefix: 'test-' }) // { name: 'test', data: 'this is a test.' }

removeStorage('storage', { prefix: 'test-' })
```