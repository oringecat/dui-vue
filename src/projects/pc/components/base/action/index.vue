<template>
    <div class="app-action">
        <template v-for="action in actions" :key="action.code">
            <slot :name="action.code" :action="action">
                <el-button :type="type" :size="size" :disabled="action.disabled" @click="action.onClick">
                    {{ action.title }}
                </el-button>
            </slot>
        </template>
    </div>
</template>

<script lang="ts" setup>
import type { ButtonType, ComponentSize } from 'element-plus'
import type { ActionItem } from '@/composables/auth-components/types'

defineProps<{
    actions: ActionItem[]
    type?: ButtonType
    size?: ComponentSize
}>()
</script>

<style lang="less">
@import './index.less';
</style>