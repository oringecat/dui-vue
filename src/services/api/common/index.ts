import http from '@/services/http'
import type { ApiOptions } from '@/services/http/types'

/**
 * 获取服务器时间
 */
export function createServerTime(options?: ApiOptions<{ res: number; }>) {
    return http.createRequest({
        method: 'GET',
        url: '/server/time',
        options
    })
}