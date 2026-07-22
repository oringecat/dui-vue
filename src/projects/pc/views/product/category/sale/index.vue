<template>
    <app-dialog class="product-category-sale" :loading="loading">
        <app-table :data="saleAttrList" :columns="tableColumns">
            <template #toolbar>
                <el-button type="primary">新增属性</el-button>
            </template>
            <template #spec="{ row }">
                <ul class="product-category-sale__spec">
                    <li>
                        <el-input placeholder="请输入" />
                        <el-button type="primary" size="small">新增</el-button>
                    </li>
                    <li v-for="item in saleSpecMap.get(row.id)" :key="item.id">
                        <el-input v-model="item.specName" disabled />
                        <el-button type="primary" size="small" plain>编辑</el-button>
                        <el-button type="danger" size="small" plain>删除</el-button>
                    </li>
                </ul>
            </template>
        </app-table>
    </app-dialog>
</template>

<script lang="ts" setup>
import { shallowRef, computed } from 'vue'
import { createCategorySaleAttrList, createCategorySaleSpecList } from '@/services/api/product'
import { useTableColumns } from '@pc/components/ui/column-setting'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppTable from '@pc/components/ui/table/index.vue'

const props = defineProps<{
    selectedRow: Product.CategoryItem
}>()

const saleAttrList = shallowRef<Product.CategorySaleAttrItem[]>([])
const saleSpecMap = shallowRef(new Map<number, Product.CategorySaleSpecItem[]>())

const loading = computed(() => specLoading.value || saleLoading.value)

const { loading: specLoading } = createCategorySaleSpecList({
    data: {
        categoryId: props.selectedRow.id
    },
    onSuccess: (res) => {
        saleSpecMap.value = res.data.reduce((map, item) => {
            const list = map.get(item.saleId) || []
            list.push(item)
            map.set(item.saleId, list)
            return map
        }, new Map())
    },
    immediate: true
})

const { loading: saleLoading } = createCategorySaleAttrList({
    data: {
        categoryId: props.selectedRow.id
    },
    onSuccess: (res) => {
        saleAttrList.value = res.data
    },
    immediate: true
})

const { tableColumns } = useTableColumns<Product.CategorySaleAttrItem>([
    { field: 'id', label: 'ID' },
    { field: 'saleName', label: '销售属性' },
    { field: 'spec', label: '规格', width: 300 },
    { field: 'isCustom', label: '自定义' },
])
</script>

<style lang="less">
@import './index.less';
</style>