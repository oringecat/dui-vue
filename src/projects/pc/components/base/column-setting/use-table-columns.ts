import { shallowRef, computed, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import type { TableColumn } from './types'

export function useTableColumns<T extends object>(columnsKey: string, columns?: TableColumn<T>[]) {
    const userStore = useUserStore()

    // 原始列
    const rawColumns = shallowRef(columns ?? [])

    // 隐藏列
    const hiddenKeys = shallowRef(new Set<string>())

    const storageKey = computed(() => {
        const scope = String(userStore.userInfo.id) || 'anonymous'
        return `table-columns:user-${scope}:${columnsKey}`
    })

    const tableColumns = computed(() => rawColumns.value.filter((column) => {
        const visible = typeof column.visibility === 'function' ? column.visibility() : (column.visibility ?? true)
        return visible && !hiddenKeys.value.has(String(column.field))
    }))

    // 加载本地配置
    const loadHiddenKeys = () => {
        const raw = localStorage.getItem(storageKey.value)
        if (raw) {
            hiddenKeys.value = new Set(JSON.parse(raw))
        } else {
            hiddenKeys.value = new Set()
        }
    }

    // 合并更新
    const updateColumns = (columns: TableColumn<T>[]) => {
        const incomingMap = new Map(columns.map((col) => [col.field, col]))
        const existingKeys = new Set() // 已存在的 key 集合
        const merged: TableColumn<T>[] = []

        // 替换
        for (const existing of rawColumns.value) {
            existingKeys.add(existing.field)
            const next = incomingMap.get(existing.field)
            merged.push(next ?? existing)
        }

        // 追加
        for (const [key, col] of incomingMap) {
            if (!existingKeys.has(key)) merged.push(col)
        }

        rawColumns.value = merged
    }

    const toggleColumn = (field: string, visible?: boolean) => {
        const targetKeys  = new Set(hiddenKeys.value)
        const shouldHide = visible === undefined ? !targetKeys.has(field) : !visible

        if (shouldHide) {
            targetKeys.add(field)
        } else {
            targetKeys.delete(field)
        }

        hiddenKeys.value = targetKeys
    }

    // 持久化
    watch(hiddenKeys, (newValues) => {
        localStorage.setItem(storageKey.value, JSON.stringify([...newValues]))
    })

    watch(storageKey, () => loadHiddenKeys(), {
        immediate: true
    })

    return {
        rawColumns,
        tableColumns,
        hiddenKeys,
        updateColumns,
        toggleColumn
    }
}