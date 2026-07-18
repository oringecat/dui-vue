<template>
    <app-dialog>
        <el-form :model="formData">
            <el-form-item label="所属分类">
                <el-tree-select v-model="formData.parentId" :data="categoryList" :props="{ label: 'categoryName' }"
                    node-key="id" :expand-on-click-node="false" check-strictly default-expand-all />
            </el-form-item>
            <el-form-item label="分类名称">
                <el-input v-model="formData.categoryName" />
            </el-form-item>
        </el-form>
    </app-dialog>
</template>

<script lang="ts" setup>
import { shallowRef, reactive } from 'vue'
import { buildTree } from '@/helpers/filters'
import { createCategoryList } from '@/services/api/product'
import AppDialog from '@pc/components/ui/dialog/index.vue'

const props = defineProps<{
    selectedRow?: Product.CategoryItem
}>()

const categoryList = shallowRef<Product.CategoryItem[]>([])

const formData = reactive({
    parentId: props.selectedRow?.parentId ?? 0,
    categoryName: ''
})

createCategoryList({
    onSuccess: (res) => {
        categoryList.value = buildTree(res.data, 'id', 'parentId', (node) => node.parentId === 0)
    },
    immediate: true
})
</script>