<template>
    <app-dialog class="attribute-edit-group" :show="show">
        <app-table :data="attributeStore.groups" :columns="tableColumns" v-loading="attributeStore.loading">
            <template #name="{ row }">
                <el-input v-model="row.name" placeholder="请输入" />
            </template>
            <template #code="{ row }">
                <el-input v-model="row.code" placeholder="请输入" />
            </template>
            <template #action>
                <el-button type="primary" size="small">编辑</el-button>
                <el-button type="danger" size="small">删除</el-button>
            </template>
        </app-table>
    </app-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useTableColumns } from '@pc/components/ui/column-setting'
import { useAttributeStore } from '@/stores/attribute'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppTable from '@pc/components/ui/table/index.vue'

const attributeStore = useAttributeStore()

const show = ref(true)

const { tableColumns } = useTableColumns<Attribute.AttributeGroup>([
    { field: 'id', label: 'ID' },
    { field: 'name', label: '名称' },
    { field: 'code', label: '代码' },
    { field: 'action', label: '操作', fixed: 'right' }
])
</script>