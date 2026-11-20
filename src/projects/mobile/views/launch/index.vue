<template>
    <div class="launch">
        <van-loading v-if="loginStore.loading" />
    </div>
</template>

<script lang="ts" setup>
import { showConfirmDialog } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'

const route = useRoute()
const router = useRouter()
const loginStore = useLoginStore()

const initializeApp = () => {
    loginStore.autoLogin().then(() => {
        const redirected = route.redirectedFrom
        if (redirected) {
            router.replace(redirected.fullPath)
        } else {
            router.replace('/')
        }
    }).catch((err) => {
        showConfirmDialog({
            message: err,
            confirmButtonText: '重试'
        }).then(() => {
            initializeApp()
        })
    })
}

initializeApp()
</script>

<style lang="less" scoped>
@import './index.less';
</style>