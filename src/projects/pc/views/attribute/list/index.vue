<template>
    <pc-view>
        <template #header>
            <app-filter :options="filterOptions" @submit="loadData(LoadMode.Reset)" />
        </template>
        <app-table :data="dataList" :columns="tableColumns" v-loading="attributeStore.loading">
            <template #toolbar>
                <app-action :actions="getActions('attribute-list-add')" />
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
import { watch } from 'vue'
import { LoadMode } from '@/constants/enums'
import { useDataTable, useDataFilter } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import type { TableColumn } from '@pc/components/ui/column-setting'
import { useAttributeStore } from '@/stores/attribute'
import dayjs from 'dayjs'
import AppTable from '@pc/components/ui/table/index.vue'
import AppFilter from '@pc/components/ui/form-filter/index.vue'
import AppPagination from '@pc/components/ui/pagination/index.vue'
import AppAction from '@pc/components/ui/action/index.vue'

const attributeStore = useAttributeStore()

const { actionComponent, getActions, getRowActions } = useAuthComponents<Attribute.AttributeItem>()

const { dataList, pageIndex, pageSize, pageTotal, hasData, localFilterParams, updateItems } = useDataTable<Attribute.AttributeItem>()

const tableColumns: TableColumn<Attribute.AttributeItem>[] = [
    { field: 'id', label: 'ID' },
    { field: 'name', label: '名称' },
    { field: 'updateTime', label: '更新时间', formatValue: (row) => dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') },
    { field: 'action', label: '操作', fixed: 'right' }
]

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

const loadData = (mode = LoadMode.Cache) => {
    if (mode === LoadMode.Cache && hasData.value) return
    if (mode === LoadMode.Reset) pageIndex.value = 1
    localFilterParams.value = queryParams.value
}

watch(() => attributeStore.attributes, (items) => { updateItems(items) }, {
    immediate: true
})
</script>