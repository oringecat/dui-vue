<template>
    <div class="app-action">
        <template v-if="!dropdown">
            <template v-for="action in actions" :key="action.code">
                <slot :name="action.code" :action="action">
                    <el-button :type="type" :icon="resolveIcon(action.icon)" :size="size" :disabled="action.disabled"
                        @click="action.onClick">
                        {{ action.title }}
                    </el-button>
                </slot>
            </template>
        </template>
        <el-dropdown @command="onAction" v-else-if="actions.length">
            <el-button :type="type" :icon="MoreFilled" :size="size" circle />
            <template #dropdown>
                <el-dropdown-menu>
                    <template v-for="action in actions" :key="action.code">
                        <el-dropdown-item :icon="resolveIcon(action.icon)" :disabled="action.disabled"
                            :command="action">
                            <slot :name="action.code" :action="action">
                                {{ action.title }}
                            </slot>
                        </el-dropdown-item>
                    </template>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts" setup>
import { resolveDynamicComponent, type Component } from 'vue'
import { MoreFilled, Warning } from '@element-plus/icons-vue'
import type { ButtonType, ComponentSize } from 'element-plus'
import type { ActionItem } from '@/composables/auth-components/types'

defineProps<{
    actions: ActionItem[]
    type?: ButtonType
    size?: ComponentSize
    dropdown?: boolean
}>()

const onAction = (action: ActionItem) => {
    action.onClick()
}

// 解析图标
const resolveIcon = (icon?: string) => {
    if (icon) {
        const component = resolveDynamicComponent(icon) as Component
        return typeof component === 'string' ? Warning : component
    }
    return icon
}
</script>

<style lang="less">
@import './index.less';
</style>