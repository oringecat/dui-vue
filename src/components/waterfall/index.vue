<!-- 瀑布流 -->
<template>
    <div ref="waterfallRef" class="app-waterfall" :style="waterfallStyles">
        <template v-for="(data, i) in state.columns" :key="i">
            <div class="app-waterfall__column" :style="i > 0 ? columnStyles : {}">
                <template v-for="(item, n) in data" :key="n">
                    <div class="app-waterfall__column-item" :style="n > 0 ? itemStyles : {}">
                        <slot :item="item">{{ item }}</slot>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script lang="ts" generic="T" setup>
import { reactive, shallowRef, computed, watch, onMounted, onActivated, onDeactivated, onBeforeUnmount, type CSSProperties } from 'vue'

const props = withDefaults(defineProps<{
    dataList: T[] // 数据列表
    column?: number // 列数
    estimatedHeight?: number // 预估行高度
    gap?: number // 间距
}>(), {
    column: 2,
    estimatedHeight: 200,
    gap: 10
})

const waterfallRef = shallowRef<HTMLDivElement>()
const columnElements = shallowRef<HTMLDivElement[]>([])

const state = reactive({
    columns: Array.from<T, T[]>({ length: props.column }, () => []),
    renderId: 0, // 记录当前渲染编号
    renderedCount: 0, // 记录已渲染的数量
    isDeactivated: false
})

const waterfallStyles = computed<CSSProperties>(() => {
    const rows = Math.ceil(props.dataList.length / props.column)
    return {
        minHeight: `${rows * props.estimatedHeight + Math.max(rows - 1, 0) * props.gap}px`
    }
})

const columnStyles = computed<CSSProperties>(() => ({
    marginLeft: `${props.gap}px`
}))

const itemStyles = computed<CSSProperties>(() => ({
    marginTop: `${props.gap}px`
}))

const render = (id: number) => {
    if (id !== state.renderId || state.isDeactivated) return

    if (state.renderedCount < props.dataList.length) {
        const columnHeights = columnElements.value.map((e) => e.offsetHeight)
        const minHeight = Math.min(...columnHeights) // 获取最小列的高度
        const minIndex = columnHeights.findIndex((e) => e === minHeight) // 最小值的索引位置

        const item = props.dataList[state.renderedCount]
        if (item) {
            (state.columns[minIndex] as T[]).push(item)
        }

        state.renderedCount++
        requestAnimationFrame(() => render(id))
    }
}

watch(() => props.dataList, (newList, oldList) => {
    // 如果某一项不匹配，重置渲染
    if (!oldList.every((item, i) => newList[i] === item)) {
        state.columns.forEach((c) => (c.length = 0))
        state.renderedCount = 0
    }
    render(++state.renderId)
})

onMounted(() => {
    const el = waterfallRef.value
    if (el) {
        const els = el.querySelectorAll<HTMLDivElement>('.app-waterfall__column')
        columnElements.value = Array.from(els)
    }

    onActivated(() => {
        state.isDeactivated = false
        render(state.renderId) // 对未完成加载的数据进行渲染
    })
})

onDeactivated(() => {
    state.isDeactivated = true
})

onBeforeUnmount(() => {
    state.isDeactivated = true
})
</script>

<style lang="less">
@import './index.less';
</style>