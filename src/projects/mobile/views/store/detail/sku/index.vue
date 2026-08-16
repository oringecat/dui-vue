<template>
    <div class="store-detail-sku">
        <div>
            <div v-if="selectedSku">
                <span>{{ selectedSku.code }}</span>
            </div>
            <van-stepper v-model="quantity" :min="1" :max="selectedSku?.stock ?? 1" :disabled="!selectedSku" />
        </div>
        <div v-for="{ sale, attribute, specs } in saleGroups" :key="sale.attributeId">
            <h4>{{ attribute.name }}</h4>
            <van-radio-group v-model="selectedOptions[sale.attributeId]">
                <template v-for="spec in specs" :key="spec.id">
                    <van-radio :name="spec.id" :disabled="spec.disabled">{{ spec.value }}</van-radio>
                </template>
            </van-radio-group>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, reactive, onMounted, computed } from 'vue'
import { createCategoryList } from '@/services/api/product'
import { createAttributeList } from '@/services/api/common'

const props = defineProps<{
    skus: Product.ProductSkuItem[]
    categoryId: number
}>()

const sales = shallowRef<Product.CategorySale[]>([])
const attributeMap = shallowRef(new Map<number, Attribute.AttributeItem>())
const quantity = shallowRef(1)

const selectedOptions = reactive<Record<number, number>>({})

const selectedSku = computed(() => {
    const entries = Object.entries(selectedOptions)
    if (entries.length < saleGroups.value.length) return undefined
    return props.skus.find((sku) =>
        entries.every(([attributeId, valueId]) =>
            sku.specs.some((a) => a.attributeId === Number(attributeId) && a.valueId === valueId)
        )
    )
})

// 销售选项组
const saleGroups = computed(() => sales.value.flatMap((sale) => {
    const attribute = attributeMap.value.get(sale.attributeId)
    if (!attribute) return []

    const specs = attribute.values.map((attr) => ({
        ...attr,
        disabled: !props.skus.some((sku) =>
            sku.stock > 0 && sku.specs.some((a) => a.attributeId === sale.attributeId && a.valueId === attr.id)
        )
    }))

    return [{
        sale,
        attribute,
        specs
    }]
}).filter(({ specs }) => specs.length > 0))

const { rawFetch: getCategoryList } = createCategoryList({
    manual: true
})

const { rawFetch: getAttributeList } = createAttributeList({
    manual: true
})

onMounted(() => {
    Promise.all([
        getCategoryList({ categoryId: props.categoryId }),
        getAttributeList()
    ]).then(([categoryRes, attrRes]) => {
        sales.value = categoryRes.data[0]?.sales ?? []
        attributeMap.value = new Map(attrRes.data.map((a) => [a.id, a]))
    })
})
</script>