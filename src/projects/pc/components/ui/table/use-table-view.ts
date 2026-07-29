import { shallowRef } from 'vue'
import type { TableOptions } from './types'

export function useTableView<T extends object>(options: TableOptions<T>) {
    const tableColumns = shallowRef(options.columns)
    const record = shallowRef<T>()

    // 表格行点击事件
    const rowClick = (row: T) => {
        record.value = row
    }

    return {
        tableColumns,
        record,
        rowClick
    }
}