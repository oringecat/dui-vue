import type { MockMethod } from 'vite-plugin-mock'
import { parse } from 'url'
import { mockResponse, serviceConfig } from './mock-utils'

export default [
    {
        url: serviceConfig.apiUrl + '/product/list',
        method: 'get',
        rawResponse: (req, res) => {
            mockResponse(res, {
                code: 200,
                message: 'ok',
                data: Array.from({ length: 20 }, (_, i) => ({
                    id: 1000 + i,
                    categoryId: 1110,
                    title: '@ctitle(10,20)', // 随机中文标题（10-20字）
                    status: '@integer(1, 2)',
                    createTime: Date.now()
                })),
                total: 200
            })
        }
    },
    {
        url: serviceConfig.apiUrl + '/product/category',
        method: 'get',
        rawResponse: (req, res) => {
            mockResponse(res, {
                code: 200,
                message: 'ok',
                data: [
                    { id: 1000, parentId: 0, code: 'digital', categoryName: '数码', status: 1, icon: '', sort: 1 },
                    { id: 1100, parentId: 1000, code: 'phone', categoryName: '手机通讯', status: 1, icon: '', sort: 1 },
                    { id: 1110, parentId: 1100, code: 'smartphone', categoryName: '智能手机', status: 1, icon: '', sort: 1 },
                    { id: 1200, parentId: 1000, code: 'computer', categoryName: '电脑办公', status: 1, icon: '', sort: 2 },

                    { id: 2000, parentId: 0, code: 'clothing', categoryName: '服装鞋帽', status: 1, icon: '', sort: 2 },
                    { id: 2100, parentId: 2000, code: 'menswear', categoryName: '男装', status: 1, icon: '', sort: 1 },
                    { id: 2200, parentId: 2000, code: 'womenswear', categoryName: '女装', status: 1, icon: '', sort: 2 },

                    { id: 3000, parentId: 0, code: 'food', categoryName: '食品饮料', status: 1, icon: '', sort: 3 },
                    { id: 3100, parentId: 3000, code: 'snacks', categoryName: '休闲零食', status: 1, icon: '', sort: 1 },
                    { id: 3200, parentId: 3000, code: 'fruit', categoryName: '生鲜水果', status: 1, icon: '', sort: 2 }
                ],
                total: 30
            })
        }
    },
    {
        url: serviceConfig.apiUrl + '/product/category/attribute',
        method: 'get',
        rawResponse: (req, res) => {
            const { categoryId } = parse(req.url!, true).query

            const attrDataMap: Record<number, { id: number; categoryId: number; attributeName: string; type: number; required: boolean }[]> = {
                1110: [ // 智能手机
                    { id: 100, categoryId: 1110, attributeName: '品牌', type: 2, required: true },
                    { id: 101, categoryId: 1110, attributeName: '型号', type: 1, required: true },
                    { id: 102, categoryId: 1110, attributeName: '屏幕尺寸', type: 2, required: false },
                    { id: 103, categoryId: 1110, attributeName: '操作系统', type: 2, required: false },
                    { id: 104, categoryId: 1110, attributeName: '电池容量(mAh)', type: 4, required: false },
                ],
                3100: [ // 休闲零食
                    { id: 200, categoryId: 3100, attributeName: '品牌', type: 2, required: true },
                    { id: 201, categoryId: 3100, attributeName: '产地', type: 1, required: false },
                    { id: 202, categoryId: 3100, attributeName: '保质期(天)', type: 4, required: true },
                ],
            }

            const data = attrDataMap[Number(categoryId)] || []

            mockResponse(res, {
                code: 200,
                message: 'ok',
                data,
                total: data.length
            })
        }
    },
    {
        url: serviceConfig.apiUrl + '/product/category/sale-attribute',
        method: 'get',
        rawResponse: (req, res) => {
            const { categoryId } = parse(req.url!, true).query

            const saleDataMap: Record<number, { id: number; categoryId: number; saleName: string; isCustom: boolean }[]> = {
                1110: [ // 智能手机
                    { id: 100, categoryId: 1110, saleName: '颜色', isCustom: true },
                    { id: 101, categoryId: 1110, saleName: '容量', isCustom: false },
                    { id: 102, categoryId: 1110, saleName: '网络', isCustom: false },
                ],
                3100: [ // 休闲零食
                    { id: 200, categoryId: 3100, saleName: '口味', isCustom: true },
                    { id: 201, categoryId: 3100, saleName: '包装', isCustom: false },
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
        url: serviceConfig.apiUrl + '/product/detail',
        method: 'get',
        rawResponse: (req, res) => {
            mockResponse(res, {
                code: 200,
                message: 'ok',
                data: {
                    id: 1000,
                    userId: 0,
                    categoryId: 1110,
                    shopCategoryId: 1110,
                    title: 'iPhone 15 Pro Max 智能手机',
                    brandId: 2,
                    brandName: 'Apple',
                    tags: 'iPhone,Apple,5G,智能手机',
                    attrs: [
                        { id: 1000, attributeId: 100, attributeValue: 'Apple' },
                        { id: 1001, attributeId: 101, attributeValue: 'iPhone 15 Pro Max' },
                        { id: 1002, attributeId: 102, attributeValue: '6.7英寸' },
                        { id: 1003, attributeId: 103, attributeValue: 'iOS 17' },
                        { id: 1004, attributeId: 104, attributeValue: '4422' },
                    ],
                    images: [
                        { id: 1000, url: 'https://picsum.photos/seed/iphone1/800/800', size: 'large', isMain: true },
                        { id: 1001, url: 'https://picsum.photos/seed/iphone2/800/800', size: 'large', isMain: false },
                        { id: 1002, url: 'https://picsum.photos/seed/iphone3/800/800', size: 'large', isMain: false },
                    ],
                    description: '<h3>产品详情</h3><p>iPhone 15 Pro Max 搭载 <strong>A17 Pro 芯片</strong>，性能空前强大。采用航空航天级钛金属设计，坚固轻盈。4800 万像素主摄带来专业级摄影体验，支持新一代人像模式。USB-C 接口统一充电生态，动作按钮让你一键直达常用功能。</p><h4>包装清单</h4><ul><li>iPhone 15 Pro Max ×1</li><li>USB-C 充电线 ×1</li><li>卡针 ×1</li><li>说明书 ×1</li></ul><h4>售后保障</h4><p>Apple 官方一年有限保修，享受 AppleCare+ 延长保修服务（需单独购买）。</p>',
                    status: 1,
                    createTime: Date.now(),
                    updateTime: Date.now(),
                },
                total: 1,
            })
        },
    },
    {
        url: serviceConfig.apiUrl + '/product/spu/list',
        method: 'get',
        rawResponse: (req, res) => {
            mockResponse(res, {
                code: 200,
                message: 'ok',
                data: [
                    {
                        id: 10001,
                        code: 'SP0001',
                        spuName: 'iPhone 15 Pro',
                        spuContent: 'A17 Pro 芯片，钛金属设计，4800 万像素主摄，支持 USB-C，动作按钮，灵动岛交互',
                        isCustom: false,
                        skus: [
                            {
                                id: 1000,
                                code: 'SP0001-001',
                                attrs: [
                                    { saleId: 100, specId: 1003, customName: '原色钛金属', image: '', thumbnail: '' },
                                    { saleId: 101, specId: 1012, customName: '256GB', image: '', thumbnail: '' },
                                    { saleId: 102, specId: 1021, customName: '全网通5G', image: '', thumbnail: '' },
                                ],
                                price: 6999,
                                stock: 50,
                            },
                            {
                                id: 1001,
                                code: 'SP0001-002',
                                attrs: [
                                    { saleId: 100, specId: 1003, customName: '极光蓝', image: '', thumbnail: '' },
                                    { saleId: 101, specId: 1013, customName: '512GB', image: '', thumbnail: '' },
                                    { saleId: 102, specId: 1021, customName: '全网通5G', image: '', thumbnail: '' },
                                ],
                                price: 7998,
                                stock: 0,
                            },
                            {
                                id: 1002,
                                code: 'SP0001-003',
                                attrs: [
                                    { saleId: 100, specId: 1004, customName: '樱粉金', image: '', thumbnail: '' },
                                    { saleId: 101, specId: 1013, customName: '512GB', image: '', thumbnail: '' },
                                    { saleId: 102, specId: 1021, customName: '全网通5G', image: '', thumbnail: '' },
                                ],
                                price: 11999,
                                stock: 25,
                            },
                        ],
                    },
                ],
                total: 1,
            })
        },
    },
    {
        url: serviceConfig.apiUrl + '/product/category/sale-spec',
        method: 'get',
        rawResponse: (req, res) => {
            const { categoryId } = parse(req.url!, true).query

            // 按 saleId 组织的规格数据
            const specDataMap: Record<number, { id: number; categoryId: number; saleId: number; specName: string }[]> = {
                100: [ // 颜色 → 智能手机(1110)
                    { id: 1001, categoryId: 1110, saleId: 100, specName: '亮黑色' },
                    { id: 1002, categoryId: 1110, saleId: 100, specName: '珠光白' },
                    { id: 1003, categoryId: 1110, saleId: 100, specName: '极光蓝' },
                    { id: 1004, categoryId: 1110, saleId: 100, specName: '樱粉金' },
                ],
                101: [ // 存储容量 → 智能手机(1110)
                    { id: 1011, categoryId: 1110, saleId: 101, specName: '128GB' },
                    { id: 1012, categoryId: 1110, saleId: 101, specName: '256GB' },
                    { id: 1013, categoryId: 1110, saleId: 101, specName: '512GB' },
                ],
                102: [ // 网络制式 → 智能手机(1110)
                    { id: 1021, categoryId: 1110, saleId: 102, specName: '全网通5G' },
                    { id: 1022, categoryId: 1110, saleId: 102, specName: '移动5G' },
                    { id: 1023, categoryId: 1110, saleId: 102, specName: '联通5G' },
                ],
                200: [ // 口味 → 休闲零食(3100)
                    { id: 2001, categoryId: 3100, saleId: 200, specName: '原味' },
                    { id: 2002, categoryId: 3100, saleId: 200, specName: '麻辣' },
                    { id: 2003, categoryId: 3100, saleId: 200, specName: '五香' },
                    { id: 2004, categoryId: 3100, saleId: 200, specName: '烧烤' },
                ],
                201: [ // 包装规格 → 休闲零食(3100)
                    { id: 2011, categoryId: 3100, saleId: 201, specName: '100g' },
                    { id: 2012, categoryId: 3100, saleId: 201, specName: '200g' },
                    { id: 2013, categoryId: 3100, saleId: 201, specName: '500g' },
                    { id: 2014, categoryId: 3100, saleId: 201, specName: '1kg' },
                ],
            }

            const data = Object.values(specDataMap).flat().filter((item) => item.categoryId === Number(categoryId))

            mockResponse(res, {
                code: 200,
                message: 'ok',
                data,
                total: data.length
            })
        }
    }
] as MockMethod[]