<template>
    <el-pagination :total="total" :page-size="pageSize" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" background />
</template>

<script lang="ts" setup>
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

const handleSizeChange = (val: number) => {
    emit('update:pageSize', val)

    if (props.total > 0) {
        handleCurrentChange(1, true)
    }
}

const handleCurrentChange = (val: number, reset = false) => {
    emit('update:currentPage', val)
    emit('change', reset)
}
</script>