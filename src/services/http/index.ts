import { shallowRef } from 'vue'
import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import type { RequestConfig, RequestShape, BaseResponse } from './types'
import { ResultCode } from './types'
import { useTransitionStore } from '@/stores/transition'
import { useUserStore } from '@/stores/user'
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
            }).catch((err) => {
                if (axios.isCancel(err)) {
                    console.warn('请求中断')
                }
                reject(err)
            })
        })
    }

    // 获取公共请求头
    getPublicHeaders() {
        const userStore = useUserStore()
        const timestamp = Date.now()

        return {
            timestamp,
            authorization: userStore.token
        }
    }

    createRequest<T extends RequestShape>(config: RequestConfig<T>) {
        const { method = 'GET', url, options = {}, defaultData } = config

        const loading = shallowRef(false)
        const failed = shallowRef(false) // 失败状态
        const pendingRequests = new Map<string, { promise: Promise<T['res']>; controller: AbortController; }>()

        // 原始请求方法
        const rawFetch = (data: Partial<T['req']> = {}) => {
            const mergedData = { ...defaultData?.(), ...options.data, ...data }
            const requestKey = JSON.stringify(mergedData)

            // 复用同一个请求
            const pending = pendingRequests.get(requestKey)
            if (pending) {
                return pending.promise
            }

            loading.value = true
            failed.value = false

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
                                failed.value = true
                                reject('令牌无效')
                                break
                            case ResultCode.Success:
                                resolve(res)
                                break
                            default:
                                failed.value = true
                                reject(res.message ?? '请求失败，请稍后再试')
                        }
                    } else {
                        resolve(res)
                    }
                }).catch((err) => {
                    failed.value = true
                    reject(err)
                }).finally(() => {
                    loading.value = false
                    pendingRequests.delete(requestKey)
                })
            })

            pendingRequests.set(requestKey, { promise, controller })
            return promise
        }

        // 请求并自动处理回调
        const fetch = async (data: Partial<T['req']> = {}) => {
            try {
                const res = await rawFetch(data)
                options.onSuccess?.(res)
            } catch (err) {
                options.onError?.(String(err))
            } finally {
                options.onFinally?.()
            }
        }

        // 取消所有请求
        const abort = () => {
            pendingRequests.forEach(({ controller }) => controller.abort())
            pendingRequests.clear()
        }

        // 默认立即请求
        if (!options.manual) {
            fetch()
        }

        return {
            loading,
            failed,
            rawFetch,
            fetch,
            abort
        }
    }
})