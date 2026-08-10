<template>
    <app-list class="product-list" v-model:loading="loading" :finished="!hasMore" :error="failed" @load="loadData">
        <app-waterfall :data-list="appendList">
            <template #default="{ item }">
                <div class="product-list__item" @click="navigateTo(item.id)">
                    <div class="product-list__item-image"
                        :style="{ aspectRatio: item.image.width + '/' + item.image.height }">
                        <van-image :src="getImageUrl(item.image)" width="100%" height="100%" />
                    </div>
                    <div class="product-list__item-title">
                        <span>{{ item.title }}</span>
                    </div>
                </div>
            </template>
        </app-waterfall>
    </app-list>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useDataTable } from '@/composables/datatable'
import { useRefresh } from '@/composables/refresh'
import { createProductList } from '@/services/api/product'
import AppList from '@mobile/components/ui/list/index.vue'
import AppWaterfall from '@/components/waterfall/index.vue'

const props = defineProps({
    refreshId: Number
})

const router = useRouter()

const { appendList, pageIndex, pageSize, hasMore, updateItems, nextPage } = useDataTable<Product.ProductListItem>()

const { loading, failed, fetch } = createProductList({
    data: {
        pageSize: pageSize.value,
        pageIndex: pageIndex.value
    },
    onSuccess: (res) => {
        updateItems(res.data, res.total)
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

// 根据原图比例输出等比缩放的图片
const getImageUrl = (image: Product.ProductListItem['image']) => {
    const maxWidth = 160
    return `${image.url}/${maxWidth}/${Math.round(maxWidth * image.height / image.width)}`
}

const navigateTo = (id: number) => {
    router.push({
        name: 'store-detail',
        query: { id }
    })
}
</script>

<style lang="less">
@import './index.less';
</style>