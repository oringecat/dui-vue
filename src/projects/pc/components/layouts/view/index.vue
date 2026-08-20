<template>
    <div ref="viewRef" :class="['app-view', { 'app-view--flex': flex }]">
        <slot name="header"></slot>
        <div class="app-view__body">
            <slot></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, shallowRef } from 'vue'

defineProps<{
    flex?: boolean
}>()

const emit = defineEmits(['ready'])

const viewRef = shallowRef<HTMLDivElement>()

onMounted(() => {
    emit('ready', viewRef.value)
})
</script>

<style lang="less">
@import './index.less';
</style>