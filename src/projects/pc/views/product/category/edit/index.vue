<template>
    <app-dialog :title="authTitle" :show="show" @closed="emit('closed', refresh)">
        <el-form class="el-form--vertical" :model="formData">
            <el-form-item label="所属分类">
                <el-tree-select v-model="formData.parentId" :data="treeData" :props="{ label: 'categoryName' }"
                    node-key="id" :expand-on-click-node="false" check-strictly default-expand-all />
            </el-form-item>
            <el-form-item label="分类编码">
                <el-input v-model="formData.code" />
            </el-form-item>
            <el-form-item label="分类名称">
                <el-input v-model="formData.categoryName" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="onSubmit">提交</el-button>
        </template>
    </app-dialog>
</template>

<script lang="ts" setup>
import { shallowRef, reactive, computed } from 'vue'
import { buildTree } from '@/helpers/filters'
import { createCategoryList } from '@/services/api/product'
import AppDialog from '@pc/components/ui/dialog/index.vue'

const props = defineProps<{
    authTitle: string
    record?: Product.CategoryItem
}>()

const emit = defineEmits<{ closed: [boolean] }>()

const show = shallowRef(true)
const refresh = shallowRef(false)
const categoryList = shallowRef<Product.CategoryItem[]>([])

const treeData = computed(() => {
    const items = [{
        id: 0,
        parentId: 0,
        code: '',
        categoryName: '一级分类',
        attrs: [],
        sales: [],
        status: 1,
        icon: '',
        sort: 0,
        createTime: 0
    }, ...categoryList.value]

    return buildTree(items, 'id', 'parentId', (node) => node.parentId === 0)
})

const formData = reactive({
    parentId: props.record?.parentId ?? 0,
    code: props.record?.code ?? '',
    categoryName: props.record?.categoryName ?? ''
})

createCategoryList({
    onSuccess: (res) => {
        categoryList.value = res.data
    }
})

const onSubmit = () => {
    show.value = false
    refresh.value = true
}
</script>