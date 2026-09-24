<template>
    <div class="dui-table" v-loading="loading">
        <div class="dui-table__toolbar">
            <div class="dui-table__toolbar-slot" v-if="slots.toolbar">
                <slot name="toolbar"></slot>
            </div>
            <el-button-group class="dui-table__toolbar-tools" v-if="showTools">
                <el-button icon="Refresh" @click="$emit('refresh')" v-if="attrs.onRefresh" />
                <app-column-setting :columns="rawColumns" v-model:hidden-fields="hiddenFields" />
            </el-button-group>
        </div>
        <div class="dui-table__body">
            <el-table @row-contextmenu="onContextmenu" height="100%" v-bind="attrs" border>
                <!-- 选择列 -->
                <el-table-column type="selection" width="55" align="center" fixed v-if="selectionType" />
                <component :is="renderColumns" />
            </el-table>
        </div>
        <div class="dui-table__footer" v-if="slots.footer">
            <slot name="footer"></slot>
        </div>
        <app-context-menu v-model:state="contextMenuState" :context-menus="contextMenus" v-if="contextMenus.length" />
    </div>
</template>

<script lang="ts" generic="T extends object" setup>
import { shallowRef, useSlots, useAttrs, h, type VNode } from 'vue'
import type { TableColumnCtx } from 'element-plus'
import { getNestedValue } from '@/helpers/filters'
import AppColumnSetting, { useTableColumns, type TableColumn } from '@pc/components/ui/column-setting'
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
    loading?: boolean
    showTools?: boolean
}>(), {
    showTools: true,
    contextMenus: () => []
})

const slots = useSlots()
const attrs = useAttrs()

const contextMenuState = shallowRef<ContextMenuState<T>>()

const { rawColumns, tableColumns, hiddenFields } = useTableColumns(props.columns)

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
const renderColumns = () => tableColumns.value.map((item) =>
    h(
        ElTableColumn,
        {
            key: item.field,
            prop: item.field,
            align: item.align ?? 'left',
            width: item.width,
            label: getColumnLabel(item.label),
            sortable: item.sortable,
            fixed: item.fixed
        },
        {
            default: ({ row, $index }: { row: T; $index: number }) => {
                const renderSlot = slots[item.field]
                const value = item.formatValue?.(row) ?? getNestedValue(row, item.field)
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