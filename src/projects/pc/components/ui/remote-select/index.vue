<template>
    <el-select class="dui-remote-select" :placeholder="placeholder" :loading="loading" remote filterable clearable>
        <template #header>
            <el-button text bg size="small" @click="emit('reset')">重置</el-button>
        </template>
        <el-option v-for="(item, index) in options" :key="index" :label="getFieldValue(item, defaultProps.label)"
            :value="getFieldValue(item, defaultProps.value)">
            <slot :option="item" :index="index"></slot>
        </el-option>
    </el-select>
</template>

<script lang="ts" generic="T" setup>
import { computed } from 'vue'
import { getNestedValue } from '@/helpers/filters'

type FieldKey = (keyof T & string) | (string & {})

const props = withDefaults(defineProps<{
    options: T[]
    optionProps?: {
        label?: FieldKey
        value?: FieldKey
    },
    placeholder?: string
    loading?: boolean
}>(), {
    optionProps: () => ({}),
    placeholder: '请输入关键字'
})

const emit = defineEmits<{
    reset: []
}>()

const defaultProps = computed(() => ({
    label: props.optionProps.label || 'label',
    value: props.optionProps.value || 'value'
}))


const getFieldValue = (item: T, key: string) => {
    const value = getNestedValue(item, key)
    return typeof value === 'string' || typeof value === 'number' ? value : ''
}
</script>