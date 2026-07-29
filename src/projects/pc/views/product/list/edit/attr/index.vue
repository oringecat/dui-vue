<template>
    <el-form-item label="商品属性">
        <div class="product-attr" v-loading="loading">
            <table cellspacing="0" cellpadding="0" v-if="categoryAttrs.length">
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>描述</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in categoryAttrs" :key="index">
                        <td>{{ item.attributeName }}</td>
                        <td>
                            <el-input :model-value="productAttrs[item.id]"
                                @update:model-value="(val) => onChange(item.id, val)" placeholder="选填" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </el-form-item>
</template>

<script lang="ts" setup>
import { shallowRef, computed, watch } from 'vue'
import { createCategoryAttrList } from '@/services/api/product'

const props = defineProps<{
    modelValue: Product.ProductAttrItem[]
    categoryId: number
}>()

const emit = defineEmits<{
    'update:modelValue': [value: Product.ProductAttrItem[]]
}>()

const categoryAttrs = shallowRef<Product.CategoryAttrItem[]>([])

const productAttrs = computed(() => props.modelValue.reduce<Record<number, string>>((map, item) => {
    map[item.attributeId] = item.attributeValue
    return map
}, {}))

const { loading, rawFetch } = createCategoryAttrList({
    manual: true
})

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

    rawFetch({ categoryId: id }).then((res) => {
        categoryAttrs.value = res.data
    })
}, { immediate: true })
</script>