<template>
    <pc-view class="product-list">
        <app-filter :options="filterOptions" @submit="loadData(true)" />
        <app-table :data="dataList" :columns="tableColumns" :context-menus="contextMenus" v-loading="loading">
            <template #toolbar>
                <app-action :actions="getActions('product-list-add')" />
                <app-column-setting :columns="rawColumns" v-model:hidden-keys="hiddenKeys" />
            </template>
            <template #action="{ row, index }">
                <app-action :actions="getRowActions(row, index)" :button-props="{ type: 'primary', size: 'small' }" />
            </template>
        </app-table>
        <app-pagination :total="pageTotal" v-model:page-size="pageSize" v-model:current-page="pageIndex"
            @change="loadData" />
        <component :is="actionComponent" v-if="actionComponent" />
    </pc-view>
</template>

<script lang="ts" setup>
import { createProductList } from '@/services/api/product'
import { useDataTable, useDataFilter } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import AppColumnSetting, { useTableColumns } from '@pc/components/ui/column-setting'
import AppTable from '@pc/components/ui/table/index.vue'
import AppFilter from '@pc/components/ui/form-filter/index.vue'
import AppPagination from '@pc/components/ui/pagination/index.vue'
import AppAction from '@pc/components/ui/action/index.vue'

const { actionComponent, contextMenus, getActions, getRowActions } = useAuthComponents<Product.ProductListItem>({
    rowActions: {
        'product-list-shelve': { visibility: (row) => row.status === 2 },
        'product-list-unshelve': { visibility: (row) => row.status === 1 },
        'product-list-delete': { disabled: (row) => row.status === 1 }
    }
})

const { dataList, pageIndex, pageSize, pageTotal, hasData, updateItems } = useDataTable<Product.ProductListItem>()

const { loading, fetch } = createProductList({
    data: {
        pageSize: pageSize.value,
        pageIndex: pageIndex.value
    },
    onSuccess: (res) => {
        updateItems(res.data, res.total)
    },
    immediate: true
})

const { rawColumns, tableColumns, hiddenKeys } = useTableColumns<Product.ProductListItem>([
    { field: 'id', label: 'ID' },
    { field: 'productName', label: '商品名称' },
    { field: 'action', label: '操作', fixed: 'right' }
])

const { filterOptions, queryParams } = useDataFilter<Product.ProductListParams>({
    filters: [
        {
            field: 'productName',
            label: '商品'
        },
        {
            field: 'categoryId',
            label: '类目'
        },
        {
            field: 'status',
            label: '状态',
            options: () => [
                { label: '已上架', value: 1 },
                { label: '已下架', value: 2 }
            ]
        }
    ],
    buttons: [
        { label: '查询' },
        { label: '重置', reset: true }
    ]
})

const loadData = (force = false) => {
    if (!force && hasData.value) return

    if (force) pageIndex.value = 1

    fetch({
        pageIndex: pageIndex.value,
        pageSize: pageSize.value,
        ...queryParams.value
    })
}
</script>