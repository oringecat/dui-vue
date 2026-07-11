<template>
    <el-popover ref="popoverRef" :width="240" :hide-after="0" trigger="click" @show="onShow">
        <template #reference>
            <el-button :icon="Setting" plain>设置</el-button>
        </template>
        <div class="app-column-setting">
            <div class="app-column-setting__header">
                <el-checkbox :model-value="allChecked" :indeterminate="indeterminate" @change="toggleAll">
                    全选
                </el-checkbox>
                <el-button type="primary" link @click="resetColumns">重置</el-button>
            </div>
            <el-divider class="app-column-setting__divider" />
            <el-checkbox-group v-model="checkedKeys" class="app-column-setting__list">
                <el-checkbox v-for="column in columns" :key="String(column.field)" :value="String(column.field)"
                    class="app-column-setting__item">
                    {{ getColumnLabel(column.label) }}
                </el-checkbox>
            </el-checkbox-group>
            <el-divider class="app-column-setting__divider" />
            <div class="app-column-setting__footer">
                <el-button type="primary" size="small" @click="confirm">确定</el-button>
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
    hiddenKeys: Set<string>
}>()

const emit = defineEmits<{
    'update:hiddenKeys': [Set<string>]
}>()

const checkedKeys = shallowRef<string[]>([])

const popoverRef = shallowRef<PopoverInstance>()

const fields = computed(() => props.columns.map((col) => String(col.field)))

// 全选
const allChecked = computed(() => checkedKeys.value.length === fields.value.length)

// 不确定状态
const indeterminate = computed(() => checkedKeys.value.length > 0 && checkedKeys.value.length < fields.value.length)

const onShow = () => {
    checkedKeys.value = fields.value.filter((key) => !props.hiddenKeys.has(key))
}

const getColumnLabel = (label: unknown) => {
    return typeof label === 'function' ? label() : label
}

const toggleAll = (val: boolean | string | number) => {
    checkedKeys.value = val ? [...fields.value] : []
}

const resetColumns = () => {
    checkedKeys.value = [...fields.value]
}

const confirm = () => {
    const keys = fields.value.filter((key) => !checkedKeys.value.includes(key))
    emit('update:hiddenKeys', new Set(keys))
    popoverRef.value?.hide()
}
</script>

<style lang="less">
@import './index.less';
</style>