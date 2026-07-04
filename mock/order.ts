import type { MockMethod } from 'vite-plugin-mock'
import { mockResponse } from './mock-utils'

export default [
    {
        url: '/api/order/list',
        method: 'get',
        rawResponse: (req, res) => {
            mockResponse(res, {
                code: 200,
                message: 'ok',
                data: Array.from({ length: 20 }, (_, i) => ({
                    id: 1000 + i,
                    orderNumber: String(Math.floor(1000000000 + Math.random() * 9000000000)), // 随机订单号
                    status: 1,
                    orderTime: Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
                })),
                total: 200
            })
        }
    }
] as MockMethod[]