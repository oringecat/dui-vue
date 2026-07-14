<template>
    <div class="app-action">
        <template v-if="!dropdown">
            <template v-for="action in actions" :key="action.code">
                <slot :name="action.code" :action="action">
                    <el-button :icon="resolveIcon(action.icon)" :disabled="action.disabled" v-bind="buttonProps"
                        @click="action.onClick">
                        <template v-if="!buttonProps?.circle || !action.icon">{{ action.title }}</template>
                    </el-button>
                </slot>
            </template>
        </template>
        <el-dropdown @command="onAction" v-else-if="actions.length">
            <el-button :icon="MoreFilled" v-bind="buttonProps" circle />
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
import type { ButtonProps } from 'element-plus'
import type { ActionItem } from '@/composables/auth-components/types'

defineProps<{
    actions: ActionItem[]
    dropdown?: boolean
    buttonProps?: Partial<ButtonProps>
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