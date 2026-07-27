<template>
    <app-dialog title="编辑" width="900" :show="show">
        <el-splitter v-loading="loading">
            <el-splitter-panel size="240px" v-if="!selectedRow">
                <el-tree :data="categoryList" :props="{ label: 'categoryName', }" node-key="id"
                    @node-click="onCategoryClick" highlight-current />
            </el-splitter-panel>
            <el-splitter-panel>
                <el-form :model="formData" label-width="auto">
                    <el-form-item label="标题">
                        <el-input v-model="formData.title" />
                    </el-form-item>
                    <el-form-item label="品牌">
                        <el-select v-model="formData.brandId" placeholder="请选择">
                        </el-select>
                    </el-form-item>
                    <el-form-item label="定制">
                        <el-switch v-model="formData.isCustom" />
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" v-model="formData.description" :rows="3" />
                    </el-form-item>
                    <el-form-item label="规格">
                        <app-sku :category-id="formData.categoryId" @submit="(item) => skus.push(item)"
                            v-if="formData.categoryId" />
                        <el-text type="info" v-else>请先选择分类</el-text>
                    </el-form-item>
                </el-form>
            </el-splitter-panel>
        </el-splitter>
        <template #footer>
            <el-button type="primary" :loading="submitLoading" @click="onSubmit">提交</el-button>
        </template>
    </app-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, shallowRef, computed, onMounted } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { buildTree } from '@/helpers/filters'
import type { ProductSku } from '@/types/product'
import { createCategoryList, createProductDetail, createProductUpdate } from '@/services/api/product'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppSku from './sku/index.vue'

const props = defineProps<{
    show?: boolean
    selectedRow?: Product.ProductListItem
}>()

const emit = defineEmits<{
    closed: [boolean]
}>()

const categoryList = shallowRef<Product.CategoryItem[]>([])
const skus = reactive<ProductSku[]>([])

const formData = ref<Partial<Product.ProductDetail>>({
    id: 0,
    isCustom: false,
    ...props.selectedRow
})

const loading = computed(() => categoryLoading.value || detailLoading.value)

const { loading: categoryLoading } = createCategoryList({
    manual: !!props.selectedRow,
    onSuccess: (res) => {
        categoryList.value = buildTree(res.data, 'id', 'parentId', (node) => node.parentId === 0)
    }
})

const { loading: detailLoading, fetch: getProductDetail } = createProductDetail({
    manual: true,
    onSuccess: (res) => {
        formData.value = res.data
    }
})

const { loading: submitLoading, rawFetch: updateProduct } = createProductUpdate({
    manual: true
})

const onCategoryClick = (item: Product.CategoryItem, node: Node) => {
    if (node.isLeaf) {
        formData.value.categoryId = item.id
    }
}

const onSubmit = async () => {
    try {
        //await updateProduct(formData.value)
        emit('closed', true)
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => {
    if (props.selectedRow) {
        getProductDetail({ id: props.selectedRow.id })
    }
})
</script>