import { AuthType, type AuthRoute } from './types'

const Page = () => import('@pc/components/layouts/page/index.vue')

export function getAuthRoutes(authCodes?: string[]) {
    const authRoutes: AuthRoute[] = [
        {
            code: 'order',
            title: '订单管理',
            authType: AuthType.Route,
            url: '/order',
            component: Page,
            icon: 'default',
            children: [
                {
                    code: 'order-list',
                    title: '平台订单',
                    authType: AuthType.Route,
                    url: '/order/list',
                    component: () => import('@pc/views/order/index.vue'),
                    icon: 'default',
                    children: [
                        {
                            code: 'order-list-tb',
                            title: '淘宝',
                            authType: AuthType.Component,
                            component: () => import('@pc/views/order/list/index.vue'),
                            children: [
                                {
                                    code: 'order-list-tb-ship',
                                    title: '发货',
                                    authType: AuthType.Action,
                                    component: () => import('@pc/views/order/ship/index.vue'),
                                    icon: 'Van'
                                },
                                {
                                    code: 'order-list-tb-details',
                                    title: '详情',
                                    authType: AuthType.Action,
                                    component: () => import('@pc/views/order/details/index.vue'),
                                    icon: 'Search'
                                }
                            ]
                        },
                        {
                            code: 'order-list-jd',
                            title: '京东',
                            authType: AuthType.Component,
                            component: () => import('@pc/views/order/list/index.vue')
                        },
                        {
                            code: 'order-list-wx',
                            title: '微信',
                            authType: AuthType.Component,
                            component: () => import('@pc/views/order/list/index.vue')
                        }
                    ]
                }
            ]
        },
        {
            code: 'product',
            title: '商品管理',
            authType: AuthType.Route,
            url: '/product',
            component: Page,
            icon: 'default',
            children: [
                {
                    code: 'product-category',
                    title: '商品类目',
                    authType: AuthType.Route,
                    url: '/product/category',
                    component: () => import('@pc/views/product/category/index.vue'),
                    icon: 'default',
                    children: [
                        {
                            code: 'product-category-add',
                            title: '新增',
                            authType: AuthType.Action,
                            component: () => import('@pc/views/product/category/edit/index.vue'),
                            icon: 'Plus'
                        },
                        {
                            code: 'product-category-modify',
                            title: '修改',
                            authType: AuthType.Action,
                            component: () => import('@pc/views/product/category/edit/index.vue'),
                            icon: 'Edit'
                        },
                        {
                            code: 'product-category-attr',
                            title: '基础属性',
                            authType: AuthType.Action,
                            component: () => import('@pc/views/product/category/attribute/index.vue'),
                            icon: 'SetUp'
                        },
                        {
                            code: 'product-category-sale',
                            title: '销售属性',
                            authType: AuthType.Action,
                            component: () => import('@pc/views/product/category/sale/index.vue'),
                            icon: 'SetUp'
                        }
                    ]
                },
                {
                    code: 'product-list',
                    title: '商品列表',
                    authType: AuthType.Route,
                    url: '/product/list',
                    component: () => import('@pc/views/product/list/index.vue'),
                    icon: 'default',
                    children: [
                        {
                            code: 'product-list-add',
                            title: '新增',
                            authType: AuthType.Action,
                            component: () => import('@pc/views/product/list/edit/index.vue'),
                            icon: 'Plus'
                        },
                        {
                            code: 'product-list-shelve',
                            title: '上架',
                            authType: AuthType.Action,
                            component: () => import('@pc/views/product/list/shelve/index.vue'),
                            icon: 'Sell'
                        },
                        {
                            code: 'product-list-unshelve',
                            title: '下架',
                            authType: AuthType.Action,
                            component: () => import('@pc/views/product/list/shelve/index.vue'),
                            icon: 'SoldOut'
                        },
                        {
                            code: 'product-list-modify',
                            title: '修改',
                            authType: AuthType.Action,
                            component: () => import('@pc/views/product/list/edit/index.vue'),
                            icon: 'Edit'
                        },
                        {
                            code: 'product-list-delete',
                            title: '删除',
                            authType: AuthType.Action,
                            component: () => import('@pc/views/product/list/delete/index.vue'),
                            icon: 'Delete'
                        }
                    ]
                }
            ]
        },
        {
            code: 'user',
            title: '用户管理',
            authType: AuthType.Route,
            url: '/user',
            component: Page,
            icon: 'default',
            children: [
                {
                    code: 'user-list',
                    title: '用户列表',
                    authType: AuthType.Route,
                    url: '/user/list',
                    component: () => import('@pc/views/user/list/index.vue'),
                    icon: 'default',
                    children: [
                        {
                            code: 'user-list-details',
                            title: '详情',
                            authType: AuthType.Action,
                            component: () => import('@pc/views/user/list/details/index.vue'),
                            icon: 'Search'
                        },
                        {
                            code: 'user-list-modify',
                            title: '修改',
                            authType: AuthType.Action,
                            component: () => import('@pc/views/user/list/edit/index.vue'),
                            icon: 'Edit'
                        }
                    ]
                }
            ]
        }
    ]

    // 过滤权限路由
    const filterAuthRoutes = (data: AuthRoute[]) => data.reduce<AuthRoute[]>((result, route) => {
        const hasAuth = authCodes?.some((code) => code === route.code)
        if (hasAuth) {
            const children = route.children ? filterAuthRoutes(route.children) : []
            result.push({ ...route, children })
        }
        return result
    }, [])

    return authCodes ? filterAuthRoutes(authRoutes) : authRoutes
}