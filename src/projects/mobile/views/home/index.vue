<template>
    <app-page-view :threshold="200">
        <template #header-sticky>
            <app-nav-bar>
                <template #left>
                    <app-block>
                        <h3>首页</h3>
                    </app-block>
                </template>
            </app-nav-bar>
        </template>
        <template #header-scroll>
            <app-status-bar>
                <van-search v-model="keyword" />
            </app-status-bar>
        </template>
        <app-pull-refresh>
            <van-empty v-for="i in 10" :key="i" />
        </app-pull-refresh>
    </app-page-view>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import AppPullRefresh from '@mobile/components/base/pull-refresh/index.vue'

const keyword = shallowRef('')
</script>