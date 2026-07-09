import { shallowRef } from 'vue'
import type { TableOptions, ContextMenuItem } from './types'

export function useTableView<T extends object>(options: TableOptions<T> = {}) {
    const selectedRow = shallowRef<T>()

    // 表格行点击事件
    const rowClick = (row: T) => {
        selectedRow.value = row
    }

    const contextMenus: ContextMenuItem<T>[] = [
        {
            title: '详情',
            onClick: (state) => {
                console.log(state.row)
            }
        },
        {
            title: '编辑',
            onClick: (state) => {
                console.log(state.row)
            }
        }
    ]

    return {
        selectedRow,
        rowClick,
        contextMenus
    }
}