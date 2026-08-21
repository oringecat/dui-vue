<template>
    <el-splitter class="app-page">
        <el-splitter-panel class="app-page__sidebar" size="220px">
            <el-menu class="app-page__menu" :default-active="String(route.name)" unique-opened
                @select="navigatorTo">
                <el-menu-item class="app-page__menu-brand" index="brand">管理后台</el-menu-item>
                <app-side-menu :menus="authStore.userMenus" />
            </el-menu>
        </el-splitter-panel>
        <el-splitter-panel class="app-page__container">
            <div class="app-page__header">
                <el-breadcrumb separator-icon="ArrowRight">
                    <template v-for="(item, index) in route.matched" :key="index">
                        <el-breadcrumb-item>
                            <span>{{ item.meta.title }}</span>
                        </el-breadcrumb-item>
                    </template>
                </el-breadcrumb>
            </div>
            <div class="app-page__body">
                <div class="app-page__tabs">
                    <app-nav-bar />
                </div>
                <div class="app-page__main">
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
import AppNavBar from '@pc/components/layouts/nav-bar/index.vue'

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