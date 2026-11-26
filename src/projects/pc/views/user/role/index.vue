<template>
    <pc-view class="user-role">
        <app-table :data="dataList" :columns="tableColumns" :context-menus="contextMenus" row-key="id"
            :loading="loading" @refresh="fetch" default-expand-all>
            <template #toolbar>
                <app-action :actions="getActions('user-role-add')" />
            </template>
            <template #roleName="{ row }">
                <div class="user-role__name">
                    <span>{{ row.roleName }}</span>
                    <app-icon class="user-role__add" icon="CirclePlusFilled"
                        @click="openComponent('user-role-add', row)" v-if="hasAction('user-role-add')" />
                </div>
            </template>
            <template #action="{ row, index }">
                <app-action type="link" :actions="getRestActions(row, index)" />
            </template>
        </app-table>
        <component :is="actionComponent" v-if="actionComponent" />
    </pc-view>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { getEnableStatusLabel } from '@/constants/status'
import { createUserRoleList } from '@/services/api/user'
import { useDataTable } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import type { TableColumn } from '@pc/components/ui/column-setting'
import dayjs from 'dayjs'
import AppTable from '@pc/components/ui/table/index.vue'
import AppAction from '@pc/components/ui/action/index.vue'
import AppIcon from '@pc/components/ui/icon/index.vue'

const { actionComponent, contextMenus, hasAction, getActions, getRestActions, openComponent } = useAuthComponents<User.UserRoleItem>({
    rowActions: {
        'user-role-status': {
            title: (row) => getEnableStatusLabel(Number(!row.status)),
            onClick: (row) => updateStatus(row.id, Number(!row.status))
        }
    }
})

const { dataList, updateItems } = useDataTable<User.UserRoleItem>()

const { loading, fetch } = createUserRoleList({
    onSuccess: (res) => {
        updateItems(res.data, res.total)
    }
})

// 更新状态
const updateStatus = (id: number, value: unknown) => {
    ElMessageBox.confirm(`是否${getEnableStatusLabel(value)}该角色`, '提示').then(() => {
        console.log('updateStatus', id)
    })
}

const tableColumns: TableColumn<User.UserRoleItem>[] = [
    { field: 'roleName', label: '角色名称' },
    { field: 'status', label: '角色状态', formatValue: (row) => getEnableStatusLabel(row.status) },
    { field: 'updateTime', label: '更新', formatValue: (row) => dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') },
    { field: 'action', label: '操作', fixed: 'right', width: 180 }
]
</script>

<style lang="less">
@import './index.less';
</style>