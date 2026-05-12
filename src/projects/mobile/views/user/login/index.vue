<template>
    <app-page-view>
        <template #header>
            <app-nav-bar title="登录" />
        </template>
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="formData.account" name="account" label="账号" placeholder="必填"
                    autocomplete="username" />
                <van-field v-model="formData.password" type="password" name="password" label="密码" placeholder="必填"
                    autocomplete="new-password" />
            </van-cell-group>
            <app-block>
                <van-button type="primary" native-type="submit" :disabled="userStore.loading" block>登录</van-button>
            </app-block>
        </van-form>
    </app-page-view>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showLoadingToast, showFailToast, closeToast } from 'vant'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const formData = reactive<User.LoginParams>({
    account: '',
    password: '',
    client: 'web',
    version: '1.0.0',
})

// 判断是否能返回
const hasBack = !!router.options.history.state.back

const onSubmit = () => {
    showLoadingToast('登录中...')

    userStore.userLogin(formData).then(() => {
        const redirected = route.redirectedFrom
        if (redirected) {
            router.push({ ...redirected, replace: true })
        } else if (hasBack) {
            router.back()
        } else {
            router.push({ path: '/', replace: true })
        }
        closeToast()
    }).catch((err) => {
        formData.password = ''
        showFailToast(err)
    })
}
</script>