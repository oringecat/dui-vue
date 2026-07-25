import type { MockMethod } from 'vite-plugin-mock'
import { mockResponse, serviceConfig } from './mock-utils'

export default [
    {
        url: '/dui/server/config',
        method: 'get',
        rawResponse: (req, res) => mockResponse(res, {
            code: 200,
            message: 'ok',
            data: serviceConfig,
            total: 0
        })
    },
    {
        url: serviceConfig.apiUrl + '/server/time',
        method: 'get',
        rawResponse: (req, res) => mockResponse(res, {
            code: 200,
            message: 'ok',
            data: Date.now(),
            total: 0
        })
    }
] as MockMethod[]