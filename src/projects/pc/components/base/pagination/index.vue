<template>
    <el-pagination :total="total" :page-size="size" :current-page="current" :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" background />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
    // 总条数
    total: {
        type: Number,
        required: true
    },
    // 每页条数
    pageSize: {
        type: Number,
        default: 20
    },
    // 当前页数
    currentPage: {
        type: Number,
        default: 1
    }
})

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'change'])

const size = computed({
    get: () => props.pageSize,
    set: (val) => emit('update:pageSize', val)
})

const current = computed({
    get: () => props.currentPage,
    set: (val) => emit('update:currentPage', val)
})

const handleSizeChange = (val: number) => {
    size.value = val
    if (props.total > 0) handleCurrentChange(1)
}

const handleCurrentChange = (val: number) => {
    current.value = val
    emit('change')
}
</script>