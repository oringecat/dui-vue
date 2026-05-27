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
                <div style="background-color: #fff;">{{ virtualList.length }} index {{ pageIndex }}</div>
            </app-status-bar>
        </template>
        <app-pull-refresh>
            <van-swipe class="banner-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item>1</van-swipe-item>
                <van-swipe-item>2</van-swipe-item>
                <van-swipe-item>3</van-swipe-item>
                <van-swipe-item>4</van-swipe-item>
            </van-swipe>
            <app-scroll-view @scroll-toupper="onScrollToupper" @scroll-tolower="onScrollTolower">
                <div v-for="{ pageIndex, items } in virtualList" :key="pageIndex" :data-page="pageIndex">
                    <template v-for="(item, index) in items" :key="index">
                        <div style="height: 50px;">{{ item.productName }}</div>
                    </template>
                </div>
            </app-scroll-view>
        </app-pull-refresh>
    </app-page-view>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import { useDataTable } from '@/composables/datatable-v2'
import { getProductList } from '@/services/api/product'
import AppPullRefresh from '@mobile/components/base/pull-refresh/index.vue'

const keyword = shallowRef('')

const { virtualList, pageIndex, pageSize, hasData, hasMore, updateItems, prevPage, nextPage } = useDataTable<Product.ProductItem>()

const { loading, fetch } = getProductList({
    data: {
        pageSize: pageSize.value,
        pageIndex: pageIndex.value
    },
    onSuccess: (res) => {
        updateItems(res.data, res.total)
    }
})

const onScrollToupper = () => {
    prevPage()
}

const onScrollTolower = () => {
    if (hasMore.value) {
        if (nextPage() && !hasData.value) {
            fetch({
                pageIndex: pageIndex.value
            })
        }
    }
}
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