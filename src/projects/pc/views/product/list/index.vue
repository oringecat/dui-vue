<template>
    <pc-view class="product-list">
        <app-filter :options="filterOptions" @submit="onSearch" />
        <app-table :data="dataList" :columns="tableColumns" :context-menus="contextMenus" v-loading="loading"
            style="height: 400px; overflow: hidden;">
            <template #toolbar>
                <app-action :actions="getActions('product-list-add')" />
            </template>
            <template #action="{ row, index }">
                <app-action :actions="getRowActions(row, index)" type="primary" size="small" />
            </template>
        </app-table>
        <app-pagination :total="pageTotal" v-model:page-size="pageSize" v-model:current-page="pageIndex"
            @change="loadData" />
        <component :is="currentComponent" v-if="currentComponent" />
    </pc-view>
</template>

<script lang="ts" setup>
import { getProductList } from '@/services/api/product'
import { useDataTable, useDataFilter } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import { useTableColumns } from '@pc/components/ui/column-setting'
import AppTable from '@pc/components/ui/table-v2/index.vue'
import AppFilter from '@pc/components/ui/form-filter/index.vue'
import AppPagination from '@pc/components/ui/pagination/index.vue'
import AppAction from '@pc/components/ui/action/index.vue'

const { currentComponent, contextMenus, getActions, getRowActions } = useAuthComponents<Product.ProductItem>({
    actions: {
        'product-list-shelve': { visibility: (row) => row.status === 2 },
        'product-list-delete': { disabled: (row) => row.status === 1 }
    }
})

const { dataList, pageIndex, pageSize, pageTotal, hasData, updateItems } = useDataTable<Product.ProductItem>()

const { loading, fetch } = getProductList({
    data: {
        pageSize: pageSize.value,
        pageIndex: pageIndex.value
    },
    onSuccess: (res) => {
        updateItems(res.data, res.total)
    }
})

const { tableColumns } = useTableColumns<Product.ProductItem>([
    { field: 'id', label: 'ID' },
    { field: 'productName', label: '商品名称' },
    { field: 'action', label: '操作' }
])

const { filterOptions, queryParams } = useDataFilter<Product.ProductParams>({
    filters: [
        {
            field: 'categoryId',
            label: '分类'
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
    if (force || !hasData.value) {
        fetch({
            pageIndex: pageIndex.value,
            pageSize: pageSize.value,
            ...queryParams.value
        })
    }
}

const onSearch = () => {
    pageIndex.value = 1
    loadData(true)
}
</script>