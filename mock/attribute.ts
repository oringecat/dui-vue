import type { MockMethod } from 'vite-plugin-mock'
import { mockResponse, serviceConfig } from './mock-utils'

export default [
    {
        url: serviceConfig.apiUrl + '/attribute/list',
        method: 'get',
        rawResponse: (req, res) => {
            const data = [
                {
                    id: 100,
                    name: '颜色',
                    groupId: 1,
                    values: [
                        { id: 1001, value: '亮黑色' },
                        { id: 1002, value: '珠光白' },
                        { id: 1003, value: '极光蓝' },
                        { id: 1004, value: '樱粉金' },
                    ],
                    multiple: true,
                    updateTime: Date.now(),
                },
                {
                    id: 101,
                    name: '容量',
                    groupId: 1,
                    values: [
                        { id: 1011, value: '128GB' },
                        { id: 1012, value: '256GB' },
                        { id: 1013, value: '512GB' },
                    ],
                    multiple: false,
                    updateTime: Date.now(),
                },
                {
                    id: 102,
                    name: '网络制式',
                    groupId: 1,
                    values: [
                        { id: 1021, value: '全网通5G' },
                        { id: 1022, value: '移动5G' },
                        { id: 1023, value: '联通5G' },
                    ],
                    multiple: false,
                    updateTime: Date.now(),
                },
                {
                    id: 200,
                    name: '口味',
                    groupId: 2,
                    values: [
                        { id: 2001, value: '原味' },
                        { id: 2002, value: '麻辣' },
                        { id: 2003, value: '五香' },
                        { id: 2004, value: '烧烤' },
                    ],
                    multiple: false,
                    updateTime: Date.now(),
                },
                {
                    id: 201,
                    name: '包装',
                    groupId: 2,
                    values: [
                        { id: 2011, value: '100g' },
                        { id: 2012, value: '200g' },
                        { id: 2013, value: '500g' },
                        { id: 2014, value: '1kg' },
                    ],
                    multiple: false,
                    updateTime: Date.now(),
                },
                {
                    id: 103,
                    name: '屏幕尺寸',
                    groupId: 3,
                    values: [
                        { id: 1031, value: '6.1英寸' },
                        { id: 1032, value: '6.7英寸' },
                    ],
                    multiple: false,
                    updateTime: Date.now(),
                },
                {
                    id: 104,
                    name: '操作系统',
                    groupId: 3,
                    values: [
                        { id: 1041, value: 'iOS' },
                        { id: 1042, value: 'Android' },
                    ],
                    multiple: false,
                    updateTime: Date.now(),
                },
                {
                    id: 202,
                    name: '产地',
                    groupId: 3,
                    values: [
                        { id: 2021, value: '中国' },
                        { id: 2022, value: '进口' },
                    ],
                    multiple: false,
                    updateTime: Date.now(),
                },
            ]

            mockResponse(res, {
                code: 200,
                message: 'ok',
                data,
                total: data.length
            })
        }
    },
    {
        url: serviceConfig.apiUrl + '/attribute/group/list',
        method: 'get',
        rawResponse: (req, res) => {
            const data = [
                { id: 1, name: '外观规格', code: 'appearance', sort: 1 },
                { id: 2, name: '食品规格', code: 'food', sort: 2 },
                { id: 3, name: '基础属性', code: 'basic', sort: 3 },
            ]

            mockResponse(res, {
                code: 200,
                message: 'ok',
                data,
                total: data.length
            })
        }
    }
] as MockMethod[]
