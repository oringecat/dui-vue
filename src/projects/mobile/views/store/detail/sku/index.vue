<template>
    <div class="store-detail-sku">
        <div class="">
            <div v-if="selectedSku">
                <span>{{ selectedSku.code }}</span>
            </div>
            <van-stepper v-model="quantity" :min="1" :max="selectedSku?.stock ?? 1" :disabled="!selectedSku" />
        </div>
        <div class="store-detail-sku__groups">
            <section v-for="{ attribute, specs } in saleGroups" :key="attribute.id">
                <h4>{{ attribute.name }}</h4>
                <ul>
                    <template v-for="spec in specs" :key="spec.id">
                        <li :class="{ active: selectedOptions[attribute.id] === spec.id, disabled: spec.disabled }"
                            @click="selectedOptions[attribute.id] = spec.id">
                            {{ spec.value }}
                        </li>
                    </template>
                </ul>
            </section>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, reactive, computed } from 'vue'
import { useAttributeStore } from '@/stores/attribute'

const props = defineProps<{
    skus: Product.ProductSkuItem[]
}>()

const attributeStore = useAttributeStore()

const quantity = shallowRef(1)

const selectedOptions = reactive<Record<number, number>>({})

const selectedSku = computed(() => {
    const entries = Object.entries(selectedOptions)
    if (entries.length === saleGroups.value.length) {
        return props.skus.find((sku) =>
            entries.every(([attributeId, valueId]) =>
                sku.specs.some((a) => a.attributeId === Number(attributeId) && a.valueId === valueId)
            )
        )
    }
    return undefined
})

// 销售选项组
const saleGroups = computed(() => {
    const groups = new Map<number, { attribute: Attribute.AttributeItem; specs: { id: number; value: string; disabled: boolean }[] }>()

    // 分组去重
    for (const sku of props.skus) {
        for (const spec of sku.specs) {
            const attribute = attributeStore.getAttributeById(spec.attributeId)
            if (!attribute) continue

            let group = groups.get(spec.attributeId)
            if (!group) {
                group = { attribute, specs: [] }
                groups.set(spec.attributeId, group)
            }

            let item = group.specs.find((s) => s.id === spec.valueId)
            if (!item) {
                item = { id: spec.valueId, value: spec.specName, disabled: true }
                group.specs.push(item)
            }
            if (sku.stock > 0) item.disabled = false
        }
    }

    return Array.from(groups.values())
})
</script>

<style lang="less">
@import './index.less';
</style>