import type { MockMethod } from 'vite-plugin-mock'
import { mockResponse, serviceConfig } from './mock-utils'

export default [
    {
        url: serviceConfig.apiUrl + '/brand/list',
        method: 'get',
        rawResponse: (req, res) => mockResponse(res, {
            code: 200,
            message: 'ok',
            data: [
                { id: 1, categoryId: 1100, code: 'xiaomi', brandName: '小米', status: 1, createTime: 1761465600000 },
                { id: 2, categoryId: 1100, code: 'apple', brandName: 'Apple', status: 1, createTime: 1761465600000 },
                { id: 3, categoryId: 1100, code: 'huawei', brandName: '华为', status: 1, createTime: 1761465600000 },
                { id: 9, categoryId: 1200, code: 'lenovo', brandName: '联想', status: 1, createTime: 1761465600000 },
                { id: 10, categoryId: 1200, code: 'dell', brandName: '戴尔', status: 1, createTime: 1761465600000 },
                { id: 15, categoryId: 2100, code: 'three-squirrels', brandName: '三只松鼠', status: 1, createTime: 1761465600000 },
                { id: 16, categoryId: 2100, code: 'bestore', brandName: '良品铺子', status: 1, createTime: 1761465600000 },
            ] as Brand.BrandListItem[],
            total: 7
        })
    },
    {
        url: serviceConfig.apiUrl + '/brand/category',
        method: 'get',
        rawResponse: (req, res) => mockResponse(res, {
            code: 200,
            message: 'ok',
            data: [
                // 一级
                { id: 1000, parentId: 0, code: 'digital', categoryName: '手机数码', status: 1, icon: '', sort: 1, createTime: 1761465600000 },
                { id: 2000, parentId: 0, code: 'food', categoryName: '食品饮料', status: 1, icon: '', sort: 2, createTime: 1761465600000 },
                // 二级
                { id: 1100, parentId: 1000, code: 'phone', categoryName: '手机通讯', status: 1, icon: '', sort: 1, createTime: 1761465600000 },
                { id: 1200, parentId: 1000, code: 'computer', categoryName: '电脑办公', status: 1, icon: '', sort: 2, createTime: 1761465600000 },
                { id: 2100, parentId: 2000, code: 'snacks', categoryName: '休闲零食', status: 1, icon: '', sort: 1, createTime: 1761465600000 },
            ] as Brand.CategoryItem[],
            total: 5
        })
    }
] as MockMethod[]
