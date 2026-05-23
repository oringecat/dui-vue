<template>
    <div ref="scrollRef" class="app-scroll-view">
        <!-- 触顶占位元素 -->
        <div ref="topRef" class="app-scroll-view__observer" v-if="observer"></div>
        <slot></slot>
        <!-- 触底占位元素 -->
        <div ref="bottomRef" class="app-scroll-view__observer" v-if="observer"></div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, onActivated, onDeactivated, shallowRef, computed, watch, nextTick } from 'vue'
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
    // 滚动延迟
    delay: {
        type: Number,
        default: 80
    },
    // 是否启用触顶/触底监听
    observer: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:modelValue', 'scroll', 'scrollToupper', 'scrollTolower'])

const scrollRef = shallowRef<HTMLDivElement>()
const topRef = shallowRef<HTMLDivElement>()
const bottomRef = shallowRef<HTMLDivElement>()

const scrollParent = useScrollParent(scrollRef)
const scrollMap = new Map<string, number>([[props.scrollName, props.modelValue]])

const scrollTop = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const setScrollTop = () => {
    const el = scrollRef.value
    if (el) {
        el.scrollTop = scrollMap.get(props.scrollName) ?? scrollTop.value
        scrollTop.value = el.scrollTop
    }
}

// 防抖触发滚动事件
const onScroll = debounce((el: HTMLDivElement) => {
    scrollMap.set(props.scrollName, el.scrollTop)
    emit('scroll', el)
}, props.delay)

// 监听滚动事件
const stopEventListener = useEventListener('scroll', (e: Event) => {
    const el = e.target as HTMLDivElement
    scrollTop.value = el.scrollTop
    onScroll(el)
}, {
    target: scrollParent,
    passive: true
})

// 销毁观察者
let destroyObservers = () => {
    console.warn('IntersectionObserverInit', '初始化失败')
}

// 创建观察者
// https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver
const createObservers = () => {
    if (!props.observer) return () => { }

    // 激活状态（初始化不触发，因为初始化占位元素处于视窗内）
    const activeState = { top: false, bottom: false }

    const options: IntersectionObserverInit = {
        root: null, // 默认使用浏览器视窗
        scrollMargin: '100px'
    }

    // 监听触顶
    const topObserver = new IntersectionObserver((entries) => {
        if (activeState.top) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    emit('scrollToupper')
                }
            })
        } else {
            activeState.top = true
        }
    }, options)

    // 监听触底
    const bottomObserver = new IntersectionObserver((entries) => {
        if (activeState.bottom) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    emit('scrollTolower')
                }
            })
        } else {
            activeState.bottom = true
        }
    }, options)

    if (topRef.value && bottomRef.value) {
        topObserver.observe(topRef.value)
        bottomObserver.observe(bottomRef.value)
    }

    return () => {
        topObserver.disconnect()
        bottomObserver.disconnect()
    }
}

onMounted(() => {
    setScrollTop()
    destroyObservers = createObservers()

    onActivated(() => {
        setScrollTop()
        destroyObservers = createObservers()
    })

    onDeactivated(() => destroyObservers())
})

onUnmounted(() => {
    stopEventListener()
    destroyObservers()
})

watch(() => props.scrollName, () => nextTick(setScrollTop))
</script>

<style lang="less">
@import './index.less';
</style>