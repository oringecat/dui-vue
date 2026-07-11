<!-- 右键菜单 -->
<template>
    <teleport to="body" v-if="state">
        <div class="app-context-menu" :style="{ left: state.x + 'px', top: state.y + 'px' }" @click.stop>
            <ul>
                <template v-for="(menu, index) in visibleMenus" :key="index">
                    <li :class="[menu.className, { 'is-disabled': menu.disabled(state) }]"
                        @click="onContextMenuClick(menu)">
                        <app-icon :icon="menu.icon" v-if="menu.icon" />
                        <span>{{ menu.title }}</span>
                    </li>
                </template>
            </ul>
        </div>
    </teleport>
</template>

<script lang="ts" generic="T" setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import type { ContextMenuState, ContextMenuItem } from './types'
import AppIcon from '@pc/components/ui/icon/index.vue'

const props = defineProps<{
    state?: ContextMenuState<T>
    contextMenus: ContextMenuItem<T>[]
}>()

const emit = defineEmits<{
    'update:state': [value?: ContextMenuState<T>]
}>()

// 可见的右键菜单列表
const visibleMenus = computed(() => props.contextMenus.filter(({ visibility }) => {
    const state = props.state
    return state ? visibility(state) : true
}))

// 右键菜单点击事件
const onContextMenuClick = (menu: ContextMenuItem<T>) => {
    if (props.state) {
        menu.onClick(props.state)
    }
    hideContextMenu()
}

// 点击空白区域隐藏右键菜单
const hideContextMenu = () => {
    emit('update:state', undefined)
}

onMounted(() => {
    document.addEventListener('click', hideContextMenu)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', hideContextMenu)
})
</script>

<style lang="less">
@import './index.less';
</style>