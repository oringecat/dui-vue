<template>
    <div class="dui-table-v2" v-loading="loading">
        <div class="dui-table-v2__toolbar">
            <div class="dui-table-v2__toolbar-slot" v-if="slots.toolbar">
                <slot name="toolbar"></slot>
            </div>
            <el-button-group class="dui-table-v2__toolbar-tools" v-if="showTools">
                <el-button icon="Refresh" @click="$emit('refresh')" v-if="attrs.onRefresh" />
                <app-column-setting :columns="rawColumns" v-model:hidden-fields="hiddenFields" />
            </el-button-group>
        </div>
        <el-auto-resizer class="dui-table-v2__resizer">
            <template #default="{ height, width }">
                <el-table-v2 :data="data" :columns="generateColumns(width)" :row-key="rowKey" :width="width"
                    :height="height" :row-event-handlers="rowEventHandlers" fixed />
            </template>
        </el-auto-resizer>
        <div class="dui-table-v2__footer" v-if="slots.footer">
            <slot name="footer"></slot>
        </div>
        <app-context-menu v-model:state="contextMenuState" :context-menus="contextMenus" v-if="contextMenus.length" />
    </div>
</template>

<script lang="ts" generic="T extends object" setup>
import { shallowRef, computed, useSlots, useAttrs, h, Fragment, type VNode } from 'vue'
import { type Column, type RowEventHandlers, TableV2FixedDir } from 'element-plus'
import { getNestedValue } from '@/helpers/filters'
import AppColumnSetting, { useTableColumns, type TableColumn } from '@pc/components/ui/column-setting'
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
    loading?: boolean
    showTools?: boolean
}>(), {
    contextMenus: () => []
})

const slots = useSlots()
const attrs = useAttrs()

const contextMenuState = shallowRef<ContextMenuState<T>>()

const { rawColumns, tableColumns, hiddenFields } = useTableColumns(props.columns)

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
const fixedWidth = computed(() => tableColumns.value.reduce((pre, cur) => {
    if (cur.width) {
        pre.length += 1
        pre.width += cur.width
    }
    return pre
}, { length: 0, width: 0 }))

// 转换固定列位置
const fixedMap: Record<`${TableV2FixedDir}`, TableV2FixedDir> = {
    left: TableV2FixedDir.LEFT,
    right: TableV2FixedDir.RIGHT
}

const generateColumns = (width: number): Column<T>[] => {
    // 最小宽度
    const minWidth = 120
    // 计算平均剩余宽度，减去 --el-table-scrollbar-size 宽度
    const defaultWidth = (width - 6 - fixedWidth.value.width) / (tableColumns.value.length - fixedWidth.value.length)

    return tableColumns.value.map((prop) => ({
        key: prop.field,
        dataKey: prop.field,
        title: getColumnLabel(prop.label),
        width: prop.width ?? (defaultWidth < minWidth ? minWidth : defaultWidth),
        align: prop.align ?? 'left',
        sortable: prop.sortable,
        fixed: prop.fixed ? fixedMap[prop.fixed] : undefined,
        cellRenderer: ({ rowData, rowIndex }: { rowData: T; rowIndex: number }) => {
            const renderSlot = slots[prop.field]
            const value = prop.formatValue?.(rowData) ?? getNestedValue(rowData, prop.field)
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