<template>
    <div class="g-table" v-loading="loading">
        <table cellspacing="0" cellpadding="0" v-if="categoryAttrs.length">
            <thead>
                <tr>
                    <th>名称</th>
                    <th>描述</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in categoryAttrs" :key="index">
                    <td>{{ item.attribute.name }}</td>
                    <td>
                        <el-checkbox-group :model-value="toArray(productAttrs[item.attributeId])"
                            @update:model-value="(val) => onChange(item.attributeId, val)"
                            v-if="item.attribute.multiple">
                            <el-checkbox v-for="{ id, value } in item.attribute.values" :key="id" :value="value"
                                :label="value" />
                        </el-checkbox-group>
                        <el-select :model-value="productAttrs[item.attributeId]"
                            @update:model-value="(val) => onChange(item.attributeId, val)" placeholder="选填"
                            v-else-if="item.valueType === AttributeValueType.Enum">
                            <el-option v-for="{ id, value } in item.attribute.values" :key="id" :value="value"
                                :label="value" />
                        </el-select>
                        <el-input :type="item.valueType === AttributeValueType.Number ? 'number' : 'text'"
                            :model-value="productAttrs[item.attributeId]"
                            @update:model-value="(val) => onChange(item.attributeId, val)" placeholder="选填" v-else />
                    </td>
                </tr>
            </tbody>
        </table>
        <el-button type="primary" size="small" v-else-if="!loading">新增</el-button>
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, computed, watch } from 'vue'
import type { CheckboxGroupValueType } from 'element-plus'
import { AttributeValueType } from '@/constants/enums'
import { createCategoryList } from '@/services/api/product'
import { useAttributeStore } from '@/stores/attribute'

const props = withDefaults(defineProps<{
    modelValue?: Product.ProductAttrItem[]
    categoryId: number
}>(), {
    modelValue: () => ([])
})

const emit = defineEmits<{
    'update:modelValue': [value: Product.ProductAttrItem[]]
}>()

const attributeStore = useAttributeStore()

const categoryAttrs = shallowRef<(Product.CategoryAttr & { attribute: Attribute.AttributeItem })[]>([])

const productAttrs = computed(() => props.modelValue.reduce<Record<number, string>>((map, item) => {
    map[item.attributeId] = item.attributeValue
    return map
}, {}))

const { loading, rawFetch: getCategoryList } = createCategoryList({
    manual: true
})

const toArray = (value?: string) => {
    return value ? value.split(',') : []
}

const onChange = (id: number, value: string | CheckboxGroupValueType) => {
    const attributeValue = Array.isArray(value) ? value.join(',') : value
    const filtered = props.modelValue.filter((item) => item.attributeId !== id)

    if (attributeValue) {
        const existing = props.modelValue.find((item) => item.attributeId === id)
        filtered.push({
            id: existing?.id ?? 0,
            attributeId: id,
            attributeValue
        })
    }

    emit('update:modelValue', filtered)
}

watch(() => props.categoryId, (id) => {
    categoryAttrs.value = []

    Promise.all([
        getCategoryList({ categoryId: id }),
        attributeStore.readyPromise
    ]).then(([categoryRes]) => {
        const attrs = categoryRes.data[0]?.attrs ?? []

        categoryAttrs.value = attrs.flatMap((attr) => {
            const attribute = attributeStore.getAttributeById(attr.attributeId)
            return attribute ? [{ ...attr, attribute }] : []
        })
    })
}, { immediate: true })
</script>