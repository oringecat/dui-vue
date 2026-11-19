<template>
    <pc-view class="dui-attribute-picker">
        <template #header>
            <el-input v-model="filterText" placeholder="关键字" @input="onFilter">
                <template #prefix>
                    <app-icon icon="Search" />
                </template>
            </el-input>
        </template>
        <el-scrollbar>
            <el-tree ref="treeRef" v-bind="$attrs" empty-text="暂无属性模板"
                :filter-node-method="filterNode" default-expand-all show-checkbox @check="onCheck" />
        </el-scrollbar>
    </pc-view>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import type { FilterNodeMethodFunction, TreeInstance, TreeNodeData } from 'element-plus'
import AppIcon from '@pc/components/ui/icon/index.vue'

defineOptions({
    inheritAttrs: false
})

defineProps<{
    checkedNodes: TreeNodeData[]
}>()

const emit = defineEmits<{
    'update:checkedNodes': [nodes: TreeNodeData[]]
}>()

const treeRef = shallowRef<TreeInstance>()
const filterText = shallowRef('')

const filterNode: FilterNodeMethodFunction = (value, data) => {
    return !value || String(data.label).includes(value)
}

const onFilter = (value: string) => {
    treeRef.value?.filter(value)
}

const onCheck = () => {
    const nodes = treeRef.value?.getCheckedNodes(true) ?? []
    emit('update:checkedNodes', nodes.filter((node) => !node.disabled))
}
</script>

<style lang="less">
@import './index.less';
</style>