<template>
    <div class="launch" v-loading="true"></div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const loginStore = useLoginStore()
const authStore = useAuthStore()

const initializeApp = async () => {
    try {
        await loginStore.autoLogin()

        if (loginStore.token) {
            await authStore.fetchUserAuth(router)
        }

        if (loginStore.token && authStore.hasAuth) {
            const redirected = route.redirectedFrom
            if (redirected) {
                router.replace(redirected.fullPath)
            } else {
                router.replace('/')
            }
        } else {
            router.replace('/login')
        }
    } catch {
        router.replace('/login')
    }
}

initializeApp()
</script>

<style lang="less" scoped>
@import './index.less';
</style>