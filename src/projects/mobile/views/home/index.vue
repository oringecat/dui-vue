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
            <van-swipe class="banner-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item>1</van-swipe-item>
                <van-swipe-item>2</van-swipe-item>
                <van-swipe-item>3</van-swipe-item>
                <van-swipe-item>4</van-swipe-item>
            </van-swipe>
            <van-empty v-for="i in 10" :key="i" />
        </app-pull-refresh>
    </app-page-view>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import AppPullRefresh from '@mobile/components/ui/pull-refresh/index.vue'

const keyword = shallowRef('')
</script>

<style lang="less">
.banner-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
}
</style>