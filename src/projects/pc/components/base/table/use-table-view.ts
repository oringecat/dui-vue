import { shallowRef } from 'vue'
import type { TableOptions } from './types'

export function useTableView<T extends object>(options: TableOptions<T>) {
    const tableColumns = shallowRef(options.columns)
    const selectedRow = shallowRef<T>()

    // 表格行点击事件
    const rowClick = (row: T) => {
        selectedRow.value = row
    }

    return {
        tableColumns,
        selectedRow,
        rowClick
    }
}