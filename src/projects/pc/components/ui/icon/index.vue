<template>
    <span class="dui-icon" :style="styles">
        <el-icon :size v-if="isComponent">
            <component :is="icon"></component>
        </el-icon>
        <i class="g-icon" :class="icon" v-else></i>
    </span>
</template>

<script lang="ts" setup>
import { resolveDynamicComponent, computed, type CSSProperties } from 'vue'

const props = defineProps<{
    icon: string
    size?: number
    pointer?: boolean
}>()

const isComponent = computed(() => props.icon && typeof resolveDynamicComponent(props.icon) !== 'string')

const styles = computed<CSSProperties>(() => ({
    cursor: props.pointer ? 'pointer' : 'none'
}))
</script>

<style lang="less">
@import './index.less';
</style>