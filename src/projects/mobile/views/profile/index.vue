<template>
    <app-page-view>
        <template #header>
            <app-nav-bar title="我的" :show-back-button="false" />
        </template>
        <van-grid>
            <van-grid-item icon="orders-o" text="订单" :to="{ name: 'order-list' }" />
        </van-grid>
        <van-cell-group inset>
            <van-cell title="登录" :to="{ name: 'user-login' }" is-link v-if="!loginStore.token" />
            <van-cell title="设置" :to="{ name: 'setting-language' }" is-link />
        </van-cell-group>
        <app-block>
            <van-button type="primary" block @click="logout">退出</van-button>
        </app-block>
        <app-block v-if="loginStore.token">
            {{ loginStore.loginInfo }}
        </app-block>
    </app-page-view>
</template>

<script lang="ts" setup>
import { showConfirmDialog } from 'vant'
import { useLoginStore } from '@/stores/login'

const loginStore = useLoginStore()

const logout = () => {
    showConfirmDialog({
        message: '确认退出登录？'
    }).then(() => {
        loginStore.userLogout()
    })
}
</script>