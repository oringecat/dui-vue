<template>
    <div class="app-action">
        <template v-if="!dropdown">
            <template v-for="action in actions" :key="action.code">
                <slot :name="action.code" :action="action">
                    <el-button :type="type" :size="size" :disabled="action.disabled" @click="action.onClick">
                        {{ action.title }}
                    </el-button>
                </slot>
            </template>
        </template>
        <el-dropdown @command="onAction" v-else-if="actions.length">
            <el-button :icon="MoreFilled" :size="size" circle />
            <template #dropdown>
                <el-dropdown-menu>
                    <template v-for="action in actions" :key="action.code">
                        <el-dropdown-item :disabled="action.disabled" :command="action">
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
import { MoreFilled } from '@element-plus/icons-vue'
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
</script>

<style lang="less">
@import './index.less';
</style>