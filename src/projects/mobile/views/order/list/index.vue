<template>
    <app-page-view>
        <template #header>
            <app-nav-bar title="订单" />
        </template>
        <app-pull-refresh>
            <app-list class="order-list" v-model:loading="loading" :finished="!hasMore" :error="failed"
                @load="loadData">
                <div v-for="(item, index) in appendList" :key="index">
                    {{ item.productName }}
                    <van-button type="primary" @click="openComponent('detail')">详情</van-button>
                </div>
            </app-list>
        </app-pull-refresh>
        <component :show="showComponent" :is="components[componentId]" @closed="closeComponent" />
    </app-page-view>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, type Component } from 'vue'
import { useComponent } from '@/composables/component'
import { useDataTable } from '@/composables/datatable'
import { useRefresh } from '@/composables/refresh'
import { createProductList } from '@/services/api/product'
import AppPullRefresh from '@mobile/components/ui/pull-refresh/index.vue'
import AppList from '@mobile/components/ui/list/index.vue'

const components: Record<string, Component> = {
    detail: defineAsyncComponent(() => import('../detail/index.vue'))
}

const { showComponent, componentId, openComponent, closeComponent } = useComponent()

const { appendList, pageIndex, pageSize, hasMore,  failed, updateItems, nextPage } = useDataTable<Product.ProductListItem>()

const { loading, fetch } = createProductList({
    data: {
        pageSize: pageSize.value,
        pageIndex: pageIndex.value
    },
    onSuccess: (res) => {
        updateItems(res.data, res.total)
    },
    onError: () => {
        failed.value = true
    },
    onFinally: () => {
        refreshFinish()
    }
})

const loadData = () => {
    if (nextPage(refreshing.value)) {
        fetch({
            pageIndex: pageIndex.value
        })
    }
}

const { refreshing, refreshFinish } = useRefresh(loadData)
</script>