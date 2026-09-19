import { shallowRef, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { TableColumn } from './types'

export function useTableColumns<T extends object>(columns: TableColumn<T>[], key?: string) {
    const route = useRoute()
    const userStore = useUserStore()
    const columnsKey = key ?? route.path

    // 原始列
    const rawColumns = shallowRef(columns ?? [])

    // 隐藏字段
    const hiddenFields = shallowRef(new Set<string>())

    const storageKey = computed(() => {
        const scope = String(userStore.userInfo.id) || 'anonymous'
        return `table-columns:user-${scope}:${columnsKey}`
    })

    const tableColumns = computed(() => rawColumns.value.filter((col) => {
        const visible = typeof col.visibility === 'function' ? col.visibility() : (col.visibility ?? true)
        return visible && !hiddenFields.value.has(col.field)
    }))

    // 加载本地配置
    const loadHiddenFields = () => {
        const raw = localStorage.getItem(storageKey.value)
        if (raw) {
            hiddenFields.value = new Set(JSON.parse(raw))
        } else {
            hiddenFields.value = new Set()
        }
    }

    // 合并更新
    const updateColumns = (columns: TableColumn<T>[]) => {
        const incomingMap = new Map(columns.map((col) => [col.field, col]))
        const existingFields = new Set() // 已存在的 field 集合
        const merged: TableColumn<T>[] = []

        // 替换
        for (const existing of rawColumns.value) {
            existingFields.add(existing.field)
            const next = incomingMap.get(existing.field)
            merged.push(next ?? existing)
        }

        // 追加
        for (const [key, col] of incomingMap) {
            if (!existingFields.has(key)) merged.push(col)
        }

        rawColumns.value = merged
    }

    const toggleColumn = (field: string, visible?: boolean) => {
        const targetFields = new Set(hiddenFields.value)
        const shouldHide = visible === undefined ? !targetFields.has(field) : !visible

        if (shouldHide) {
            targetFields.add(field)
        } else {
            targetFields.delete(field)
        }

        hiddenFields.value = targetFields
    }

    // 持久化
    watch(hiddenFields, (newValues) => {
        localStorage.setItem(storageKey.value, JSON.stringify([...newValues]))
    })

    watch(storageKey, () => loadHiddenFields(), {
        immediate: true
    })

    return {
        rawColumns,
        tableColumns,
        hiddenFields,
        updateColumns,
        toggleColumn
    }
}