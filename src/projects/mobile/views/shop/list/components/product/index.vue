<template>
    <app-list class="product-list" v-model:loading="loading" :finished="!hasMore" :error="failed" @load="loadData">
        <app-waterfall :data-list="appendList">
            <template #default="{ item }">
                <div class="product-list__item">
                    {{ item.productName }}
                </div>
            </template>
        </app-waterfall>
    </app-list>
</template>

<script lang="ts" setup>
import { useDataTable } from '@/composables/datatable'
import { useRefresh } from '@/composables/refresh'
import { createProductList } from '@/services/api/product'
import AppList from '@mobile/components/ui/list/index.vue'
import AppWaterfall from '@/components/waterfall/index.vue'

const props = defineProps({
    refreshId: Number
})

const { appendList, pageIndex, pageSize, hasMore, failed, updateItems, nextPage } = useDataTable<Product.ListItem>()

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

const { refreshing, refreshFinish } = useRefresh(loadData, {
    refreshId: props.refreshId
})
</script>

<style lang="less">
@import './index.less';
</style>