<template>
    <div class="store-detail-sku">
        {{ skus }}
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, onMounted } from 'vue'
import { createCategorySaleAttrList, createCategorySaleSpecList } from '@/services/api/product'

const props = defineProps<{
    skus: Product.ProductSkuItem[]
    categoryId: number
}>()

const attrs = shallowRef<Product.CategorySaleAttrItem[]>([])
const specs = shallowRef<Product.CategorySaleSpecItem[]>([])

const { rawFetch: getSaleAttrList } = createCategorySaleAttrList({
    manual: true,
    data: {
        categoryId: props.categoryId
    }
})

const { rawFetch: getSaleSpecList } = createCategorySaleSpecList({
    manual: true,
    data: {
        categoryId: props.categoryId
    }
})

onMounted(() => {
    Promise.all([
        getSaleAttrList(),
        getSaleSpecList()
    ]).then(([attrRes, specRes]) => {
        attrs.value = attrRes.data
        specs.value = specRes.data
    })
})
</script>