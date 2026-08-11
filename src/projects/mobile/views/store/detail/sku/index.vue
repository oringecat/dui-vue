<template>
    <div class="store-detail-sku">
        <div>
            <div v-if="selectedSku">
                <span>{{ selectedSku.code }}</span>
            </div>
            <van-stepper v-model="quantity" :min="1" :max="selectedSku?.stock ?? 1" :disabled="!selectedSku" />
        </div>
        <div v-for="{ attr, specs } in saleGroups" :key="attr.id">
            <h4>{{ attr.saleName }}</h4>
            <van-radio-group v-model="selectedOptions[attr.id]">
                <template v-for="spec in specs" :key="spec.id">
                    <van-radio :name="spec.id" :disabled="spec.disabled">{{ spec.specName }}</van-radio>
                </template>
            </van-radio-group>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, reactive, onMounted, computed } from 'vue'
import { createCategorySaleAttrList, createCategorySaleSpecList } from '@/services/api/product'

const props = defineProps<{
    skus: Product.ProductSkuItem[]
    categoryId: number
}>()

const attrs = shallowRef<Product.CategorySaleAttrItem[]>([])
const specs = shallowRef<Product.CategorySaleSpecItem[]>([])
const quantity = shallowRef(1)

const selectedOptions = reactive<Record<number, number>>({})

const selectedSku = computed(() => {
    const entries = Object.entries(selectedOptions)
    if (entries.length < saleGroups.value.length) return undefined
    return props.skus.find((sku) =>
        entries.every(([saleId, specId]) =>
            sku.attrs.some((a) => a.saleId === Number(saleId) && a.specId === specId)
        )
    )
})

// 销售选项组
const saleGroups = computed(() => attrs.value.map((attr) => {
    const saleSpecs = specs.value.filter(({ saleId }) => saleId === attr.id)

    const options = saleSpecs.map((spec) => ({
        ...spec,
        disabled: !props.skus.some((sku) =>
            sku.stock > 0 && sku.attrs.some((a) => a.saleId === attr.id && a.specId === spec.id)
        )
    }))

    return {
        attr,
        specs: options
    }
}).filter(({ specs }) => specs.length > 0))

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