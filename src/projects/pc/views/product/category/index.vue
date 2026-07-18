<template>
    <pc-view class="product-category">
        <app-filter :options="filterOptions" @submit="loadData" />
        <app-table :data="categoryList" :columns="tableColumns" row-key="id" default-expand-all v-loading="loading">
            <template #toolbar>
                <app-action :actions="getActions('product-category-add')" />
            </template>
            <template #attribute="{ row }">
                <template v-for="item in getActions('product-category-attr', row)" :key="item.code">
                    <el-button @click="item.onClick" link>管理</el-button>
                </template>
            </template>
            <template #sale="{ row }">
                <template v-for="item in getActions('product-category-sale', row)" :key="item.code">
                    <el-button @click="item.onClick" link>管理</el-button>
                </template>
            </template>
            <template #action="{ row, index }">
                <app-action :actions="getRowActions(row, index)" :button-props="{ type: 'primary', size: 'small' }" />
            </template>
        </app-table>
        <component :is="actionComponent" v-if="actionComponent" />
    </pc-view>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import { buildTree } from '@/helpers/filters'
import { createCategoryList } from '@/services/api/product'
import { useDataFilter } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import { useTableColumns } from '@pc/components/ui/column-setting'
import AppTable from '@pc/components/ui/table/index.vue'
import AppFilter from '@pc/components/ui/form-filter/index.vue'
import AppAction from '@pc/components/ui/action/index.vue'

const categoryList = shallowRef<Product.CategoryItem[]>([])

const { actionComponent, hasAction, getActions, getRowActions } = useAuthComponents<Product.CategoryItem>({
    onClosed: () => loadData()
})

const { loading, fetch } = createCategoryList({
    onSuccess: (res) => {
        categoryList.value = buildTree(res.data, 'id', 'parentId', (node) => node.parentId === 0)
    },
    immediate: true
})

const { tableColumns } = useTableColumns<Product.CategoryItem>([
    { field: 'id', label: 'ID' },
    { field: 'categoryName', label: '分类名称' },
    { field: 'attribute', label: '基础属性', visibility: () => hasAction('product-category-attr') },
    { field: 'sale', label: '销售属性', visibility: () => hasAction('product-category-sale') },
    { field: 'status', label: '状态' },
    { field: 'action', label: '操作', fixed: 'right' }
])

const { filterOptions, queryParams } = useDataFilter<Product.CategoryListParams>({
    filters: [
        {
            field: 'categoryName',
            label: '名称'
        },
        {
            field: 'status',
            label: '状态',
            options: () => []
        }
    ],
    buttons: [
        { label: '查询' },
        { label: '重置', reset: true }
    ]
})

const loadData = () => {
    fetch(queryParams.value)
}
</script>