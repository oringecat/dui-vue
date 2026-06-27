import { reactive, shallowReactive, shallowRef, computed, toRefs } from 'vue'
import { cloneDeep } from 'lodash'
import type { FilterData, DataTableOptions, FilterOptions, FormOptions } from './types'

// 自适应全量和接口分页数据
export function useDataTable<T>(options: DataTableOptions = {}) {
    const state = reactive({
        pageSize: options.pageSize ?? 20, // 每页条数
        pageIndex: options.pageIndex ?? 1, // 当前页码
        failed: false // 是否失败
    })

    const rawData = shallowReactive(new Map<number, T[]>()) // 缓存原始数据
    const rawTotal = shallowRef(-1) // 原始总条数，-1 = 从未加载过
    const isRefreshing = shallowRef(false) // 下拉刷新状态
    const filterData = shallowRef<FilterData<T>[]>([]) // 本地过滤项

    const matchesFilter = (row: T, filter: FilterData<T>) => {
        return filter.fields.some((field) => {
            const value = row[field]
            if (typeof value === 'number') {
                return filter.values.includes(value)
            }
            return filter.values.some((text) => String(value).toLowerCase().includes(String(text).toLowerCase()))
        })
    }

    // 如果首页总数和原始数据总数相同，说明是全量数据
    const fullData = computed(() => {
        const firstData = rawData.get(1) || []
        if (firstData.length > 0 && firstData.length === rawTotal.value) {
            return firstData.filter((item) => filterData.value.every((filter) => matchesFilter(item, filter)))
        }
        return []
    })

    // 优先使用全量总条数
    const pageTotal = computed(() => fullData.value.length || rawTotal.value)

    // 总页数
    const pageCount = computed(() => pageTotal.value > 0 ? Math.ceil(pageTotal.value / state.pageSize) : 1)

    // 当前页是否有数据
    const hasData = computed(() => !!rawData.get(state.pageIndex)?.length)

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
        // 当前页 hasData == true 说明是二次请求，数据可能发生了变化，为防止前后页数据错乱，清空缓存数据
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
        filterData,
        hasData,
        hasMore,
        updateItems,
        prevPage,
        nextPage,
        ...toRefs(state)
    }
}

// （待实现联动筛选）
export function useDataFilter<T>(options: FilterOptions<T>) {
    const rawOptions = cloneDeep(options) // 原始副本
    const queryParams = shallowRef<Partial<T>>({})

    const filterOptions = reactive({
        filters: options.filters,
        buttons: []
    }) as FormOptions<T>

    if (options.buttons) {
        // 组合参数，resolveParams 追加额外查询参数
        filterOptions.buttons = options.buttons.map((item) => {
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
    const resetFilters = (...fields: (keyof T)[]) => {
        rawOptions.filters.forEach((rawItem, index) => {
            const currentItem = filterOptions.filters[index]
            if (currentItem && !rawItem.required) {
                if (!fields.length || fields.includes(rawItem.field)) {
                    currentItem.value = rawItem.value
                }
            }
        })
    }

    // 获取查询参数，支持多条件查询（待实现）
    const getQueryParams = (reset = false) => {
        if (reset) resetFilters()

        const params: Partial<T> = {}

        filterOptions.filters.forEach((e) => {
            if (e.value !== undefined) {
                params[e.field] = e.value
            }
        })

        return params
    }

    const getFilterValue = <K extends keyof T>(field: K) => {
        const filtered = filterOptions.filters.find((item) => item.field === field)
        return filtered?.value
    }

    return {
        queryParams,
        filterOptions,
        getQueryParams,
        getFilterValue
    }
}