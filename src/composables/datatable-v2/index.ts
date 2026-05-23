import { reactive, shallowReactive, shallowRef, computed, toRefs } from 'vue'
import type { DataTableOptions } from './types'

// 刷新清空 rawData
// 更新替换 rawData
// 删除标记
export function useDataTable<T>(options: DataTableOptions = {}) {
    const state = reactive({
        total: -1, // 总条数，-1 = 从未加载过
        pageSize: options.pageSize ?? 20, // 每页条数
        pageIndex: options.pageIndex ?? 1, // 当前页码
        failed: false // 是否失败
    })

    const rawData = shallowReactive(new Map<number, T[]>()) // 缓存原始数据
    const isRefreshing = shallowRef(false) // 下拉刷新状态

    // 总页数
    const pageCount = computed(() => state.total > 0 ? Math.ceil(state.total / state.pageSize) : 1)

    // 是否有更多
    const hasMore = computed(() => {
        if (state.failed) return false
        return state.total < 0 || (!isRefreshing.value && state.pageIndex < pageCount.value)
    })

    // 当前列表
    const dataList = computed(() => rawData.get(state.pageIndex) || [])

    // 虚拟列表，返回当前页前后各一页的数据
    const virtualList = computed(() => {
        const result: T[] = []
        const current = state.pageIndex
        const start = Math.max(1, current - 1)  // 至少从第1页开始
        const end = current + 1

        for (let i = start; i <= end; i++) {
            const data = rawData.get(i)
            if (data) {
                result.push(...data)
            }
        }

        return result
    })

    // 更新列表
    const updateItems = (data: T[], total = 0) => {
        state.total = total || data.length
        state.failed = false

        if (isRefreshing.value) {
            rawData.clear()
            isRefreshing.value = false
        }

        if (data.length > 0 && data.length === state.total) {
            // 进行本地分页
            for (let page = 1; page <= pageCount.value; page++) {
                const start = (page - 1) * state.pageSize
                const end = start + state.pageSize
                rawData.set(page, data.slice(start, end))
            }
        } else {
            rawData.set(state.pageIndex, data)
        }
    }

    // 下一页
    const nextPage = (refreshing = false) => {
        isRefreshing.value = refreshing

        if (refreshing) {
            state.failed = false
            state.pageIndex = 1
            return true
        }

        return state.pageIndex++ < pageCount.value
    }

    return {
        pageCount,
        dataList,
        virtualList,
        hasMore,
        updateItems,
        nextPage,
        ...toRefs(state)
    }
}