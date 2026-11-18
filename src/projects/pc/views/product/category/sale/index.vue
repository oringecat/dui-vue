<template>
    <app-dialog class="product-category-sale" title="销售属性" :show="show" :loading="loading">
        <div class="product-category-sale__container">
            <div class="product-category-sale__aside">
                <pc-view class="product-category-sale__aside-panel">
                    <template #header>
                        <el-input v-model="filterText" placeholder="关键字" @input="onFilter">
                            <template #prefix>
                                <app-icon icon="Search" />
                            </template>
                        </el-input>
                    </template>
                    <el-scrollbar>
                        <el-tree ref="treeRef" :data="treeData" node-key="key" empty-text="暂无属性模板"
                            :default-checked-keys="checkedKeys" :filter-node-method="filterNode" default-expand-all
                            show-checkbox />
                    </el-scrollbar>
                </pc-view>
            </div>
            <div class="product-category-sale__actions">
                <el-button icon="ArrowRight" :disabled="treeData.length < 1" @click="moveRight"></el-button>
                <el-button icon="ArrowLeft" :disabled="formData.length < 1" @click="moveLeft"></el-button>
            </div>
            <div class="product-category-sale__main">
                <app-table :data="formData" :columns="tableColumns" :show-tools="false" height="auto"
                    selection-type="multiple" @selection-change="onSelectionChange">
                    <template #attributeName="{ row }">
                        {{ attributeStore.getAttributeById(row.attributeId)?.name ?? row.attributeId }}
                    </template>
                    <template #attributeValue="{ row }">
                        <div class="g-flex">
                            <el-tag v-for="item in attributeStore.getAttributeById(row.attributeId)?.values ?? []"
                                :key="item.id" disable-transitions>
                                {{ item.value }}
                            </el-tag>
                        </div>
                    </template>
                    <template #isCustom="{ row }">
                        <el-switch size="small" v-model="row.isCustom" />
                    </template>
                    <template #isImage="{ row }">
                        <el-switch size="small" v-model="row.isImage" />
                    </template>
                    <template #action="{ index }">
                        <el-button type="primary" icon="Top" link v-if="index > 0"></el-button>
                        <el-button type="primary" icon="Bottom" link v-if="index < formData.length - 1"></el-button>
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
import { ElMessage, type FilterNodeMethodFunction, type TreeInstance } from 'element-plus'
import { createCategorySaleUpdate } from '@/services/api/product'
import type { TableColumn } from '@pc/components/ui/column-setting'
import { useAttributeStore } from '@/stores/attribute'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppTable from '@pc/components/ui/table/index.vue'
import AppIcon from '@pc/components/ui/icon/index.vue'

const props = defineProps<{
    record: Product.CategoryItem
}>()

const attributeStore = useAttributeStore()

const show = shallowRef(true)
const treeRef = shallowRef<TreeInstance>()
const filterText = shallowRef('')
const selectedRows = shallowRef<Product.CategorySale[]>([])

const formData = reactive(props.record.sales.map((sale) => ({ ...sale })))

const { loading, rawFetch: updateSales } = createCategorySaleUpdate()

const tableColumns: TableColumn<Product.CategorySale>[] = [
    { field: 'attributeName', label: '属性', width: 100 },
    { field: 'attributeValue', label: '规格', width: 240 },
    { field: 'isCustom', label: '自定义' },
    { field: 'isImage', label: '图片上传', width: 100 },
    { field: 'action', label: '操作' }
]

const checkedKeys = computed(() => formData.map((sale) => `a-${sale.attributeId}`))

const treeData = computed(() => {
    const usedIds = new Set(formData.map((sale) => sale.attributeId))

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

const filterNode: FilterNodeMethodFunction = (value, data) => {
    return !value || String(data.label).includes(value)
}

const onFilter = (value: string) => {
    treeRef.value?.filter(value)
}

const onSelectionChange = (rows: Product.CategorySale[]) => {
    selectedRows.value = rows
}

// 追加数据到表格中
const moveRight = () => {
    const usedIds = new Set(formData.map((sale) => sale.attributeId))
    const nodes = treeRef.value?.getCheckedNodes(true)

    nodes?.forEach((node) => {
        const attributeId = Number(node.attributeId)

        if (attributeId && !usedIds.has(attributeId)) {
            formData.push({
                id: 0,
                attributeId,
                isCustom: false,
                isImage: false,
                sort: 0
            })
        }
    })
}

// 移除表格数据
const moveLeft = () => {
    const ids = new Set(selectedRows.value.map((row) => row.attributeId))
    const items = formData.filter((row) => !ids.has(row.attributeId))

    formData.splice(0, formData.length, ...items)
}

const onSubmit = async () => {
    if (formData.length > 5) {
        ElMessage.warning('销售属性最多 5 个')
        return
    }

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