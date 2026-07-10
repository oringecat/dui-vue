import type { MockMethod } from 'vite-plugin-mock'
import { mockResponse } from './mock-utils'

export default [
    {
        url: '/api/product/list',
        method: 'get',
        rawResponse: (req, res) => {
            mockResponse(res, {
                code: 200,
                message: 'ok',
                data: Array.from({ length: 20 }, (_, i) => ({
                    id: 1000 + i,
                    productName: '@ctitle(10,20)', // 随机中文标题（10-20字）
                    status: '@integer(1, 2)'
                })),
                total: 200
            })
        }
    }
] as MockMethod[]