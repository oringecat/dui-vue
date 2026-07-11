<template>
    <app-page-view class="shop">
        <template #header>
            <app-nav-bar>
                <template #left>
                    <van-search v-model="keyword" shape="round" left-icon="scan" right-icon="search" />
                </template>
            </app-nav-bar>
        </template>
        <app-pull-refresh :refresh-id="activeTab">
            <van-tabs v-model:active="activeTab">
                <van-tab title="标签 1">
                    <product-list :refresh-id="0" />
                </van-tab>
                <van-tab title="标签 2">
                    <product-list :refresh-id="1" />
                </van-tab>
                <van-tab title="标签 3">
                    <product-list :refresh-id="2" />
                </van-tab>
                <van-tab title="标签 4">
                    <product-list :refresh-id="3" />
                </van-tab>
            </van-tabs>
        </app-pull-refresh>
    </app-page-view>
</template>

<script lang="ts" setup>
import { shallowRef, defineAsyncComponent } from 'vue'
import AppPullRefresh from '@mobile/components/ui/pull-refresh/index.vue'

const ProductList = defineAsyncComponent(() => import('./components/product/index.vue'))

const activeTab = shallowRef(0)
const keyword = shallowRef('')
</script>