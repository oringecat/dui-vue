<template>
    <div class="app-nav-back" @click="onBack">
        <slot>
            <Icon name="arrow-left" v-if="hasBack" />
            <Icon name="wap-home-o" v-else />
        </slot>
    </div>
</template>

<script lang="ts" setup>
import { useAttrs } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from 'vant'

const emit = defineEmits()
const router = useRouter()
const attrs = useAttrs()

const hasBack = !!router.options.history.state.back

// 返回按钮事件
const onBack = () => {
    if (attrs.onBack) {
        emit('back')
    } else if (hasBack) {
        router.go(-1)
    } else {
        router.replace('/')
    }
}
</script>

<style lang="less">
@import './index.less';
</style>