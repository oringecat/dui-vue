<template>
    <div class="app-table-v2">
        <div class="app-table-v2__toolbar">
            <slot name="toolbar"></slot>
        </div>
        <el-auto-resizer>
            <template #default="{ height, width }">
                <el-table-v2 :data="data" :columns="generateColumns(width)" :row-key="rowKey" :width="width"
                    :height="height" :row-event-handlers="rowEventHandlers" />
            </template>
        </el-auto-resizer>
        <!-- 右键菜单 -->
        <teleport to="body" v-if="contextMenu && visibleContextMenus.length">
            <div class="app-table-v2__context-menu" :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
                @click.stop>
                <ul>
                    <template v-for="(menu, index) in visibleContextMenus" :key="index">
                        <li :class="[menu.className, { 'is-disabled': menu.disabled(contextMenu) }]"
                            @click="onContextMenuClick(menu)">
                            {{ menu.title }}
                        </li>
                    </template>
                </ul>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts" generic="T extends object" setup>
import { onMounted, onBeforeUnmount, shallowRef, computed, useSlots, h, Fragment, type PropType, type VNode } from 'vue'
import type { Column, RowEventHandlers } from 'element-plus'
import type { ContextMenuState, ContextMenuItem } from '@/composables/auth-components/types'
import type { TableColumn } from './types'

// 声明 slot 类型
defineSlots<{
    [K in keyof T]: (props: { row: T; value: T[K]; index: number }) => VNode[]
} & {
    [key: string]: (props: { row: T; value: unknown; index: number }) => VNode[]
} & {
    toolbar?: () => VNode[]
}>()

const props = defineProps({
    data: {
        type: Array as PropType<T[]>,
        required: true
    },
    columns: {
        type: Array as PropType<TableColumn<T>[]>,
        required: true
    },
    rowKey: {
        type: [String, Number, Symbol]
    },
    contextMenus: {
        type: Array as PropType<ContextMenuItem<T>[]>,
        default: () => ([])
    }
})

const slots = useSlots()

const contextMenu = shallowRef<ContextMenuState<T>>()

const rowEventHandlers: RowEventHandlers = {
    onContextmenu: ({ event, rowData, rowIndex }) => {
        const e = event as MouseEvent
        e.preventDefault()

        contextMenu.value = {
            x: e.clientX,
            y: e.clientY,
            index: rowIndex,
            row: rowData
        }
    }
}

// 可见的右键菜单列表
const visibleContextMenus = computed(() => props.contextMenus.filter(({ visibility }) => {
    const state = contextMenu.value
    return state ? visibility(state) : true
}))

// 可见的表格列
const visibleColumns = computed(() => props.columns.filter(({ visibility }) => typeof visibility === 'function' ? visibility() : visibility ?? true))

// 计算出固定宽度
const fixedWidth = computed(() => visibleColumns.value.reduce((pre, cur) => {
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
    const defaultWidth = (width - 6 - fixedWidth.value.width) / (visibleColumns.value.length - fixedWidth.value.length)

    return visibleColumns.value.map((prop) => ({
        key: prop.field,
        dataKey: prop.field,
        title: getColumnLabel(prop.label),
        width: defaultWidth < minWidth ? minWidth : defaultWidth,
        align: prop.align ?? 'left',
        sortable: prop.sortable,
        fixed: prop.fixed,
        cellRenderer: ({ rowData, rowIndex }: { rowData: T; rowIndex: number }) => {
            const renderSlot = slots[prop.field]
            const value = getCellValue(rowData, prop)
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

const getCellValue = (row: T, column: TableColumn<T>) => {
    const keys = String(column.field).split('.') // 对象路径
    let value: unknown = row

    for (const key of keys) {
        if (value == null || typeof value !== 'object') {
            return undefined
        }
        value = (value as Record<string, unknown>)[key]
    }

    return value
}

// 右键菜单点击事件
const onContextMenuClick = (menu: ContextMenuItem<T>) => {
    if (contextMenu.value) {
        menu.onClick(contextMenu.value)
    }
    hideContextMenu()
}

// 点击空白区域隐藏右键菜单
const hideContextMenu = () => {
    contextMenu.value = undefined
}

onMounted(() => {
    document.addEventListener('click', hideContextMenu)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', hideContextMenu)
})
</script>

<style lang="less">
@import './index.less';
</style>