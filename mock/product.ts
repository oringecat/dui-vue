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
                    price: '@float(100, 9999, 2, 2)', // 随机价格（100-9999，两位小数）
                    image: {
                        url: `https://picsum.photos/seed/product${1000 + i}`,
                        width: Math.floor(Math.random() * 51) + 250,
                        height: Math.floor(Math.random() * 51) + 250
                    },
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
            const { categoryId } = parse(req.url!, true).query
            const categories = [
                { id: 1000, parentId: 0, code: 'digital', categoryName: '数码', status: 1, icon: '', sort: 1, attrs: [], sales: [] },
                { id: 1100, parentId: 1000, code: 'phone', categoryName: '手机通讯', status: 1, icon: '', sort: 1, attrs: [], sales: [] },
                {
                    id: 1110, parentId: 1100, code: 'smartphone', categoryName: '智能手机', status: 1, icon: '', sort: 1,
                    attrs: [
                        { id: 100, attributeId: 100, valueType: 2, required: true },
                        { id: 101, attributeId: 101, valueType: 1, required: true },
                        { id: 102, attributeId: 102, valueType: 2, required: false },
                        { id: 103, attributeId: 103, valueType: 2, required: false },
                        { id: 104, attributeId: 104, valueType: 3, required: false },
                    ],
                    sales: [
                        { id: 100, attributeId: 100, isCustom: true },
                        { id: 101, attributeId: 101, isCustom: false },
                        { id: 102, attributeId: 102, isCustom: false },
                    ],
                },
                { id: 1200, parentId: 1000, code: 'computer', categoryName: '电脑办公', status: 1, icon: '', sort: 2, attrs: [], sales: [] },

                { id: 2000, parentId: 0, code: 'clothing', categoryName: '服装鞋帽', status: 1, icon: '', sort: 2, attrs: [], sales: [] },
                { id: 2100, parentId: 2000, code: 'menswear', categoryName: '男装', status: 1, icon: '', sort: 1, attrs: [], sales: [] },
                { id: 2200, parentId: 2000, code: 'womenswear', categoryName: '女装', status: 1, icon: '', sort: 2, attrs: [], sales: [] },

                { id: 3000, parentId: 0, code: 'food', categoryName: '食品饮料', status: 1, icon: '', sort: 3, attrs: [], sales: [] },
                {
                    id: 3100, parentId: 3000, code: 'snacks', categoryName: '休闲零食', status: 1, icon: '', sort: 1,
                    attrs: [
                        { id: 200, attributeId: 200, valueType: 2, required: true },
                        { id: 201, attributeId: 201, valueType: 1, required: false },
                        { id: 202, attributeId: 202, valueType: 3, required: true },
                    ],
                    sales: [
                        { id: 200, attributeId: 200, isCustom: true },
                        { id: 201, attributeId: 201, isCustom: false },
                    ],
                },
                { id: 3200, parentId: 3000, code: 'fruit', categoryName: '生鲜水果', status: 1, icon: '', sort: 2, attrs: [], sales: [] }
            ]

            const data = categoryId ? categories.filter((item) => item.id === Number(categoryId)) : categories

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
                    shopId: 0,
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
                        { id: 1000, url: 'https://picsum.photos/seed/iphone1', width: 800, height: 800, isMain: true },
                        { id: 1001, url: 'https://picsum.photos/seed/iphone2', width: 600, height: 800, isMain: false },
                        { id: 1002, url: 'https://picsum.photos/seed/iphone3', width: 800, height: 600, isMain: false },
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
                                specs: [
                                    { attributeId: 100, valueId: 1003, specName: '原色钛金属' },
                                    { attributeId: 101, valueId: 1012, specName: '256GB' },
                                    { attributeId: 102, valueId: 1021, specName: '全网通5G' },
                                ],
                                price: 6999,
                                stock: 50,
                                image: { url: 'https://picsum.photos/seed/titanium', width: 200, height: 200 },
                            },
                            {
                                id: 1001,
                                code: 'SP0001-002',
                                specs: [
                                    { attributeId: 100, valueId: 1003, specName: '极光蓝' },
                                    { attributeId: 101, valueId: 1013, specName: '512GB' },
                                    { attributeId: 102, valueId: 1021, specName: '全网通5G' },
                                ],
                                price: 7998,
                                stock: 0,
                                image: { url: 'https://picsum.photos/seed/aurora-blue', width: 200, height: 200 },
                            },
                            {
                                id: 1002,
                                code: 'SP0001-003',
                                specs: [
                                    { attributeId: 100, valueId: 1004, specName: '樱粉金' },
                                    { attributeId: 101, valueId: 1013, specName: '512GB' },
                                    { attributeId: 102, valueId: 1021, specName: '全网通5G' },
                                ],
                                price: 11999,
                                stock: 25,
                                image: { url: 'https://picsum.photos/seed/sakura-gold', width: 200, height: 200 },
                            },
                        ],
                    },
                ],
                total: 1,
            })
        },
    },
    {
        url: serviceConfig.apiUrl + '/product/category/sale/update',
        method: 'post',
        rawResponse: (req, res) => mockResponse(res, {
            code: 200,
            message: 'ok',
            data: {},
            total: 0
        })
    }
] as MockMethod[]