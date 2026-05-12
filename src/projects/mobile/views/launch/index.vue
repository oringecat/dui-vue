<template>
    <div class="launch">
        <van-loading v-if="userStore.loading" />
    </div>
</template>

<script lang="ts" setup>
import { showConfirmDialog } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const initializeApp = () => {
    userStore.autoLogin().then(() => {
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