<template>
    <el-splitter ref="splitterRef" class="dui-page" @resize-start="isResizing = true" @resize-end="isResizing = false">
        <el-splitter-panel class="dui-page__sidebar" :class="{ 'is-resizing': isResizing }" v-model:size="sidebar.width"
            :resizable="!isCollapse" @transitionend.self="onTransitionEnd">
            <el-menu class="dui-page__menu" :default-active="String(route.name)" :collapse="isCollapse"
                :collapse-transition="false" unique-opened @select="navigatorTo">
                <el-menu-item class="dui-page__menu-brand" index="brand">管理后台</el-menu-item>
                <app-side-menu :menus="authStore.userMenus" />
            </el-menu>
        </el-splitter-panel>
        <el-splitter-panel class="dui-page__container" :size="contentWidth">
            <div class="dui-page__header">
                <div class="dui-page__header-left g-flex">
                    <app-icon :icon="isCollapse ? 'Expand' : 'Fold'" :size="20" pointer @click="toggleCollapse" />
                    <el-breadcrumb separator-icon="ArrowRight">
                        <template v-for="(item, index) in route.matched" :key="index">
                            <el-breadcrumb-item>
                                <span>{{ item.meta.title }}</span>
                            </el-breadcrumb-item>
                        </template>
                    </el-breadcrumb>
                </div>
                <div class="dui-page__header-right g-flex">
                    <el-dropdown trigger="click">
                        <div class="dui-page__user">
                            <span>{{ `${userStore.userInfo.realName}(${userStore.userInfo.userName})` }}</span>
                            <app-icon icon="ArrowDown" />
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item icon="SwitchButton"
                                    @click="userStore.userLogout()">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="dui-page__body">
                <div class="dui-page__tabs">
                    <app-nav-bar />
                </div>
                <div class="dui-page__main">
                    <router-view v-slot="{ Component, route }">
                        <!-- 缓存组件 -->
                        <keep-alive :exclude="historyStore.excludes">
                            <component :is="handleComponent(Component, route)" :key="route.fullPath" />
                        </keep-alive>
                    </router-view>
                </div>
            </div>
            <div class="dui-page__footer"></div>
        </el-splitter-panel>
    </el-splitter>
</template>

<script lang="ts" setup>
import { shallowRef, reactive, computed, onMounted, onBeforeUnmount, type Component } from 'vue'
import { useRoute, useRouter, type RouteLocationNormalized } from 'vue-router'
import type { SplitterInstance } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useHistoryStore } from '@pc/router/history'
import AppSideMenu from '@pc/components/layouts/side-menu/index.vue'
import AppNavBar from '@pc/components/layouts/nav-bar/index.vue'
import AppIcon from '@pc/components/ui/icon/index.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const historyStore = useHistoryStore()

const splitterRef = shallowRef<SplitterInstance>()
const splitterWidth = shallowRef(0) // 面板总宽度

const isResizing = shallowRef(false)
const isCollapse = shallowRef(false)

const sidebar = reactive({
    width: 220, // 当前宽度
    expanded: 220, // 展开宽度
    collapsed: 64 // 折叠宽度
})

const contentWidth = computed(() => {
    const width = splitterWidth.value - sidebar.width
    return width > 0 ? width : undefined
})

// 折叠/展开
const toggleCollapse = () => {
    if (isCollapse.value) {
        isCollapse.value = false
        sidebar.width = sidebar.expanded
    } else {
        sidebar.expanded = sidebar.width
        sidebar.width = sidebar.collapsed
    }
}

// 折叠动画结束
const onTransitionEnd = () => {
    if (sidebar.width === sidebar.collapsed) {
        isCollapse.value = true
    }
}

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

// 监听元素变化
const resizeObserver = new ResizeObserver((entries) => {
    for (const { contentRect } of entries) {
        // 面板 size 会被内部转换为百分比，导致折叠后宽度不精确，手动精确宽度
        splitterWidth.value = contentRect.width ?? 0
    }
})

onMounted(() => {
    const el = splitterRef.value?.$el
    if (el) {
        resizeObserver.observe(el)
    }
})
onBeforeUnmount(() => {
    resizeObserver?.disconnect()
})
</script>

<style lang="less">
@import './index.less';
</style>