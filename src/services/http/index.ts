import { shallowRef, computed } from 'vue'
import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import type { RequestConfig, RequestShape, BaseResponse } from './types'
import { ResultCode } from './types'
import { useTransitionStore } from '@/stores/transition'
import { useLoginStore } from '@/stores/login'
import serviceConfig from '@/services/config'

export type { ApiOptions, RequestOptions } from './types'

export default new (class {
    constructor() {
        this.axiosInstance.interceptors.request.use((config) => {
            if (!config.baseURL) {
                config.baseURL = serviceConfig.getServiceConfig('apiUrl')
            }
            return config
        })
    }

    private readonly axiosInstance = axios.create({
        timeout: 30000,
    })

    private isBaseResponse(obj: unknown): obj is BaseResponse {
        if (obj instanceof Object) {
            return 'code' in obj && 'message' in obj
        }
        return false
    }

    request<T>(config: AxiosRequestConfig) {
        const transitionStore = useTransitionStore()

        return new Promise<T>((resolve, reject) => {
            this.axiosInstance.request<T>(config).then((res) => {
                // 延迟返回结果，防止动画过程中实时渲染，导致动画卡顿
                transitionStore.addTask(() => resolve(res.data))
            }).catch(reject)
        })
    }

    // 获取公共请求头
    getPublicHeaders() {
        const loginStore = useLoginStore()
        const timestamp = Date.now()

        return {
            timestamp,
            authorization: loginStore.token
        }
    }

    createRequest<T extends RequestShape>(config: RequestConfig<T>) {
        const { method = 'GET', url, options = {}, defaultData } = config

        const loading = shallowRef(false)
        const failedCount = shallowRef(0) // 失败计数

        // 失败状态
        const failed = computed({
            get: () => !loading.value && failedCount.value > 0,
            set: (status) => failedCount.value = Number(status)
        })

        const pendingRequests = new Map<string, { promise: Promise<T['res']>; controller: AbortController; }>()

        // 原始请求方法
        const rawFetch = async (data: Partial<T['req']> = {}) => {
            const mergedData = Array.isArray(data) ? data : { ...defaultData?.(), ...options.data, ...data }
            const requestKey = JSON.stringify(mergedData)

            // 复用同一个请求
            const pending = pendingRequests.get(requestKey)
            if (pending) {
                return pending.promise
            }

            loading.value = true
            if (pendingRequests.size === 0) {
                failedCount.value = 0
            }

            const controller = new AbortController()

            const promise = new Promise<T['res']>((resolve, reject) => {
                const requestConfig: AxiosRequestConfig = {
                    method,
                    url,
                    signal: controller.signal,
                    headers: options.headers ?? this.getPublicHeaders()
                }

                if (method.toLowerCase() === 'get') {
                    requestConfig.params = mergedData
                } else {
                    requestConfig.data = mergedData
                }

                this.request<T['res']>(requestConfig).then((res) => {
                    if (this.isBaseResponse(res)) {
                        switch (res.code) {
                            case ResultCode.Unauthorized:
                                failedCount.value++
                                reject('令牌无效')
                                break
                            case ResultCode.Success:
                                resolve(res)
                                break
                            default:
                                failedCount.value++
                                reject(res.message ?? '请求失败，请稍后再试')
                        }
                    } else {
                        resolve(res)
                    }
                }).catch((err) => {
                    // 中断不抛错
                    if (!axios.isCancel(err)) {
                        failedCount.value++
                    }
                    reject(err)
                }).finally(() => {
                    const current = pendingRequests.get(requestKey)
                    // 防误删相同请求
                    if (current?.controller === controller) {
                        pendingRequests.delete(requestKey)
                    }
                    loading.value = pendingRequests.size > 0
                })
            })

            pendingRequests.set(requestKey, { promise, controller })
            return promise
        }

        let requestId = 0
        let failedStatus = 0 // 防止旧请求慢于新请求返回失败覆盖新请求状态

        // 请求并自动处理回调
        const fetch = (data: Partial<T['req']> = {}) => {
            const currentId = ++requestId
            failedStatus = 0

            abort() // 取消之前的所有请求

            rawFetch(data).then((res) => {
                if (currentId === requestId) {
                    options.onSuccess?.(res)
                }
            }).catch((err) => {
                if (currentId === requestId && !axios.isCancel(err)) {
                    failedStatus = 1
                    options.onError?.(String(err))
                }
                failedCount.value = failedStatus
            }).finally(() => {
                if (currentId === requestId) {
                    options.onFinally?.()
                }
            })
        }

        // 取消所有请求
        const abort = () => {
            pendingRequests.forEach(({ controller }) => controller.abort())
            pendingRequests.clear()
        }

        const hasCallback = Boolean(options.onSuccess || options.onError || options.onFinally)

        // 是否自动请求
        if (!(options.manual ?? !hasCallback)) {
            fetch()
        }

        return {
            loading,
            failedCount,
            failed,
            rawFetch,
            fetch,
            abort
        }
    }
})