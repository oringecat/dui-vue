<template>
    <el-splitter ref="splitterRef" class="dui-page" @resize-start="isResizing = true" @resize-end="isResizing = false">
        <el-splitter-panel class="dui-page__sidebar" :class="{ 'is-resizing': isResizing }" v-model:size="sidebar.width"
            :resizable="!isFolded" @transitionend.self="onTransitionEnd">
            <el-menu class="dui-page__menu" :default-active="String(route.name)" :collapse="isCollapse"
                :collapse-transition="false" unique-opened @select="navigatorTo">
                <el-menu-item class="dui-page__menu-brand" index="brand">
                    <app-icon icon="Menu" pointer @click.stop="expandSidebar" v-if="isCollapse" />
                    <template #title>管理后台</template>
                </el-menu-item>
                <app-side-menu :menus="authStore.userMenus" />
            </el-menu>
        </el-splitter-panel>
        <el-splitter-panel class="dui-page__container" :size="contentWidth" @click="collapseSidebar">
            <div class="dui-page__header">
                <div class="dui-page__header-left g-flex">
                    <app-icon class="icon-collapse" :icon="isFolded ? 'Expand' : 'Fold'" :size="20"
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
import { shallowRef, reactive, computed, onMounted, nextTick, onBeforeUnmount, type Component } from 'vue'
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

const isResizing = shallowRef(true) // 阻止首次加载动画
const isCollapse = shallowRef(false) // 菜单折叠
const isFolded = shallowRef(false) // 手动折叠

const sidebar = reactive({
    width: 220, // 当前宽度
    expanded: 220, // 展开宽度
    collapsed: 64 // 折叠宽度
})

const contentWidth = computed(() => {
    const width = splitterWidth.value - sidebar.width
    return width > 0 ? width : undefined
})

// 展开菜单
const expandSidebar = () => {
    isCollapse.value = false
    sidebar.width = sidebar.expanded // 还原展开后的宽度
}

// 折叠菜单
const collapseSidebar = () => {
    if (!isFolded.value) return

    if (sidebar.width !== sidebar.collapsed) {
        sidebar.expanded = sidebar.width // 记住拖拽后的宽度
    }

    sidebar.width = sidebar.collapsed
}

// 折叠/展开
const toggleCollapse = () => {
    isFolded.value = !isFolded.value
    isFolded.value ? collapseSidebar() : expandSidebar()
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
    if (name === 'brand') return
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

    nextTick(() => {
        isResizing.value = false
    })
})

onBeforeUnmount(() => {
    resizeObserver?.disconnect()
})
</script>

<style lang="less">
@import './index.less';
</style>