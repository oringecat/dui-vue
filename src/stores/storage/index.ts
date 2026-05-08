import WebStorage from '@/utils/storage'
import type { LocalStorageKeys, SessionStorageKeys } from './types'

// 本地存储
export const localData = new WebStorage<LocalStorageKeys>(localStorage, {
    language: navigator.language,
    token: '',
    autoLoginEncrypted: '',
    rememberMe: false
})

// 会话存储
export const sessionData = new WebStorage<SessionStorageKeys>(sessionStorage, {
    token: '',
    statusEnums: [],
    errorCodes: []
})