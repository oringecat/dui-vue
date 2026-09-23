<template>
    <el-splitter ref="splitterRef" class="dui-page" @resize-start="state.isResizing = true"
        @resize-end="state.isResizing = false" @pointerdown.once="state.isResizing = false">
        <el-splitter-panel class="dui-page__sidebar" :class="{ 'is-resizing': state.isResizing }"
            v-model:size="sidebar.width" :resizable="!state.isFolded" @transitionend.self="onTransitionEnd">
            <div class="dui-page__menu" :class="{ 'is-fixed': state.isFixed }">
                <el-scrollbar>
                    <el-menu :default-active="String(route.name)" :collapse="state.isCollapse"
                        :collapse-transition="state.isFixed" unique-opened @select="navigatorTo">
                        <li class="el-menu-item dui-page__menu-brand" @click="state.isCollapse = false">
                            <app-icon icon="Menu" pointer v-if="state.isCollapse" />
                            <span v-else>管理后台</span>
                        </li>
                        <app-side-menu :menus="authStore.userMenus" />
                    </el-menu>
                </el-scrollbar>
            </div>
        </el-splitter-panel>
        <el-splitter-panel class="dui-page__container" :size="contentWidth" @click="collapseSidebar">
            <div class="dui-page__header">
                <div class="dui-page__header-left g-flex">
                    <app-icon class="icon-collapse" :icon="state.isFolded ? 'Expand' : 'Fold'" :size="20"
                        @click="toggleCollapse" />
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
                        <transition name="view" mode="out-in">
                            <!-- 缓存组件 -->
                            <keep-alive :exclude="historyStore.excludes">
                                <component :is="handleComponent(Component, route)" :key="route.fullPath" />
                            </keep-alive>
                        </transition>
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

const initFolded = false // 初始折叠状态

// https://developer.mozilla.org/zh-CN/docs/Web/API/Element/pointerdown_event
const state = reactive({
    isResizing: true, // 阻止首次加载动画
    isCollapse: initFolded, // 菜单折叠
    isFolded: initFolded, // 手动折叠
    isFixed: initFolded // 菜单固定
})

const sidebar = reactive({
    width: initFolded ? 64 : 220, // 当前宽度
    expanded: 220, // 展开宽度
    collapsed: 64 // 折叠宽度
})

const contentWidth = computed(() => {
    const width = splitterWidth.value - sidebar.width
    return width > 0 ? width : undefined
})

// 展开菜单
const expandSidebar = () => {
    state.isCollapse = false
    state.isFixed = false
    sidebar.width = sidebar.expanded // 还原展开后的宽度
}

// 折叠菜单
const collapseSidebar = () => {
    if (!state.isFolded) return

    if (state.isFixed) {
        state.isCollapse = true
        return
    }

    if (sidebar.width !== sidebar.collapsed) {
        sidebar.expanded = sidebar.width // 记住拖拽后的宽度
    }

    sidebar.width = sidebar.collapsed
}

// 折叠/展开
const toggleCollapse = () => {
    state.isFolded = !state.isFolded
    state.isFolded ? collapseSidebar() : expandSidebar()
}

// 折叠动画结束
const onTransitionEnd = () => {
    if (sidebar.width === sidebar.collapsed) {
        state.isCollapse = true
        state.isFixed = true
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
    collapseSidebar()
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