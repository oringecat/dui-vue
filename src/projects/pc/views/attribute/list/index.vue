<template>
    <pc-view class="attribute-list">
        <app-filter :options="filterOptions" @submit="loadData(true)" />
        <app-table :data="dataList" :columns="tableColumns" :context-menus="contextMenus"
            v-loading="attributeStore.loading">
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
import { watch } from 'vue'
import { useDataTable, useDataFilter } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import { useTableColumns } from '@pc/components/ui/column-setting'
import { useAttributeStore } from '@/stores/attribute'
import dayjs from 'dayjs'
import AppTable from '@pc/components/ui/table/index.vue'
import AppFilter from '@pc/components/ui/form-filter/index.vue'
import AppPagination from '@pc/components/ui/pagination/index.vue'
import AppAction from '@pc/components/ui/action/index.vue'

const attributeStore = useAttributeStore()

const { actionComponent, contextMenus, getActions, getRowActions } = useAuthComponents<Attribute.AttributeItem>()

const { dataList, pageIndex, pageSize, pageTotal, hasData, localFilterParams, updateItems } = useDataTable<Attribute.AttributeItem>()

const { tableColumns } = useTableColumns<Attribute.AttributeItem>([
    { field: 'id', label: 'ID' },
    { field: 'name', label: '名称' },
    { field: 'updateTime', label: '更新时间', formatValue: (row) => dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') },
    { field: 'action', label: '操作', fixed: 'right' }
])

const { filterOptions, queryParams } = useDataFilter<Attribute.AttributeItem>({
    filters: [
        {
            field: 'groupId',
            label: '分组',
            options: () => attributeStore.groups.map((item) => ({
                label: item.name,
                value: item.id
            }))
        },
        {
            field: 'name',
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
    localFilterParams.value = queryParams.value
}

watch(() => attributeStore.attributes, (items) => { updateItems(items) }, {
    immediate: true
})
</script>