<template>
    <div class="dui-action">
        <template v-if="actions.length">
            <el-dropdown @command="onAction" v-if="type === 'dropdown'">
                <el-button :icon="MoreFilled" v-bind="bindProps" circle />
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
            <template v-else>
                <template v-for="action in actions" :key="action.code">
                    <slot :name="action.code" :action="action">
                        <el-button :class="action.className" :icon="resolveIcon(action.icon)"
                            :disabled="action.disabled" v-bind="bindProps" @click="action.onClick">
                            <template v-if="!bindProps?.circle || !action.icon">{{ action.title }}</template>
                        </el-button>
                    </slot>
                </template>
            </template>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { resolveDynamicComponent, computed, type Component } from 'vue'
import { MoreFilled, Warning } from '@element-plus/icons-vue'
import type { ButtonProps } from 'element-plus'
import type { ActionItem } from '@/composables/auth-components/types'

type ActionType = 'button' | 'link' | 'dropdown'

const props = defineProps<{
    actions: ActionItem[]
    type?: ActionType
    buttonProps?: ButtonProps
}>()

const bindProps = computed<ButtonProps>(() => {
    const defaultProps: Record<ActionType, ButtonProps> = {
        button: {},
        link: {
            link: true,
            type: 'primary',
            size: 'small',
            icon: undefined
        },
        dropdown: {
            size: 'small'
        }
    }

    return {
        ...defaultProps[props.type ?? 'button'],
        ...props.buttonProps
    }
})

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