<template>
    <div class="dui-nav-bar">
        <div class="dui-nav-bar__arrow dui-nav-bar__arrow--prev" :class="{ 'is-disabled': isFirst }" @click="prevTab"
            v-if="hasOverflow">
            <app-icon icon="ArrowLeft" />
        </div>
        <div ref="tabbarRef" class="dui-nav-bar__tabbar" @wheel="handleWheel">
            <ul>
                <template v-for="(item, index) in historyStore.historys" :key="index">
                    <li :class="{ 'is-active': historyStore.currentIndex === index }" @click="changeTab(index)">
                        <span class="text">{{ item.title }}</span>
                        <span class="icon" @click.stop="removeTab(index)" v-if="historyStore.historys.length > 1">
                            <app-icon icon="CircleCloseFilled" />
                        </span>
                    </li>
                </template>
            </ul>
        </div>
        <div class="dui-nav-bar__arrow dui-nav-bar__arrow--next" :class="{ 'is-disabled': isLast }" @click="nextTab"
            v-if="hasOverflow">
            <app-icon icon="ArrowRight" />
        </div>
        <el-dropdown class="dui-nav-bar__more" v-if="historyStore.historys.length > 1" @command="handleCommand">
            <app-icon icon="MoreFilled" />
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item icon="Close" command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item icon="Back" command="left" :disabled="isFirst">关闭左侧</el-dropdown-item>
                    <el-dropdown-item icon="Right" command="right" :disabled="isLast">关闭右侧</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@pc/router/history'
import AppIcon from '@pc/components/ui/icon/index.vue'

const router = useRouter()
const historyStore = useHistoryStore()

const tabbarRef = shallowRef<HTMLDivElement>()
const hasOverflow = shallowRef(false) // 标签是否溢出容器

const isFirst = computed(() => historyStore.currentIndex <= 0)
const isLast = computed(() => historyStore.currentIndex >= historyStore.historys.length - 1)

// 鼠标滚轮横向滚动
// https://developer.mozilla.org/zh-CN/docs/Web/API/Element/wheel_event
const handleWheel = (e: WheelEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
        e.currentTarget.scrollLeft += delta
        e.preventDefault()
    }
}

// 滚动标签
// https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollTo
const scrollToTab = () => nextTick(() => {
    const container = tabbarRef.value
    if (!container) return

    hasOverflow.value = container.scrollWidth > container.clientWidth

    const active = container.querySelector<HTMLElement>('li.is-active')
    if (!active) return

    const activeRect = active.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const leftDiff = activeRect.left - containerRect.left // 计算标签偏移容器左边的距离
    const rightDiff = activeRect.right - containerRect.right // 计算标签偏移容器右边的距离

    // 滚动时露出相邻标签的一半
    if (leftDiff < 0) {
        const prev = active.previousElementSibling // 相邻左标签
        const prevWidth = prev instanceof HTMLElement ? prev.offsetWidth / 2 : 0

        container.scrollTo({
            left: Math.max(container.scrollLeft + leftDiff - prevWidth, 0),
            behavior: 'smooth'
        })
    } else if (rightDiff > 0) {
        const next = active.nextElementSibling // 相邻右标签
        const nextWidth = next instanceof HTMLElement ? next.offsetWidth / 2 : 0
        const maxScroll = container.scrollWidth - container.clientWidth

        container.scrollTo({
            left: Math.min(container.scrollLeft + rightDiff + nextWidth, maxScroll),
            behavior: 'smooth'
        })
    }
})

// 监听元素变化
const resizeObserver = new ResizeObserver(() => {
    scrollToTab()
})

// 切换标签
const changeTab = (index: number) => {
    const item = historyStore.historys[index]
    if (item) {
        router.replace(item.fullPath)
    }
}

// 上一个标签
const prevTab = () => {
    if (!isFirst.value) {
        changeTab(historyStore.currentIndex - 1)
    }
}

// 下一个标签
const nextTab = () => {
    if (!isLast.value) {
        changeTab(historyStore.currentIndex + 1)
    }
}

// 移除标签
const removeTab = (index: number) => {
    const item = historyStore.historys[index]
    if (item) {
        const isCurrent = historyStore.currentIndex === index
        historyStore.removeHistory(item.name)

        // 判断移除的是否当前页面
        if (isCurrent) {
            const target = historyStore.historys[index] ?? historyStore.historys[index - 1]
            if (target) {
                router.replace(target.fullPath) // 跳转到相邻标签
            }
        }
    }
}

const handleCommand = (command: string) => {
    if (command === 'other') {
        historyStore.removeOtherHistorys()
    } else if (command === 'left') {
        historyStore.removeLeftHistorys()
    } else if (command === 'right') {
        historyStore.removeRightHistorys()
    }
}

watch([() => historyStore.currentIndex, () => historyStore.historys.length], () => {
    scrollToTab()
}, { flush: 'post' })

onMounted(() => {
    const el = tabbarRef.value
    if (el) {
        resizeObserver.observe(el)
    }
})

onBeforeUnmount(() => {
    resizeObserver.disconnect()
})
</script>

<style lang="less">
@import './index.less';
</style>