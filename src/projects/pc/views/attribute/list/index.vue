<template>
    <pc-view class="attribute-list">
        <app-filter :options="filterOptions" @submit="loadData(true)" />
        <app-table :data="dataList" :columns="tableColumns" :context-menus="contextMenus" v-loading="loading">
            <template #toolbar>
                <app-action :actions="getActions('attribute-list-add')" />
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
import { createAttributeList } from '@/services/api/common'
import { useDataTable, useDataFilter } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import { useTableColumns } from '@pc/components/ui/column-setting'
import dayjs from 'dayjs'
import AppTable from '@pc/components/ui/table/index.vue'
import AppFilter from '@pc/components/ui/form-filter/index.vue'
import AppPagination from '@pc/components/ui/pagination/index.vue'
import AppAction from '@pc/components/ui/action/index.vue'

const { actionComponent, contextMenus, getActions, getRowActions } = useAuthComponents<Attribute.AttributeItem>()

const { dataList, pageIndex, pageSize, pageTotal, hasData, updateItems } = useDataTable<Attribute.AttributeItem>()

const { loading, fetch } = createAttributeList({
    onSuccess: (res) => {
        updateItems(res.data, res.total)
    }
})

const { tableColumns } = useTableColumns<Attribute.AttributeItem>([
    { field: 'id', label: 'ID' },
    { field: 'groupName', label: '组' },
    { field: 'name', label: '名称' },
    { field: 'updateTime', label: '更新时间', formatValue: (row) => dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') },
    { field: 'action', label: '操作', fixed: 'right' }
])

const { filterOptions, queryParams } = useDataFilter<Attribute.AttributeListRequest>({
    filters: [
        {
            field: 'attributeName',
            label: '属性名'
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
    fetch(queryParams.value)
}
</script>