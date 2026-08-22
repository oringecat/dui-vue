<template>
    <div class="app-nav-bar">
        <div class="app-nav-bar__tabbar">
            <ul>
                <template v-for="(item, index) in historyStore.historys" :key="index">
                    <li :class="{ 'is-active': historyStore.currentIndex === index }" @click="changeTab(index)">
                        <span class="text">{{ item.title }}</span>
                        <span class="icon" v-if="historyStore.historys.length > 1">
                            <app-icon icon="CircleCloseFilled" @click.stop="removeTab(index)" />
                        </span>
                    </li>
                </template>
            </ul>
        </div>
        <el-dropdown class="app-nav-bar__dropdown" v-if="historyStore.historys.length > 1" @command="handleCommand">
            <app-icon icon="ArrowDown" />
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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHistoryStore } from '@pc/router/history'
import AppIcon from '@pc/components/ui/icon/index.vue'

const historyStore = useHistoryStore()

const route = useRoute()
const router = useRouter()

const isFirst = computed(() => historyStore.currentIndex <= 0)
const isLast = computed(() => historyStore.currentIndex >= historyStore.historys.length - 1)

// 切换标签
const changeTab = (index: number) => {
    const item = historyStore.historys[index]
    if (item) {
        router.replace(item.fullPath)
    }
}

// 移除标签
const removeTab = (index: number) => {
    const item = historyStore.historys[index]
    if (item) {
        historyStore.removeHistory(item.name)

        const lastItem = historyStore.historys[historyStore.historys.length - 1]

        // 判断移除的是否当前页面
        if (lastItem && item.fullPath === route.fullPath) {
            router.replace(lastItem.fullPath)
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
</script>

<style lang="less">
@import './index.less';
</style>