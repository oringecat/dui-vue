<template>
    <app-dialog :show="show" :loading="loading">
        <div>
            <el-input v-model="filterText" placeholder="关键字" @input="onFilter">
                <template #prefix>
                    <app-icon icon="Search" />
                </template>
            </el-input>
            <el-tree ref="treeRef" :data="detail?.children" :props="{ label: 'roleName' }" node-key="id"
                :filter-node-method="filterNode" default-expand-all />
        </div>
    </app-dialog>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import type { FilterNodeMethodFunction, TreeInstance } from 'element-plus'
import { createAdminRoleDetail } from '@/services/api/user'
import AppDialog from '@pc/components/ui/dialog/index.vue'

const props = defineProps<{
    record?: User.AdminRoleItem
}>()

const treeRef = shallowRef<TreeInstance>()
const show = shallowRef(true)
const filterText = shallowRef('')
const detail = shallowRef<User.AdminRoleDetail>()

const { loading } = createAdminRoleDetail({
    manual: !props.record,
    onSuccess: (res) => {
        detail.value = res.data
    }
})

const onFilter = (value: string) => {
    treeRef.value?.filter(value)
}

const filterNode: FilterNodeMethodFunction = (value, data) => {
    return !value || String(data.label).includes(value)
}
</script>