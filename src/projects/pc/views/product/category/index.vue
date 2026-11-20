<template>
    <pc-view>
        <template #header>
            <app-filter :options="filterOptions" @submit="loadData" />
        </template>
        <app-table :data="categoryList" :columns="tableColumns" row-key="id" :loading="loading" default-expand-all>
            <template #toolbar>
                <app-action :actions="getActions('product-category-add')" />
            </template>
            <template #attrs="{ row }">
                <el-button link @click="openComponent('product-category-attr', row)">管理</el-button>
            </template>
            <template #sales="{ row }">
                <el-button link @click="openComponent('product-category-sale', row)">管理</el-button>
            </template>
            <template #action="{ row, index }">
                <app-action type="link" :actions="getRestActions(row, index)" />
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
import type { TableColumn } from '@pc/components/ui/column-setting'
import AppTable from '@pc/components/ui/table/index.vue'
import AppFilter from '@pc/components/ui/form-filter/index.vue'
import AppAction from '@pc/components/ui/action/index.vue'

const categoryList = shallowRef<Product.CategoryItem[]>([])

const { actionComponent, getActions, getRestActions, openComponent } = useAuthComponents<Product.CategoryItem>({
    customComponents: {
        'product-category-attr': () => import('./attribute/index.vue'),
        'product-category-sale': () => import('./sale/index.vue')
    },
    onClosed: () => loadData()
})

const { loading, fetch } = createCategoryList({
    onSuccess: (res) => {
        categoryList.value = buildTree(res.data, 'id', 'parentId', (node) => node.parentId === 0)
    }
})

const tableColumns: TableColumn<Product.CategoryItem>[] = [
    { field: 'categoryName', label: '分类名称' },
    { field: 'code', label: '编码' },
    { field: 'attrs', label: '基础属性' },
    { field: 'sales', label: '销售属性' },
    { field: 'status', label: '状态' },
    { field: 'action', label: '操作', fixed: 'right' }
]

const { filterOptions, queryParams } = useDataFilter<Product.CategoryListRequest>({
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