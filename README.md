# web-storage-plus
Enhanced browser local storage and session storage, with support for setting expiration time and key name prefixes.  
浏览器本地存储与会话存储加强，支持设置过期时间与键名前缀。

## install
```bash
$ npm install web-storage-plus
$ pnpm add web-storage-plus
```

## example
```typescript
import { setStorage, getStorage, removeStorage } from 'web-storage-plus'

const data = { name: 'test', data: 'this is a test.' };

setStorage('storage', data, { maxAge: 60 * 60 * 24 * 7, prefix: 'test_' })

getStorage<{ name: string; data: string; }>('storage', { prefix: 'test_' }) // { name: 'test', data: 'this is a test.' }

removeStorage('storage', { prefix: 'test_' })
```