<template>
    <div class="app-nav-bar">
        <div class="app-nav-bar__tabbar">
            <ul>
                <template v-for="(item, index) in historyStore.historys" :key="index">
                    <li :class="{ 'is-active': activeName === item.name }" @click="changeTab(index)">
                        <span class="text">{{ item.title }}</span>
                        <span class="icon" v-if="historyStore.historys.length > 1">
                            <app-icon icon="CircleCloseFilled" @click.stop="removeTab(index)" />
                        </span>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHistoryStore } from '@pc/router/history'
import AppIcon from '@pc/components/ui/icon/index.vue'

const historyStore = useHistoryStore()

const route = useRoute()
const router = useRouter()

const activeName = shallowRef(route.name)

// 切换标签
const changeTab = (index: number) => {
    const item = historyStore.historys[index]
    if (item) {
        activeName.value = item.name
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

watch(() => route.name, (name) => {
    activeName.value = name
})
</script>

<style lang="less">
@import './index.less';
</style>