<!-- 瀑布流 -->
<template>
    <div ref="waterfallRef" class="app-waterfall">
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
import { reactive, shallowRef, computed, watch, onMounted, onActivated, onDeactivated, type CSSProperties } from 'vue'

const props = withDefaults(defineProps<{
    dataList: T[] // 数据列表
    column?: number // 列数
    rowKey?: string
    gap?: number // 间距
}>(), {
    column: 2,
    gap: 10
})

const waterfallRef = shallowRef<HTMLDivElement>()

const state = reactive({
    columns: Array.from<T, T[]>({ length: props.column }, () => []),
    currentColumnsIndex: 0, // 当前列索引
    renderedCount: 0,
    isDeactivated: false
})

const columnStyles = computed<CSSProperties>(() => ({
    marginLeft: `${props.gap}px`
}))

const itemStyles = computed<CSSProperties>(() => ({
    marginTop: `${props.gap}px`
}))

const render = () => {
    // 增量按需更新
    if (props.dataList.length > state.renderedCount) {
        const el = waterfallRef.value
        if (el) {
            const columnElements = el.querySelectorAll<HTMLDivElement>('.app-waterfall__column')

            // 在 keepalive 组件下，如果数据还未全部加载完成之前跳转了页面，这会导致获取不到元素信息，从而影响布局的正常显示
            // 所以需要暂停数据的加载，待页面重新显示后继续渲染
            if (!state.isDeactivated) {
                const columnHeights = Array.from(columnElements).map((e) => e.offsetHeight)

                const minHeight = Math.min(...columnHeights) // 获取数组中最小值
                const columnIndex = columnHeights.findIndex((e) => e === minHeight) // 最小值的索引位置

                const data = state.columns[columnIndex]
                const item = props.dataList[state.renderedCount]

                if (data && item) {
                    data.push(item)
                }

                // 更新已渲染完成的数据总数
                state.renderedCount++
                state.currentColumnsIndex = columnIndex
                requestAnimationFrame(() => render())
            }
        }
    }
}

watch(() => [props.dataList, props.dataList.length], ([newValue], [oldValue]) => {
    if (newValue !== oldValue) {
        state.columns = state.columns.map(() => [])
        state.currentColumnsIndex = 0
        state.renderedCount = 0
    }
    render()
})

onMounted(() => {
    render()

    onActivated(() => {
        state.isDeactivated = false
        // 对未完成加载的数据进行渲染
        render()
    })
})

onDeactivated(() => {
    state.isDeactivated = true
})
</script>

<style lang="less">
@import './index.less';
</style>