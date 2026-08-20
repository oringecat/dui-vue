<template>
    <app-dialog class="attribute-edit" :show="show">
        <el-form :model="formData" label-width="auto">
            <el-form-item label="属性分组">
                <el-select v-model="formData.groupId" filterable clearable placeholder="请选择">
                    <el-option v-for="option in attributeStore.attributeGroups" :key="option.id" :value="option.id"
                        :label="option.name" />
                </el-select>
                <el-button size="small" plain @click="openComponent('group')">管理</el-button>
            </el-form-item>
            <el-form-item label="属性名称">
                <el-input v-model="formData.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="是否多选">
                <el-switch v-model="formData.multiple" />
            </el-form-item>
            <el-form-item label="属性枚举">
                <div class="g-table">
                    <el-button type="primary" size="small">新增</el-button>
                    <table cellspacing="0" cellpadding="0" v-if="formData.values.length">
                        <thead>
                            <tr>
                                <th>名称</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in formData.values" :key="index">
                                <td>
                                    <el-input v-model="item.value" />
                                </td>
                                <td>
                                    <el-button type="danger" size="small">删除</el-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary">提交</el-button>
        </template>
        <component :show="showComponent" :is="components[componentId]" @closed="closeComponent" />
    </app-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent, type Component } from 'vue'
import { useComponent } from '@/composables/component'
import { useAttributeStore } from '@/stores/attribute'
import AppDialog from '@pc/components/ui/dialog/index.vue'

const props = defineProps<{
    record: Attribute.AttributeItem
}>()

const components: Record<string, Component> = {
    group: defineAsyncComponent(() => import('./group/index.vue'))
}

const { showComponent, componentId, openComponent, closeComponent } = useComponent()

const attributeStore = useAttributeStore()

const show = ref(true)

const formData = ref<Attribute.AttributeItem>({
    id: 0,
    name: '',
    groupId: 0,
    values: [],
    multiple: false,
    updateTime: 0
})

onMounted(() => {
    if (props.record) {
        formData.value = props.record
    }
})
</script>