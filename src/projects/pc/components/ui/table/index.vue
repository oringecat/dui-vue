<template>
    <div class="app-table">
        <div class="app-table__toolbar" v-if="slots.toolbar">
            <slot name="toolbar"></slot>
        </div>
        <el-table class="app-table__body" @row-contextmenu="onContextmenu" v-bind="$attrs">
            <!-- 选择列 -->
            <el-table-column type="selection" width="55" align="center" fixed v-if="selectionType" />
            <component :is="renderColumns" />
        </el-table>
        <div class="app-table__footer" v-if="slots.footer">
            <slot name="footer"></slot>
        </div>
        <app-context-menu v-model:state="contextMenuState" :context-menus="contextMenus" v-if="contextMenus.length" />
    </div>
</template>

<script lang="ts" generic="T extends object" setup>
import { shallowRef, useSlots, h, type VNode } from 'vue'
import type { TableColumnCtx } from 'element-plus'
import { getNestedValue } from '@/helpers/filters'
import type { TableColumn } from '@pc/components/ui/column-setting'
import type { ContextMenuState, ContextMenuItem } from '@pc/components/ui/context-menu/types'
import AppContextMenu from '@pc/components/ui/context-menu/index.vue'

defineOptions({
    inheritAttrs: false
})

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
    columns: TableColumn<T>[]
    contextMenus?: ContextMenuItem<T>[]
    selectionType?: 'single' | 'multiple'
}>(), {
    border: true,
    contextMenus: () => []
})

const slots = useSlots()

const contextMenuState = shallowRef<ContextMenuState<T>>()

// 鼠标右键
const onContextmenu = (row: T, column: TableColumnCtx<T>, event: PointerEvent) => {
    if (props.contextMenus.length) {
        event.preventDefault()
        contextMenuState.value = {
            x: event.clientX,
            y: event.clientY,
            index: column.getColumnIndex(),
            row
        }
    }
}

// 渲染数据列
const renderColumns = () => props.columns.map((item) =>
    h(
        ElTableColumn,
        {
            key: item.field,
            prop: item.field,
            align: item.align ?? 'left',
            minWidth: item.width,
            label: getColumnLabel(item.label),
            sortable: item.sortable,
            fixed: item.fixed
        },
        {
            default: ({ row, $index }: { row: T; $index: number }) => {
                const renderSlot = slots[item.field]
                const value = getNestedValue(row, item.field)
                if (renderSlot) {
                    return renderSlot({ row, value, index: $index })
                }
                return h('span', { class: item.className }, value == null ? undefined : String(value))
            }
        }
    )
)

const getColumnLabel = (label: unknown) => {
    return typeof label === 'function' ? label() : label
}
</script>

<style lang="less">
@import './index.less';
</style>