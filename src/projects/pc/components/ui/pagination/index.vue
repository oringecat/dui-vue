<template>
    <div class="dui-pagination">
        <el-pagination :total="total" :page-size="pageSize" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" background />
    </div>
</template>

<script lang="ts" setup>
import { LoadMode } from '@/constants/enums'

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

const emit = defineEmits<{
    'update:currentPage': [index: number]
    'update:pageSize': [size: number]
    change: [mode: LoadMode]
}>()

const handleSizeChange = (size: number) => {
    emit('update:pageSize', size)

    if (props.total > 0) {
        handleCurrentChange(1, LoadMode.Reset)
    }
}

const handleCurrentChange = (index: number, mode = LoadMode.Cache) => {
    emit('update:currentPage', index)
    emit('change', mode)
}
</script>

<style lang="less">
@import "./index.less";
</style>