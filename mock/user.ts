import type { MockMethod } from 'vite-plugin-mock'
import { mockResponse, serviceConfig } from './mock-utils'

export default [
    {
        url: serviceConfig.apiUrl + '/user/login',
        method: 'post',
        rawResponse: (req, res) => mockResponse(res, {
            code: 200,
            message: 'ok',
            data: {
                id: 1000,
                roleId: -1,
                userName: 'admin',
                realName: '@cname', // 随机中文名
                avatar: 'https://picsum.photos/200/200', // 随机头像
                token: '@string(60)' // 随机60位token
            },
            total: 0
        }, 1000)
    },
    {
        url: serviceConfig.apiUrl + '/user/logout',
        method: 'post',
        rawResponse: (req, res) => mockResponse(res, {
            code: 200,
            message: 'ok',
            data: {},
            total: 0
        })
    },
    {
        url: serviceConfig.apiUrl + '/user/checktoken',
        method: 'get',
        rawResponse: (req, res) => mockResponse(res, {
            code: 200,
            message: 'ok',
            data: {
                id: 1000,
                roleId: -1,
                userName: 'admin',
                realName: '@cname',
                avatar: 'https://picsum.photos/200/200',
                token: '@string(60)'
            },
            total: 0
        })
    },
    {
        url: serviceConfig.apiUrl + '/user/auths',
        method: 'get',
        rawResponse: (req, res) => {
            const data = ['product', 'product-list', 'product-list-add', 'product-list-shelve', 'product-list-unshelve', 'product-list-modify', 'product-list-delete', 'order', 'order-list', 'order-list-tb', 'order-list-tb-ship', 'order-list-tb-details', 'order-list-jd']
            const total = data.length

            mockResponse(res, {
                code: 200,
                message: 'ok',
                data,
                total
            })
        }
    }
] as MockMethod[]