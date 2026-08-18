<template>
    <app-dialog class="product-category-sale" :show="show">
        <app-table :data="saleRows" :columns="tableColumns">
            <template #toolbar>
                <el-select v-model="selectedAttributeId" filterable clearable placeholder="请选择">
                    <el-option-group v-for="group in attrGroups" :key="group.name" :label="group.name">
                        <el-option v-for="option in group.items" :key="option.id" :value="option.id"
                            :label="option.name" />
                    </el-option-group>
                </el-select>
                <el-button type="primary" :disabled="!selectedAttributeId" @click="addSale">新增属性</el-button>
            </template>
            <template #attributeName="{ row }">
                {{ row.attribute?.name ?? row.attributeId }}
            </template>
            <template #attributeValue="{ row }">
                <el-tag v-for="item in row.attribute?.values ?? []" :key="item.id">
                    {{ item.value }}
                </el-tag>
            </template>
            <template #isCustom="{ row, index }">
                <el-switch :model-value="row.isCustom" @update:model-value="(val) => toggleCustom(index, !!val)" />
            </template>
            <template #action="{ index }">
                <el-button type="danger" size="small" plain @click="removeSale(index)">删除</el-button>
            </template>
        </app-table>
        <template #footer>
            <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
        </template>
    </app-dialog>
</template>

<script lang="ts" setup>
import { shallowRef, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { createCategorySaleUpdate } from '@/services/api/product'
import { useTableColumns } from '@pc/components/ui/column-setting'
import { useAttributeStore } from '@/stores/attribute'
import type { SaleRow } from './types'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppTable from '@pc/components/ui/table/index.vue'

const props = defineProps<{
    record: Product.CategoryItem
}>()

const attributeStore = useAttributeStore()

const show = shallowRef(true)
const selectedAttributeId = shallowRef<number>()

const formData = reactive(props.record.sales.map((sale) => ({ ...sale })))

const { tableColumns } = useTableColumns<SaleRow>([
    { field: 'id', label: 'ID' },
    { field: 'attributeName', label: '属性' },
    { field: 'attributeValue', label: '规格', width: 300 },
    { field: 'isCustom', label: '自定义' },
    { field: 'action', label: '操作', fixed: 'right' }
])

const { loading, rawFetch: updateSales } = createCategorySaleUpdate({
    manual: true
})

const saleRows = computed<SaleRow[]>(() => formData.map((sale) => ({
    ...sale,
    attribute: attributeStore.getAttributeById(sale.attributeId)
})))

const attrGroups = computed(() => {
    const usedIds = new Set(formData.map((sale) => sale.attributeId))

    return attributeStore.attributeGroups.map(({ name, attrs }) => ({
        name,
        items: attrs.filter((item) => !usedIds.has(item.id))
    })).filter(({ items }) => items.length > 0)
})

// 添加销售属性
const addSale = () => {
    if (selectedAttributeId.value) {
        formData.push({
            id: 0,
            attributeId: selectedAttributeId.value,
            isCustom: false
        })
        selectedAttributeId.value = undefined
    }
}

const removeSale = (index: number) => {
    formData.splice(index, 1)
}

const toggleCustom = (index: number, val: boolean) => {
    formData[index]!.isCustom = val
}

const onSubmit = async () => {
    try {
        await updateSales(formData)
        ElMessage.success('保存成功')
        show.value = false
    } catch (err) {
        ElMessage.error(String(err))
    }
}
</script>

<style lang="less">
@import './index.less';
</style>