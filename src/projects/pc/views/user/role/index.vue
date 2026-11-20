<template>
    <pc-view>
        <app-table :data="dataList" :columns="tableColumns" :context-menus="contextMenus" :loading="loading"
            @refresh="fetch">
            <template #toolbar>
                <app-action :actions="getActions('user-role-add')" />
            </template>
            <template #children="{ row }">
                <template v-for="item in getActions('user-role-children', row)" :key="item.code">
                    <el-button @click="item.onClick" link>管理</el-button>
                </template>
            </template>
            <template #action="{ row, index }">
                <app-action type="link" :actions="getRestActions(row, index)" />
            </template>
        </app-table>
        <component :is="actionComponent" v-if="actionComponent" />
    </pc-view>
</template>

<script lang="ts" setup>
import { createAdminRoleList } from '@/services/api/user'
import { useDataTable } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import type { TableColumn } from '@pc/components/ui/column-setting'
import dayjs from 'dayjs'
import AppTable from '@pc/components/ui/table/index.vue'
import AppAction from '@pc/components/ui/action/index.vue'

const { actionComponent, contextMenus, hasAction, getActions, getRestActions } = useAuthComponents<User.AdminRoleItem>()

const { dataList, updateItems } = useDataTable<User.AdminRoleItem>()

const { loading, fetch } = createAdminRoleList({
    onSuccess: (res) => {
        updateItems(res.data, res.total)
    }
})

const tableColumns: TableColumn<User.AdminRoleItem>[] = [
    { field: 'id', label: 'ID' },
    { field: 'roleName', label: '角色名称' },
    { field: 'children', label: '下级角色', visibility: () => hasAction('user-role-children') },
    { field: 'status', label: '状态' },
    { field: 'updateTime', label: '更新', formatValue: (row) => dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') },
    { field: 'action', label: '操作', fixed: 'right', width: 180 }
]
</script>