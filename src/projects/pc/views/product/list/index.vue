<template>
    <pc-view>
        <template #header>
            <app-filter :options="filterOptions" @submit="loadData(LoadMode.Reset)" />
        </template>
        <app-table :data="dataList" :columns="tableColumns" :context-menus="contextMenus" :loading="loading"
            @refresh="loadData(LoadMode.Current)">
            <template #toolbar>
                <app-action :actions="getActions('product-list-add')" />
            </template>
            <template #action="{ row, index }">
                <app-action type="link" :actions="getRowActions(row, index)" />
            </template>
            <template #footer>
                <app-pagination :total="pageTotal" v-model:page-size="pageSize" v-model:current-page="pageIndex"
                    @change="loadData" />
            </template>
        </app-table>
        <component :is="actionComponent" v-if="actionComponent" />
    </pc-view>
</template>

<script lang="ts" setup>
import { createProductList } from '@/services/api/product'
import { LoadMode } from '@/constants/enums'
import { useDataTable, useDataFilter } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import type { TableColumn } from '@pc/components/ui/column-setting'
import dayjs from 'dayjs'
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
    }
})

const tableColumns: TableColumn<Product.ProductListItem>[] = [
    { field: 'id', label: 'ID' },
    { field: 'title', label: '标题' },
    { field: 'status', label: '状态' },
    { field: 'createTime', label: '更新', formatValue: (row) => dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') },
    { field: 'action', label: '操作', fixed: 'right', width: 180 }
]

const { filterOptions, queryParams } = useDataFilter<Product.ProductListRequest>({
    filters: [
        {
            field: 'title',
            label: '标题'
        },
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

const loadData = (mode = LoadMode.Cache) => {
    if (mode === LoadMode.Cache && hasData.value) return
    if (mode === LoadMode.Reset) pageIndex.value = 1

    fetch({
        pageIndex: pageIndex.value,
        pageSize: pageSize.value,
        ...queryParams.value
    })
}
</script>