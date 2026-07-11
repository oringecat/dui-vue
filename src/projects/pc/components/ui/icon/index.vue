<template>
    <span class="app-icon">
        <el-icon v-if="isComponent">
            <component :is="icon"></component>
        </el-icon>
        <i :class="['g-icon', icon]" v-else></i>
    </span>
</template>

<script lang="ts" setup>
import { resolveDynamicComponent, computed } from 'vue'

const props = defineProps<{
    icon: string
}>()

const isComponent = computed(() => props.icon && typeof resolveDynamicComponent(props.icon) !== 'string')
</script>

<style lang="less">
@import './index.less';
</style>