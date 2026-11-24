import { shallowRef, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Router, RouteRecordRaw } from 'vue-router'
import { createUserAuth } from '@/services/api/user'
import { getAuthRoutes } from './routes'
import { AuthType, type AuthRoute } from './types'
import { useLoginStore } from '@/stores/login'

export { AuthType, type AuthRoute }

export const useAuthStore = defineStore('auth', () => {
    const loginStore = useLoginStore()

    const { rawFetch } = createUserAuth()

    // 用户权限
    const userAuth = shallowRef<AuthRoute[]>([])

    // 用户路由
    const userRoutes = computed(() => resolveRoute(userAuth.value))

    // 用户菜单
    const userMenus = computed(() => filterAuthMenus(userAuth.value))

    // 默认首页
    const defaultHomeUrl = computed(() => getFirstRoutePath(userRoutes.value))

    // 是否有权限
    const hasAuth = computed(() => userRoutes.value.length > 0)

    // 递归查找路由第一个有效路径
    const getFirstRoutePath = (routes: RouteRecordRaw[]): string => {
        for (const node of routes) {
            if (node.children?.length) {
                const path = getFirstRoutePath(node.children)
                if (path) return path
            }
            if (node.path) return node.path
        }
        return '/404'
    }

    // 请求用户权限
    const fetchUserAuth = async (router: Router) => {
        if (loginStore.isAdmin) {
            userAuth.value = getAuthRoutes()
        } else {
            const res = await rawFetch()
            userAuth.value = getAuthRoutes(res.data)
        }
        userRoutes.value.forEach(router.addRoute)
    }

    // 过滤权限菜单
    const filterAuthMenus = (data: AuthRoute[]) => {
        return data.reduce<AuthRoute[]>((result, node) => {
            if (node.authType === AuthType.Route || node.authType === AuthType.Link) {
                result.push({
                    ...node,
                    children: node.children ? filterAuthMenus(node.children) : []
                })
            }
            return result
        }, [])
    }

    // 解析路由
    const resolveRoute = (data: AuthRoute[]) => {
        const result: RouteRecordRaw[] = []
        data.forEach((item) => {
            if (item.authType === AuthType.Route && item.url) {
                const route: RouteRecordRaw = {
                    path: item.url,
                    name: item.code,
                    component: item.component,
                    meta: {
                        title: item.title,
                        icon: item.icon,
                        remark: item.remark,
                        keepAlive: true, // 默认缓存页面
                    },
                    children: item.children?.length ? resolveRoute(item.children) : []
                }
                result.push(route)
            }
        })
        return result
    }

    const resetAuth = (router: Router) => {
        userRoutes.value.forEach(({ name }) => {
            if (name) router.removeRoute(name)
        })
        userAuth.value = []
    }

    return {
        userAuth,
        userRoutes,
        userMenus,
        hasAuth,
        defaultHomeUrl,
        fetchUserAuth,
        resetAuth
    }
})
