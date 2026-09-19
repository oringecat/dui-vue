<template>
    <el-popover ref="popoverRef" :width="240" :hide-after="0" trigger="click" @show="onShow">
        <template #reference>
            <slot>
                <el-button :icon="Setting" />
            </slot>
        </template>
        <div class="dui-column-setting">
            <div class="dui-column-setting__header">
                <el-checkbox :model-value="allChecked" :indeterminate="indeterminate" @change="toggleAll">
                    全选
                </el-checkbox>
                <el-button type="primary" link @click="resetColumns">重置</el-button>
            </div>
            <el-divider class="dui-column-setting__divider" />
            <el-checkbox-group v-model="checkedFields" class="dui-column-setting__list">
                <el-checkbox v-for="column in columns" :key="String(column.field)" :value="String(column.field)"
                    class="dui-column-setting__item">
                    {{ getColumnLabel(column.label) }}
                </el-checkbox>
            </el-checkbox-group>
            <el-divider class="dui-column-setting__divider" />
            <div class="dui-column-setting__footer">
                <el-button type="primary" size="small" @click="confirm">保存</el-button>
            </div>
        </div>
    </el-popover>
</template>

<script lang="ts" generic="T extends object" setup>
import { shallowRef, computed } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import type { PopoverInstance } from 'element-plus'
import type { TableColumn } from './types'

const props = defineProps<{
    columns: TableColumn<T>[]
    hiddenFields: Set<string>
}>()

const emit = defineEmits<{
    'update:hiddenFields': [Set<string>]
}>()

const checkedFields = shallowRef<string[]>([])

const popoverRef = shallowRef<PopoverInstance>()

const fields = computed(() => props.columns.map((col) => String(col.field)))

// 全选
const allChecked = computed(() => checkedFields.value.length === fields.value.length)

// 不确定状态
const indeterminate = computed(() => checkedFields.value.length > 0 && checkedFields.value.length < fields.value.length)

const onShow = () => {
    checkedFields.value = fields.value.filter((field) => !props.hiddenFields.has(field))
}

const getColumnLabel = (label: unknown) => {
    return typeof label === 'function' ? label() : label
}

const toggleAll = (val: boolean | string | number) => {
    checkedFields.value = val ? [...fields.value] : []
}

const resetColumns = () => {
    checkedFields.value = [...fields.value]
}

const confirm = () => {
    const values = fields.value.filter((field) => !checkedFields.value.includes(field))
    emit('update:hiddenFields', new Set(values))
    popoverRef.value?.hide()
}
</script>

<style lang="less">
@import './index.less';
</style>