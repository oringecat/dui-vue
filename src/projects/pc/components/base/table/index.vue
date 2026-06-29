<template>
    <el-table>
        <slot></slot>
    </el-table>
</template>

<script lang="ts" setup>
defineProps({
    columns: {
        type: Array,
        required: true
    }
})
</script>