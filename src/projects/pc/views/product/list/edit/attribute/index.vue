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
                    <td>{{ item.name }}</td>
                    <td>
                        <el-input :model-value="productAttrs[item.attributeId]"
                            @update:model-value="(val) => onChange(item.attributeId, val)" placeholder="选填" />
                    </td>
                </tr>
            </tbody>
        </table>
        <el-button type="primary" size="small" v-else-if="!loading">新增</el-button>
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, computed, watch } from 'vue'
import { createCategoryList } from '@/services/api/product'
import { createAttributeList } from '@/services/api/common'

const props = withDefaults(defineProps<{
    modelValue?: Product.ProductAttrItem[]
    categoryId: number
}>(), {
    modelValue: () => ([])
})

const emit = defineEmits<{
    'update:modelValue': [value: Product.ProductAttrItem[]]
}>()

const categoryAttrs = shallowRef<{ attributeId: number; name: string }[]>([])

const productAttrs = computed(() => props.modelValue.reduce<Record<number, string>>((map, item) => {
    map[item.attributeId] = item.attributeValue
    return map
}, {}))

const { loading: categoryLoading, rawFetch: getCategoryList } = createCategoryList({
    manual: true
})

const { loading: attrLoading, rawFetch: getAttributeList } = createAttributeList({
    manual: true
})

const loading = computed(() => categoryLoading.value || attrLoading.value)

const onChange = (id: number, value: string) => {
    const filtered = props.modelValue.filter((item) => item.attributeId !== id)
    if (value) {
        const existing = props.modelValue.find((item) => item.attributeId === id)
        filtered.push({
            id: existing?.id ?? 0,
            attributeId: id,
            attributeValue: value
        })
    }
    emit('update:modelValue', filtered)
}

watch(() => props.categoryId, (id) => {
    categoryAttrs.value = []

    Promise.all([
        getCategoryList({ categoryId: id }),
        getAttributeList()
    ]).then(([categoryRes, attrRes]) => {
        const attrs = categoryRes.data[0]?.attrs ?? []
        const attributeMap = new Map(attrRes.data.map((a) => [a.id, a]))

        categoryAttrs.value = attrs.flatMap((attr) => {
            const attribute = attributeMap.get(attr.attributeId)
            return attribute ? [{ attributeId: attr.attributeId, name: attribute.name }] : []
        })
    })
}, { immediate: true })
</script>