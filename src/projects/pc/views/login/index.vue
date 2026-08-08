<template>
    <div class="login">
        <div class="login__wrapper">
            <div class="login__header">
                <div class="login__header-title">管理后台</div>
                <div class="login__header-version">v1.0.{{ version }}</div>
            </div>
            <div class="login__main">
                <h1 class="login__main-title">登录</h1>
                <el-form size="large">
                    <el-form-item>
                        <el-input v-model="formData.account" placeholder="请输入用户名" />
                    </el-form-item>
                    <el-form-item>
                        <el-input type="password" v-model="formData.password" placeholder="请输入密码" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" color="#354d67" @click="onSubmit" :loading="loading"
                            block>登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="login__copyright">{{ copyright }}</div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, shallowRef, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const version = import.meta.env.REVISED || '0'

const copyright = computed(() => {
    const year = [...new Set([2026, new Date().getFullYear()])]
    return `© ${year.join('-')} Dui-Vue`
})

const loading = shallowRef(false)

const formData = reactive<User.LoginRequest>({
    account: '',
    password: '',
    client: 'web',
    version: '1.0.0',
})

const onSubmit = async () => {
    try {
        loading.value = true
        await userStore.userLogin(formData)
        await authStore.fetchUserAuths(router)

        if (authStore.hasAuth) {
            const redirected = route.redirectedFrom
            if (redirected) {
                router.replace(redirected.fullPath)
            } else {
                router.replace('/')
            }
        } else {
            ElMessage.error('权限不足')
        }
    } catch (err) {
        loading.value = false
        formData.password = ''
        ElMessage.error(err as string)
    }
}
</script>

<style lang="less">
@import './index.less';
</style>