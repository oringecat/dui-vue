import { reactive, shallowReactive, shallowRef, computed, toRefs } from 'vue'
import type { DataTableOptions, FilterOptions, FormOptions } from './types'

// 自适应全量和接口分页数据
export function useDataTable<T extends object>(options: DataTableOptions = {}) {
    const state = reactive({
        pageSize: options.pageSize ?? 20, // 每页条数
        pageIndex: options.pageIndex ?? 1, // 当前页码
        failed: false // 是否失败
    })

    const rawData = shallowReactive(new Map<number, T[]>()) // 缓存原始数据
    const rawTotal = shallowRef(-1) // 原始总条数，-1 = 从未加载过
    const isRefreshing = shallowRef(false) // 下拉刷新状态
    const localFilterParams = shallowRef<Partial<T>>({}) // 本地过滤项参数

    const matchesFilter = (row: T) => {
        const entries = Object.entries(localFilterParams.value)
        return entries.every(([key, value]) => {
            if (value) {
                const rowValue = Reflect.get(row, key)
                // 模糊匹配（暂不考虑 value 和 rowValue 为数组的问题）
                return String(rowValue).toLowerCase().includes(String(value).toLowerCase())
            }
            return true
        })
    }

    // 如果首页总数和原始数据总数相同，说明是全量数据
    const fullData = computed(() => {
        const firstData = rawData.get(1) || []
        if (firstData.length > 0 && firstData.length === rawTotal.value) {
            return firstData.filter((item) => matchesFilter(item))
        }
        return []
    })

    // 优先使用全量总条数
    const pageTotal = computed(() => fullData.value.length || rawTotal.value)

    // 总页数
    const pageCount = computed(() => pageTotal.value > 0 ? Math.ceil(pageTotal.value / state.pageSize) : 1)

    // 是否有更多
    const hasMore = computed(() => {
        if (state.failed) return false
        return pageTotal.value < 0 || (!isRefreshing.value && state.pageIndex < pageCount.value)
    })

    const getPageItems = (pageIndex: number): T[] => {
        if (fullData.value.length) {
            const start = (pageIndex - 1) * state.pageSize
            return fullData.value.slice(start, start + state.pageSize)
        }
        return rawData.get(pageIndex) || []
    }

    // 当前列表（有缓存直接返回列表数据）
    const dataList = computed(() => getPageItems(state.pageIndex))

    // 当前页是否有数据
    const hasData = computed(() => dataList.value.length > 0)

    // 追加列表
    const appendList = computed(() => {
        if (fullData.value.length) return fullData.value
        return [...rawData.values()].flat()
    })

    // 虚拟列表，返回当前页前后各一页的数据（未完成，待确认列表模式）
    const virtualList = computed(() => {
        const currentPage = state.pageIndex
        const totalPage = pageCount.value

        const start = Math.max(1, currentPage === totalPage ? currentPage - 2 : currentPage - 1)
        const pageRange = [start, start + 1, start + 2]

        const filtered = pageRange.filter((page) => page <= totalPage)

        return filtered.map((pageIndex) => ({
            pageIndex,
            items: getPageItems(pageIndex)
        }))
    })

    // 更新列表
    const updateItems = (data: T[], total = 0) => {
        // 总条数变更或重复请求当前页时数据可能发生了变化，避免分页数据错乱，清空缓存
        if (total !== rawTotal.value || hasData.value) {
            rawData.clear()
        }

        state.failed = false
        isRefreshing.value = false
        rawTotal.value = total || data.length
        rawData.set(state.pageIndex, data)
    }

    // 上一页（滚动加载模式用）
    const prevPage = () => {
        if (state.pageIndex > 1) {
            state.pageIndex--
            return true
        }
        return false
    }

    // 下一页（滚动加载模式用）
    const nextPage = (refreshing = false) => {
        isRefreshing.value = refreshing

        if (refreshing) {
            state.failed = false
            state.pageIndex = 1
            return true
        }

        if (state.pageIndex < pageCount.value) {
            state.pageIndex++
            return true
        }

        return false
    }

    return {
        pageTotal,
        pageCount,
        dataList,
        appendList,
        virtualList,
        localFilterParams,
        hasData,
        hasMore,
        updateItems,
        prevPage,
        nextPage,
        ...toRefs(state)
    }
}

// 多字段过滤，支持联动显示/隐藏
export function useDataFilter<T extends object>({ filters, buttons }: FilterOptions<T>) {
    const rawValues = filters.map((item) => item.value) // 保存原始值
    const queryParams = shallowRef<Partial<T>>({})

    const filterOptions = reactive({
        filters,
        buttons: []
    }) as FormOptions<T>

    if (buttons) {
        // 重新映射按钮，resolveParams 追加额外参数
        filterOptions.buttons = buttons.map((item) => {
            const { resolveParams, ...rest } = item
            return {
                ...rest,
                buildQueryParams: async () => {
                    const params = getQueryParams(item.reset)
                    queryParams.value = await (resolveParams?.(params) ?? params)
                }
            }
        })
    }

    // 重置过滤条件
    const resetFilters = () => {
        filterOptions.filters.forEach((item, index) => {
            if (item && !item.required) {
                item.value = rawValues[index]
            }
        })
    }

    // 获取查询参数，支持多字段模糊查询
    const getQueryParams = (reset = false) => {
        if (reset) resetFilters()

        const params: Partial<T> = {}

        filterOptions.filters.forEach((e) => {
            if (e.value !== undefined) {
                const fields = Array.isArray(e.field) ? e.field : [e.field]
                fields.forEach((field) => {
                    params[field] = e.value
                })
            }
        })

        return params
    }

    const setFilterValue = <K extends keyof T>(field: K, value: T[K & string]) => {
        const filtered = filterOptions.filters.find((item) => item.field === field)
        if (filtered) {
            filtered.value = value
        }
    }

    const getFilterValue = <K extends keyof T>(field: K) => {
        const filtered = filterOptions.filters.find((item) => item.field === field)
        return filtered?.value as T[K] | undefined
    }

    return {
        queryParams,
        filterOptions,
        getQueryParams,
        setFilterValue,
        getFilterValue
    }
}