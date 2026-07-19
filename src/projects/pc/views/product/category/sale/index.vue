<template>
    <app-dialog :loading="loading">
        <app-table :data="saleAttrList" :columns="tableColumns">
            <template #spec="{ row }">
                {{ saleSpecMap.get(row.id) }}
            </template>
            <template #toolbar>
                <el-button type="primary">新增</el-button>
            </template>
        </app-table>
    </app-dialog>
</template>

<script lang="ts" setup>
import { shallowRef, shallowReactive } from 'vue'
import { createCategorySaleAttrList, createCategorySaleSpecList } from '@/services/api/product'
import { useTableColumns } from '@pc/components/ui/column-setting'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppTable from '@pc/components/ui/table/index.vue'

const props = defineProps<{
    selectedRow: Product.CategoryItem
}>()

const saleAttrList = shallowRef<Product.CategorySaleAttrItem[]>([])
const saleSpecMap = shallowReactive(new Map<number, Product.CategorySaleSpecItem[]>())

const { rawFetch: getCategorySaleSpecList } = createCategorySaleSpecList()

const { loading } = createCategorySaleAttrList({
    data: {
        categoryId: props.selectedRow.id
    },
    onSuccess: (res) => {
        saleAttrList.value = res.data

        res.data.forEach(({ id }) => {
            getCategorySaleSpecList({
                saleId: id
            }).then((res) => {
                saleSpecMap.set(id, res.data)
            })
        })
    },
    immediate: true
})

const { tableColumns } = useTableColumns<Product.CategorySaleAttrItem>([
    { field: 'id', label: 'ID' },
    { field: 'saleName', label: '销售名' },
    { field: 'spec', label: '规格' },
    { field: 'isCustom', label: '自定义' },
])
</script>