<template>
    <app-table :data="dataList" :columns="tableColumns" :context-menus="contextMenus" :loading="loading">
        <template #action="{ row, index }">
            <app-action type="text" :actions="getRowActions(row, index)" />
        </template>
        <template #footer>
            <app-pagination :total="pageTotal" v-model:page-size="pageSize" v-model:current-page="pageIndex"
                @change="loadData" />
            <component :is="actionComponent" v-if="actionComponent" />
        </template>
    </app-table>
</template>

<script lang="ts" setup>
import { LoadMode } from '@/constants/enums'
import { createOrderList } from '@/services/api/order'
import { useDataTable } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import type { TableColumn } from '@pc/components/ui/column-setting'
import dayjs from 'dayjs'
import AppTable from '@pc/components/ui/table-v2/index.vue'
import AppPagination from '@pc/components/ui/pagination/index.vue'
import AppAction from '@pc/components/ui/action/index.vue'

const props = defineProps<{
    componentId: string
    queryParams: Partial<Order.OrderListRequest>
}>()

const { actionComponent, contextMenus, hasRowAction, getRowActions } = useAuthComponents({
    authCode: props.componentId
})

const { dataList, pageIndex, pageSize, pageTotal, hasData, updateItems } = useDataTable<Order.OrderListItem>()

const { loading, fetch } = createOrderList({
    manual: true,
    data: {
        pageSize: pageSize.value,
        pageIndex: pageIndex.value
    },
    onSuccess: (res) => {
        updateItems(res.data, res.total)
    }
})

const tableColumns: TableColumn<Order.OrderListItem>[] = [
    { field: 'id', label: 'ID' },
    { field: 'orderNumber', label: '订单号' },
    { field: 'status', label: '状态' },
    { field: 'orderTime', label: '订单日期', formatValue: (row) => dayjs(row.orderTime).format('YYYY-MM-DD HH:mm:ss') },
    { field: 'action', label: '操作', fixed: 'right', width: 160, visibility: () => hasRowAction.value }
]

const loadData = (mode = LoadMode.Cache) => {
    if (mode === LoadMode.Cache && hasData.value) return
    if (mode === LoadMode.Reset) pageIndex.value = 1

    fetch({
        pageIndex: pageIndex.value,
        pageSize: pageSize.value,
        ...props.queryParams
    })
}

defineExpose({
    query: () => loadData(LoadMode.Reset)
})
</script>