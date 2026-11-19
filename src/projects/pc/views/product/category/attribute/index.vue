<template>
    <app-dialog class="product-category-attr" title="基础属性" :show="show">
        <div class="product-category-attr__container">
            <div class="product-category-attr__aside">
                <app-attribute-picker node-key="key" :data="treeData" v-model:checked-nodes="checkedNodes"
                    :default-checked-keys="checkedKeys" />
            </div>
            <div class="product-category-attr__actions">
                <el-button icon="ArrowRight" size="small" :disabled="checkedNodes.length < 1"
                    @click="moveRight"></el-button>
                <el-button icon="ArrowLeft" size="small" :disabled="selectedRows.length < 1"
                    @click="moveLeft"></el-button>
            </div>
            <div class="product-category-attr__main">
                <app-table :data="formData" :columns="tableColumns" row-key="attributeId" :show-tools="false"
                    height="auto" selection-type="multiple" @selection-change="onSelectionChange">
                    <template #attributeName="{ row }">
                        {{ attributeStore.getAttributeById(row.attributeId)?.name ?? row.attributeId }}
                    </template>
                    <template #valueType="{ row }">
                        <el-select v-model="row.valueType">
                            <el-option v-for="option in valueTypeOptions" :key="option.value" :value="option.value"
                                :label="option.label" />
                        </el-select>
                    </template>
                    <template #required="{ row }">
                        <el-switch size="small" v-model="row.required" />
                    </template>
                    <template #action="{ index }">
                        <el-button type="primary" icon="Top" link v-if="index > 0"
                            @click="moveRow(index, index - 1)"></el-button>
                        <el-button type="primary" icon="Bottom" link v-if="index < formData.length - 1"
                            @click="moveRow(index, index + 1)"></el-button>
                    </template>
                </app-table>
            </div>
        </div>
        <template #footer>
            <el-button type="primary" @click="onSubmit">保存</el-button>
        </template>
    </app-dialog>
</template>

<script lang="ts" setup>
import { shallowRef, computed, reactive } from 'vue'
import type { TreeNodeData } from 'element-plus'
import { ValueType, valueTypeOptions } from '@/constants/enums'
import type { TableColumn } from '@pc/components/ui/column-setting'
import { useAttributeStore } from '@/stores/attribute'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppTable from '@pc/components/ui/table/index.vue'
import AppAttributePicker from '@pc/components/ui/attribute-picker/index.vue'

const props = defineProps<{
    record: Product.CategoryItem
}>()

const attributeStore = useAttributeStore()

const show = shallowRef(true)
const selectedRows = shallowRef<Product.CategoryAttr[]>([])
const checkedNodes = shallowRef<TreeNodeData[]>([])

const formData = reactive(props.record.attrs.map((attr) => ({ ...attr })))

const tableColumns: TableColumn<Product.CategoryAttr>[] = [
    { field: 'attributeName', label: '属性', width: 100 },
    { field: 'valueType', label: '填写方式', width: 200 },
    { field: 'required', label: '必填项' },
    { field: 'action', label: '操作' }
]

const checkedKeys = computed(() => formData.map((row) => `a-${row.attributeId}`))

const treeData = computed(() => {
    const usedIds = new Set(formData.map((row) => row.attributeId))

    return attributeStore.attributeGroups.map(({ id, name, attrs }) => ({
        key: `g-${id}`,
        label: name,
        disabled: attrs.length > 0 && attrs.every((item) => usedIds.has(item.id)),
        children: attrs.map((item) => ({
            key: `a-${item.id}`,
            label: item.name,
            attributeId: item.id,
            disabled: usedIds.has(item.id)
        }))
    }))
})

const onSelectionChange = (rows: Product.CategoryAttr[]) => {
    selectedRows.value = rows
}

// 追加数据到表格中
const moveRight = () => {
    const usedIds = new Set(formData.map((row) => row.attributeId))

    checkedNodes.value.forEach((node) => {
        const attributeId = Number(node.attributeId)

        if (attributeId && !usedIds.has(attributeId)) {
            usedIds.add(attributeId)
            formData.push({
                id: 0,
                attributeId,
                valueType: ValueType.Text,
                required: false,
                sort: 0
            })
        }
    })

    checkedNodes.value = []
}

// 移除表格数据
const moveLeft = () => {
    const ids = new Set(selectedRows.value.map((row) => row.attributeId))
    const items = formData.filter((row) => !ids.has(row.attributeId))

    formData.splice(0, formData.length, ...items)
    selectedRows.value = []
}

// 移动排序
const moveRow = (from: number, to: number) => {
    const row = formData[from]
    const target = formData[to]

    if (row && target) {
        [row.sort, target.sort] = [target.sort, row.sort] // 交换顺序

        formData.splice(from, 1)
        formData.splice(to, 0, row)
    }
}

const onSubmit = () => {
    show.value = false
}
</script>

<style lang="less">
@import './index.less';
</style>