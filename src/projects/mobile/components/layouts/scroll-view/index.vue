<template>
    <div ref="scrollRef" class="app-scroll-view">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onActivated, shallowRef, computed, watch, nextTick } from 'vue'
import { useScrollParent, useEventListener } from '@vant/use'
import { debounce } from 'lodash'

const props = defineProps({
    modelValue: {
        type: Number,
        default: 0
    },
    // 滚动元素名称 (用于共用组件缓存不同滚动条位置)
    scrollName: {
        type: String,
        default: 'default'
    },
    threshold: {
        type: Number,
        default: 100
    },
    delay: {
        type: Number,
        default: 80
    }
})

const emit = defineEmits(['update:modelValue', 'scroll', 'scrollToupper', 'scrollTolower'])

const scrollRef = shallowRef<HTMLDivElement>()
const scrollParent = useScrollParent(scrollRef)
const scrollMap = new Map<string, number>([[props.scrollName, props.modelValue]])

// 避免重复触发
const isUpperTriggered = shallowRef(false)
const isLowerTriggered = shallowRef(false)

const scrollTop = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const setScrollTop = () => {
    const el = scrollRef.value
    if (el) {
        el.scrollTop = scrollMap.get(props.scrollName) ?? scrollTop.value
        scrollTop.value = el.scrollTop
        isUpperTriggered.value = false
        isLowerTriggered.value = false
    }
}

// 防抖触发滚动事件
const onScroll = debounce((el: HTMLDivElement) => {
    const { scrollTop, scrollHeight, clientHeight } = el
    const scrollBottom = scrollHeight - scrollTop - clientHeight
    
    scrollMap.set(props.scrollName, scrollTop)
    emit('scroll', el)

    // 触顶事件
    if (scrollTop <= props.threshold) {
        if (!isUpperTriggered.value) {
            isUpperTriggered.value = true
            emit('scrollToupper')
        }
    } else {
        isUpperTriggered.value = false
    }

    // 触底事件
    if (scrollBottom <= props.threshold) {
        if (!isLowerTriggered.value) {
            isLowerTriggered.value = true
            emit('scrollTolower')
        }
    } else {
        isLowerTriggered.value = false
    }
}, props.delay)

const listener = (e: Event) => {
    const el = e.target as HTMLDivElement
    scrollTop.value = el.scrollTop
    onScroll(el)
}

useEventListener('scroll', listener, {
    target: scrollParent,
    passive: true
})

onMounted(() => {
    setScrollTop()
    onActivated(setScrollTop)
})

watch(() => props.scrollName, () => nextTick(setScrollTop))
</script>

<style lang="less">
@import './index.less';
</style>