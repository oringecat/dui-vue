<template>
    <div class="app-table-v2">
        <div class="app-table-v2__toolbar" v-if="slots.toolbar">
            <slot name="toolbar"></slot>
        </div>
        <el-auto-resizer class="app-table-v2__resizer">
            <template #default="{ height, width }">
                <el-table-v2 :data="data" :columns="generateColumns(width)" :row-key="rowKey" :width="width"
                    :height="height" :row-event-handlers="rowEventHandlers" fixed />
            </template>
        </el-auto-resizer>
        <div class="app-table-v2__footer" v-if="slots.footer">
            <slot name="footer"></slot>
        </div>
        <app-context-menu v-model:state="contextMenuState" :context-menus="contextMenus" v-if="contextMenus.length" />
    </div>
</template>

<script lang="ts" generic="T extends object" setup>
import { shallowRef, computed, useSlots, h, Fragment, type VNode } from 'vue'
import type { Column, RowEventHandlers } from 'element-plus'
import { getNestedValue } from '@/helpers/filters'
import type { TableColumn } from '@pc/components/ui/column-setting'
import type { ContextMenuState, ContextMenuItem } from '@pc/components/ui/context-menu/types'
import AppContextMenu from '@pc/components/ui/context-menu/index.vue'

// 声明 slot 类型
defineSlots<{
    [K in keyof T]: (props: { row: T; value: T[K]; index: number }) => VNode[]
} & {
    [key: string]: (props: { row: T; value: unknown; index: number }) => VNode[]
} & {
    toolbar?: () => VNode[]
    footer?: () => VNode[]
}>()

const props = withDefaults(defineProps<{
    data: T[]
    rowKey?: string | number | symbol
    border?: boolean
    columns: TableColumn<T>[]
    contextMenus?: ContextMenuItem<T>[]
}>(), {
    contextMenus: () => []
})

const slots = useSlots()

const contextMenuState = shallowRef<ContextMenuState<T>>()

const rowEventHandlers: RowEventHandlers = {
    onContextmenu: ({ event, rowData, rowIndex }) => {
        if (props.contextMenus.length) {
            const e = event as MouseEvent
            e.preventDefault()

            contextMenuState.value = {
                x: e.clientX,
                y: e.clientY,
                index: rowIndex,
                row: rowData
            }
        }
    }
}

// 计算出固定宽度
const fixedWidth = computed(() => props.columns.reduce((pre, cur) => {
    if (cur.width) {
        pre.length += 1
        pre.width += cur.width
    }
    return pre
}, { length: 0, width: 0 }))

const generateColumns = (width: number): Column<T>[] => {
    // 最小宽度
    const minWidth = 120
    // 计算平均剩余宽度，减去 --el-table-scrollbar-size 宽度
    const defaultWidth = (width - 6 - fixedWidth.value.width) / (props.columns.length - fixedWidth.value.length)

    return props.columns.map((prop) => ({
        key: prop.field,
        dataKey: prop.field,
        title: getColumnLabel(prop.label),
        width: defaultWidth < minWidth ? minWidth : defaultWidth,
        align: prop.align ?? 'left',
        sortable: prop.sortable,
        fixed: prop.fixed,
        cellRenderer: ({ rowData, rowIndex }: { rowData: T; rowIndex: number }) => {
            const renderSlot = slots[prop.field]
            const value = getNestedValue(rowData, prop.field)
            if (renderSlot) {
                return h(Fragment, null, renderSlot({ row: rowData, value, index: rowIndex }))
            }
            return h('span', { class: prop.className }, value == null ? undefined : String(value))
        }
    }))
}

const getColumnLabel = (label: unknown) => {
    return typeof label === 'function' ? label() : label
}
</script>

<style lang="less">
@import './index.less';
</style>