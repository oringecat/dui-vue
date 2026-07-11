<template>
    <pc-view>
        <app-table :data="dataList" :columns="tableColumns" :context-menus="contextMenus" v-loading="loading"
            style="height: 400px; overflow: hidden;">
            <template #orderTime="{ value }">
                {{ dayjs(value).format('YYYY-MM-DD HH:mm:ss') }}
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
import { getOrderList } from '@/services/api/order'
import { useDataTable } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import { useTableColumns } from '@pc/components/ui/column-setting'
import dayjs from 'dayjs'
import AppTable from '@pc/components/ui/table-v2/index.vue'
import AppPagination from '@pc/components/ui/pagination/index.vue'
import AppAction from '@pc/components/ui/action/index.vue'

const props = defineProps<{
    componentId: string
    queryParams: Partial<Order.OrderParams>
}>()

const { currentComponent, contextMenus, hasRowAction, getRowActions } = useAuthComponents({
    authCode: props.componentId
})

const { dataList, pageIndex, pageSize, pageTotal, hasData, updateItems } = useDataTable<Order.OrderItem>()

const { loading, fetch } = getOrderList({
    data: {
        pageSize: pageSize.value,
        pageIndex: pageIndex.value
    },
    onSuccess: (res) => {
        updateItems(res.data, res.total)
    }
})

const { tableColumns } = useTableColumns<Order.OrderItem>([
    { field: 'id', label: 'ID' },
    { field: 'orderNumber', label: '订单号' },
    { field: 'status', label: '状态' },
    { field: 'orderTime', label: '订单日期', formatValue: (row) => row.orderTime },
    { field: 'action', label: '操作', fixed: 'right', visibility: () => hasRowAction.value }
])

const loadData = (force = false) => {
    if (!force && hasData.value) return

    if (force) pageIndex.value = 1

    fetch({
        pageIndex: pageIndex.value,
        pageSize: pageSize.value,
        ...props.queryParams
    })
}

defineExpose({
    query: () => loadData(true)
})
</script>