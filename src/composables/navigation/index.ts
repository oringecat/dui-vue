import { getCurrentInstance, computed } from 'vue'
import { useRoute } from 'vue-router'

export function useNavigation() {
    const instance = getCurrentInstance()
    const route = useRoute()

    // 当前组件是否路由
    const isRoute = computed(() => {
        const currentType = instance?.type
        const matched = route.matched.at(-1)
        if (!currentType || !matched) return false

        // 获取当前路由导出的组件
        const routeComponent = matched.components?.default

        console.log(routeComponent, currentType)
        // 判断路由是否组件本身
        return routeComponent === currentType
    })

    // 获取查询字符串
    const getQueryString = (name: string) => {
        const qs = route.query[name]
        return qs?.toString()
    }

    const getQueryStringToNumber = (name: string) => {
        const reg = /^[0-9]+.?[0-9]*/
        const value = getQueryString(name) ?? ''
        return reg.test(value) ? Number(value) : 0
    }

    return {
        route,
        isRoute,
        getQueryString,
        getQueryStringToNumber
    }
}