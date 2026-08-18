<template>
    <app-page-view class="store-detail">
        <template #header>
            <app-nav-bar fixed />
        </template>
        <van-swipe class="store-detail-image" v-if="detail">
            <van-swipe-item v-for="(image, index) in detail.images" :key="index">
                <van-image :src="`${image.url}/750/750`" width="100%" height="100%" />
            </van-swipe-item>
        </van-swipe>
        <app-block-group type="primary" :inset="false" v-if="detail">
            <app-block class="store-detail-info">
                <h4>{{ detail.title }}</h4>
            </app-block>
            <app-block class="store-detail-attr">
                <table cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr v-for="([label, value], index) in attributes" :key="index">
                            <th>{{ label }}</th>
                            <td>{{ value }}</td>
                        </tr>
                    </tbody>
                </table>
            </app-block>
            <app-block class="store-detail-spu">
                <ul>
                    <template v-for="(spu, index) in spus" :key="index">
                        <li :class="{ active: index === spuIndex }">
                            <span @click="spuIndex = index">{{ spu.spuName }}</span>
                        </li>
                    </template>
                </ul>
                <sku-view :skus="spuItem.skus" v-if="spuItem" />
            </app-block>
            <div class="store-detail-desc">
                <div v-html="detail.description"></div>
                <div v-html="spuItem.spuContent" v-if="spuItem"></div>
            </div>
        </app-block-group>
        <van-empty v-else-if="!loading" />
    </app-page-view>
</template>

<script lang="ts" setup>
import { shallowRef, computed, defineAsyncComponent } from 'vue'
import { useNavigation } from '@/composables/navigation'
import { createProductDetail, createCategoryList, createProductSpuList } from '@/services/api/product'
import { useAttributeStore } from '@/stores/attribute'

const skuView = defineAsyncComponent(() => import('./sku/index.vue'))

const { getQueryStringToNumber } = useNavigation()

const productId = getQueryStringToNumber('id')

const attributeStore = useAttributeStore()

const detail = shallowRef<Product.ProductDetail>()
const attributes = shallowRef<[string, string][]>([])
const spus = shallowRef<Product.ProductSpuItem[]>([])
const spuIndex = shallowRef(0)

const spuItem = computed(() => spus.value[spuIndex.value])

const loading = computed(() => detailLoading.value || spuLoading.value)

const { rawFetch: getCategoryList } = createCategoryList({
    manual: true
})

const { loading: detailLoading } = createProductDetail({
    data: {
        id: productId
    },
    onSuccess: (res) => {
        const attrMap = new Map(res.data.attrs.map((a) => [a.attributeId, a.attributeValue]))

        if (attrMap.size) {
            Promise.all([
                getCategoryList({ categoryId: res.data.categoryId }),
                attributeStore.readyPromise
            ]).then(([categoryRes]) => {
                const attrs = categoryRes.data[0]?.attrs ?? []

                attributes.value = attrs.reduce<[string, string][]>((acc, cur) => {
                    const value = attrMap.get(cur.attributeId)
                    const attribute = attributeStore.getAttributeById(cur.attributeId)
                    if (value && attribute) acc.push([attribute.name, value])
                    return acc
                }, [])
            })
        }

        detail.value = res.data
    }
})

const { loading: spuLoading } = createProductSpuList({
    data: {
        productId
    },
    onSuccess: (res) => {
        spus.value = res.data
    }
})
</script>

<style lang="less">
@import './index.less';
</style>