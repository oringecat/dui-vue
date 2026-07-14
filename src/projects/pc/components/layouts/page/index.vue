<template>
    <el-splitter class="app-page">
        <el-splitter-panel class="app-page__sidebar" size="240px">
            <el-menu class="app-sidemenu" :default-active="String(route.name)" unique-opened @select="navigatorTo">
                <app-side-menu :menus="authStore.userMenus" />
            </el-menu>
        </el-splitter-panel>
        <el-splitter-panel class="app-page__wrapper">
            <div class="app-page__header"></div>
            <div class="app-page__main">
                <div class="app-page__navbar">
                    <template v-for="(item, index) in historyStore.historys" :key="index">
                        <router-link :to="{ name: item.name }">{{ item.title }}</router-link>
                    </template>
                </div>
                <div class="app-page__container">
                    <router-view v-slot="{ Component, route }">
                        <!-- 缓存组件 -->
                        <keep-alive :exclude="historyStore.excludes">
                            <component :is="handleComponent(Component, route)" :key="route.fullPath" />
                        </keep-alive>
                    </router-view>
                </div>
            </div>
            <div class="app-page__footer"></div>
        </el-splitter-panel>
    </el-splitter>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { useRoute, useRouter, type RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useHistoryStore } from '@pc/router/history'
import AppSideMenu from '@pc/components/layouts/side-menu/index.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const historyStore = useHistoryStore()

// 手动给组件添加 name 属性，处理缓存 exclude 无效的问题
const handleComponent = (component: Component, route: RouteLocationNormalized) => {
    if (component && 'type' in component) {
        component.type.name = route.name
    }
    return component
}

const navigatorTo = (name: string) => {
    router.push({ name })
}
</script>

<style lang="less">
@import './index.less';
</style>