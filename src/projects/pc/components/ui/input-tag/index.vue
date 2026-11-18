<template>
    <el-input-tag ref="tagRef" class="dui-input-tag" @change="onChange" />
</template>

<script lang="ts" setup>
import { shallowRef, onMounted } from 'vue'
import type { InputTagInstance } from 'element-plus'

const props = withDefaults(defineProps<{
    placeholder?: string
}>(), {
    placeholder: '请输入后按回车键'
})

const tagRef = shallowRef<InputTagInstance>()

const onChange = () => {
    const input: HTMLInputElement = tagRef.value?.$el.querySelector('input')
    input?.setAttribute('placeholder', props.placeholder)
}

onMounted(onChange)
</script>

<style lang="less">
@import './index.less';
</style>