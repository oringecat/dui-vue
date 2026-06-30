<template>
    <el-table>
        <template v-for="(item, index) in columns" :key="index">
            <el-table-column :prop="item.field" :label="getColumnLabel(item.label)">
                <template #default="{ row, $index }">
                    <slot :name="item.field" :row="row" :value="row[item.field]" :index="$index">
                        <span :class="item.className">{{ getCellValue(row, item) }}</span>
                    </slot>
                </template>
            </el-table-column>
        </template>
    </el-table>
</template>

<script lang="ts" generic="T extends object" setup>
import { type PropType } from 'vue'
//import type { TableColumnCtx } from 'element-plus'
import type { TableColumn } from './types'

defineProps({
    columns: {
        type: Array as PropType<TableColumn<T>[]>,
        required: true
    }
})

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
</script>