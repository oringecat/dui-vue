import { shallowRef } from 'vue'
import axios from 'axios'
import type { AxiosRequestConfig, Method } from 'axios'
import type { RequestOptions, BaseResponse } from './types'
import { ResultCode } from './types'
import { useTransitionStore } from '@/stores/transition'
import { useUserStore } from '@/stores/user'
//import serviceConfig from '@/services/config'

export default new (class {
    constructor() {
        // serviceConfig.onReady(() => {
        //     const baseUrl = serviceConfig.getServiceConfig('apiUrl')
        //     this.axiosInstance.defaults.baseURL = baseUrl
        // })
    }

    private readonly axiosInstance = axios.create({
        timeout: 30000,
    })

    private createHeader() {
        const userStore = useUserStore()
        const timestamp = Date.now()

        return {
            timestamp,
            authorization: userStore.token
        }
    }

    private isBaseResponse(obj: unknown): obj is BaseResponse {
        if (obj instanceof Object) {
            return 'code' in obj && 'data' in obj
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

    createRequest<Req extends object, Res>(method: Method, url: string, options: RequestOptions<{ req: Req, res: Res }> = {}) {
        const loading = shallowRef(false)
        const pendingRequests = new Map<string, { promise: Promise<Res>; controller: AbortController; }>()

        // 原始请求方法
        const rawFetch = (data: Partial<Req> = {}) => {
            const mergedData = { ...options.data, ...data }
            const requestKey = JSON.stringify(mergedData)

            // 复用同一个请求
            const pending = pendingRequests.get(requestKey)
            if (pending) {
                return pending.promise
            }

            loading.value = true

            const controller = new AbortController()

            const promise = new Promise<Res>((resolve, reject) => {
                const requestConfig: AxiosRequestConfig = {
                    method,
                    url,
                    signal: controller.signal,
                    headers: this.createHeader()
                }

                if (method.toLowerCase() === 'get') {
                    requestConfig.params = mergedData
                } else {
                    requestConfig.data = mergedData
                }

                this.request<Res>(requestConfig).then((res) => {
                    if (this.isBaseResponse(res)) {
                        switch (res.code) {
                            case ResultCode.Unauthorized:
                                //退出登录
                                //logout();
                                reject('令牌无效')
                                break
                            case ResultCode.Success:
                                resolve(res)
                                break
                            default:
                                reject(res.message ?? '请求失败，请稍后再试')
                        }
                    } else {
                        resolve(res)
                    }
                }).catch((err) => {
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
        const fetch = async (data: Partial<Req> = {}) => {
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
        if (options.immediate) {
            fetch()
        }

        return {
            loading,
            rawFetch,
            fetch,
            abort
        }
    }
})