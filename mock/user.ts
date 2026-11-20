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
                realName: '李兔饼',
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
                realName: '李兔饼',
                avatar: 'https://picsum.photos/200/200',
                token: '@string(60)'
            },
            total: 0
        })
    },
    {
        url: serviceConfig.apiUrl + '/user/auth',
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
    },
    {
        url: serviceConfig.apiUrl + '/admin/role',
        method: 'get',
        rawResponse: (req, res) => {
            const data = [
                { id: 1000, roleName: '运营中心', status: 1, creatorName: 'admin', updateTime: 1761465600000 },
                { id: 2000, roleName: '财务总监', status: 1, creatorName: 'admin', updateTime: 1761465600000 },
                { id: 3000, roleName: '客服组', status: 1, creatorName: 'admin', updateTime: 1761638400000 },
                { id: 4000, roleName: '仓储管理员', status: 2, creatorName: 'admin', updateTime: 1761638400000 }
            ] as User.AdminRoleItem[]

            mockResponse(res, {
                code: 200,
                message: 'ok',
                data,
                total: data.length
            })
        }
    },
    {
        url: serviceConfig.apiUrl + '/admin/role/detail',
        method: 'get',
        rawResponse: (req, res) => {
            const data = {
                id: 1000, parentId: 0, roleName: '运营中心', authCodes: ['product', 'product-list', 'product-list-add', 'product-list-shelve', 'product-list-unshelve', 'product-list-modify', 'product-list-delete', 'product-category', 'product-category-add', 'product-category-modify', 'order', 'order-list', 'order-list-tb', 'order-list-tb-ship', 'order-list-tb-details', 'game', 'game-list'], status: 1, creatorId: -1, creatorName: 'admin', createTime: 1761465600000, updateTime: 1761465600000,
                children: [
                    {
                        id: 1100, parentId: 1000, roleName: '商品运营', authCodes: ['product', 'product-list', 'product-list-add', 'product-list-shelve', 'product-list-unshelve', 'product-list-modify', 'product-list-delete', 'product-category'], status: 1, creatorId: 1000, creatorName: '运营中心', createTime: 1761552000000, updateTime: 1761552000000, children: [
                            { id: 1110, parentId: 1100, roleName: '审核专员', authCodes: ['product', 'product-list', 'product-list-modify'], status: 1, creatorId: 1100, creatorName: '商品运营', createTime: 1761638400000, updateTime: 1761638400000, children: [] },
                            { id: 1120, parentId: 1100, roleName: '类目管理员', authCodes: ['product', 'product-category', 'product-category-add', 'product-category-modify'], status: 1, creatorId: 1100, creatorName: '商品运营', createTime: 1761638400000, updateTime: 1761638400000, children: [] }
                        ]
                    },
                    { id: 1300, parentId: 1000, roleName: '发货部', authCodes: ['order', 'order-list', 'order-list-tb', 'order-list-tb-ship'], status: 1, creatorId: 1000, creatorName: '运营中心', createTime: 1761552000000, updateTime: 1761552000000, children: [] },
                    { id: 1200, parentId: 1000, roleName: '游戏运营', authCodes: ['game', 'game-list'], status: 1, creatorId: 1000, creatorName: '运营中心', createTime: 1761552000000, updateTime: 1761552000000, children: [] },
                ]
            } as User.AdminRoleDetail

            mockResponse(res, {
                code: 200,
                message: 'ok',
                data,
                total: 0
            })
        }
    }
] as MockMethod[]