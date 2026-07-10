<template>
    <pc-view class="order-list">
        <el-tabs v-if="viewComponents.length">
            <template v-for="{ code, title, component } in viewComponents" :key="code">
                <el-tab-pane :label="title" :name="code">
                    <component :is="defineAsyncComponent(component)" :auth-code="code" v-if="component" />
                </el-tab-pane>
            </template>
        </el-tabs>
        <app-filter :options="filterOptions" :rules="filterRules" @submit="onSearch">
            <template #startTime-endTime="{ item }">
                <el-form-item :label="item.label" prop="date">
                    <el-date-picker type="daterange" v-model="dateValue" value-format="YYYY-MM-DD"
                        start-placeholder="开始日期" end-placeholder="结束日期" />
                </el-form-item>
            </template>
        </app-filter>
        <app-table :data="dataList" :columns="tableColumns" :context-menus="contextMenus" v-loading="loading"
            style="height: 400px; overflow: hidden;">
            <template #toolbar>
                <app-column-setting :columns="rawColumns" v-model:hidden-keys="hiddenKeys" />
            </template>
            <template #orderTime="{ value }">
                {{ dayjs(value).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #action="{ row, index }">
                <el-button v-for="action in getRowActions(row, index)" :key="action.code" type="primary"
                    :disabled="action.disabled" @click="action.onClick">
                    {{ action.title }}
                </el-button>
            </template>
        </app-table>
        <app-pagination :total="pageTotal" v-model:page-size="pageSize" v-model:current-page="pageIndex"
            @change="loadData" />
        <component :is="currentComponent" v-if="currentComponent" />
    </pc-view>
</template>

<script lang="ts" setup>
import { shallowRef, defineAsyncComponent } from 'vue'
import { type FormRules } from 'element-plus'
import { getOrderList } from '@/services/api/order'
import { useDataTable, useDataFilter } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import dayjs from 'dayjs'
import AppColumnSetting, { useTableColumns } from '@pc/components/base/column-setting'
import AppTable from '@pc/components/base/table-v2/index.vue'
import AppFilter from '@pc/components/base/form-filter/index.vue'
import AppPagination from '@pc/components/base/pagination/index.vue'

const dateValue = shallowRef<string[]>()

// 表单验证规则
const filterRules: FormRules = {
    date: [{
        required: true,
        validator: () => dateValue.value?.length === 2
    }]
}

const { currentComponent, viewComponents, contextMenus, getRowActions } = useAuthComponents()

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

const { rawColumns, tableColumns, hiddenKeys } = useTableColumns<Order.OrderItem>([
    { field: 'id', label: 'ID' },
    { field: 'orderNumber', label: '订单号' },
    { field: 'status', label: '状态' },
    { field: 'orderTime', label: '订单日期', formatValue: (row) => row.orderTime },
    { field: 'action', label: '操作' }
])

const { filterOptions, queryParams } = useDataFilter<Order.OrderParams>({
    filters: [
        {
            field: 'orderNumber',
            label: '订单号'
        },
        {
            field: 'status',
            label: '状态',
            options: () => [
                { label: '待付款', value: 1 },
                { label: '待发货', value: 2 },
                { label: '待收货', value: 3 },
                { label: '已完成', value: 4 }
            ]
        },
        {
            field: ['startTime', 'endTime'],
            label: '日期',
            visibility: (qs) => qs.status === 4
        },
    ],
    buttons: [
        { label: '查询', resolveParams: (qs) => buildQueryParams(qs) },
        { label: '重置', resolveParams: (qs) => buildQueryParams(qs), reset: true }
    ]
})

const buildQueryParams = (qs: Partial<Order.OrderParams>) => {
    if (qs.status === 4) {
        const [startTime, endTime] = dateValue.value || []
        qs.startTime = startTime
        qs.endTime = endTime
    } else {
        dateValue.value = []
    }
    return qs
}

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