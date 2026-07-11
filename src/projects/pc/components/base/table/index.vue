<template>
    <el-table>
        <component :is="renderColumns" />
    </el-table>
</template>

<script lang="ts" generic="T extends object" setup>
import { computed, useSlots, h, type PropType, type VNode } from 'vue'
//import type { TableColumnCtx } from 'element-plus'
import { getNestedValue } from '@/helpers/filters'
import type { TableColumn } from './types'

// 声明 slot 类型
defineSlots<{
    [K in keyof T]: (props: { row: T; value: T[K]; index: number }) => VNode[]
} & {
    [key: string]: (props: { row: T; value: unknown; index: number }) => VNode[]
}>()

const props = defineProps({
    columns: {
        type: Array as PropType<TableColumn<T>[]>,
        required: true
    }
})

const slots = useSlots()

const visibleColumns = computed(() => props.columns.filter((item) => item.show ?? true))

// 渲染数据列
const renderColumns = () => visibleColumns.value.map((item) =>
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