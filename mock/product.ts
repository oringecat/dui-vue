import type { MockMethod } from 'vite-plugin-mock'
import { parse } from 'url'
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
    },
    {
        url: '/api/product/category',
        method: 'get',
        rawResponse: (req, res) => {
            mockResponse(res, {
                code: 200,
                message: 'ok',
                data: [
                    { id: 1000, parentId: 0, categoryName: '数码', status: 1, icon: '', sort: 1 },
                    { id: 1100, parentId: 1000, categoryName: '手机通讯', status: 1, icon: '', sort: 1 },
                    { id: 1110, parentId: 1100, categoryName: '智能手机', status: 1, icon: '', sort: 1 },
                    { id: 1200, parentId: 1000, categoryName: '电脑办公', status: 1, icon: '', sort: 2 },

                    { id: 2000, parentId: 0, categoryName: '服装鞋帽', status: 1, icon: '', sort: 2 },
                    { id: 2100, parentId: 2000, categoryName: '男装', status: 1, icon: '', sort: 1 },
                    { id: 2200, parentId: 2000, categoryName: '女装', status: 1, icon: '', sort: 2 },

                    { id: 3000, parentId: 0, categoryName: '食品饮料', status: 1, icon: '', sort: 3 },
                    { id: 3100, parentId: 3000, categoryName: '休闲零食', status: 1, icon: '', sort: 1 },
                    { id: 3200, parentId: 3000, categoryName: '生鲜水果', status: 1, icon: '', sort: 2 }
                ],
                total: 30
            })
        }
    },
    {
        url: '/api/product/category/sale-attribute',
        method: 'get',
        rawResponse: (req, res) => {
            const { categoryId } = parse(req.url!, true).query

            const saleDataMap: Record<number, { id: number; categoryId: number; saleName: string; isCustom: boolean }[]> = {
                1110: [ // 智能手机
                    { id: 100, categoryId: 1110, saleName: '颜色', isCustom: true },
                    { id: 101, categoryId: 1110, saleName: '存储容量', isCustom: false },
                    { id: 102, categoryId: 1110, saleName: '网络制式', isCustom: false },
                ],
                3100: [ // 休闲零食
                    { id: 200, categoryId: 3100, saleName: '口味', isCustom: true },
                    { id: 201, categoryId: 3100, saleName: '包装规格', isCustom: false },
                ],
            }

            const data = saleDataMap[Number(categoryId)] || []

            mockResponse(res, {
                code: 200,
                message: 'ok',
                data,
                total: data.length
            })
        }
    },
    {
        url: '/api/product/category/sale-spec',
        method: 'get',
        rawResponse: (req, res) => {
            const { saleId } = parse(req.url!, true).query

            const specDataMap: Record<number, { id: number; saleId: number; specName: string }[]> = {
                100: [ // 颜色
                    { id: 1001, saleId: 100, specName: '亮黑色' },
                    { id: 1002, saleId: 100, specName: '珠光白' },
                    { id: 1003, saleId: 100, specName: '极光蓝' },
                    { id: 1004, saleId: 100, specName: '樱粉金' },
                ],
                101: [ // 存储容量
                    { id: 1011, saleId: 101, specName: '128GB' },
                    { id: 1012, saleId: 101, specName: '256GB' },
                    { id: 1013, saleId: 101, specName: '512GB' },
                ],
                102: [ // 网络制式
                    { id: 1021, saleId: 102, specName: '全网通5G' },
                    { id: 1022, saleId: 102, specName: '移动5G' },
                    { id: 1023, saleId: 102, specName: '联通5G' },
                ],
                200: [ // 口味
                    { id: 2001, saleId: 200, specName: '原味' },
                    { id: 2002, saleId: 200, specName: '麻辣' },
                    { id: 2003, saleId: 200, specName: '五香' },
                    { id: 2004, saleId: 200, specName: '烧烤' },
                ],
                201: [ // 包装规格
                    { id: 2011, saleId: 201, specName: '100g' },
                    { id: 2012, saleId: 201, specName: '200g' },
                    { id: 2013, saleId: 201, specName: '500g' },
                    { id: 2014, saleId: 201, specName: '1kg' },
                ],
            }

            const data = specDataMap[Number(saleId)] || []

            mockResponse(res, {
                code: 200,
                message: 'ok',
                data,
                total: data.length
            })
        }
    }
] as MockMethod[]