<template>
    <app-dialog class="product-edit" title="编辑" width="900" :show="show">
        <el-splitter v-loading="loading">
            <el-splitter-panel size="200px">
                <el-tree ref="treeRef" :class="{ 'readonly': !!props.record }" :data="categoryList"
                    :props="{ label: 'categoryName', }" node-key="id" @node-click="onCategoryClick" highlight-current />
            </el-splitter-panel>
            <el-splitter-panel>
                <el-form :model="formData" label-width="auto">
                    <el-form-item label="标题">
                        <el-input v-model="formData.title" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="品牌">
                        <el-select v-model="formData.brandId" placeholder="请选择">
                        </el-select>
                    </el-form-item>
                    <el-form-item label="定制">
                        <el-switch v-model="formData.isCustom" />
                    </el-form-item>
                    <el-form-item label="详情">
                        <el-input type="textarea" v-model="formData.description" :rows="3" placeholder="请输入" />
                    </el-form-item>
                    <template v-if="formData.categoryId">
                        <el-form-item label="基础属性" v-if="formData.attrs">
                            <app-attr v-model="formData.attrs" :category-id="formData.categoryId" />
                        </el-form-item>
                        <el-form-item label="销售属性" v-if="formData.skus">
                            <app-sku v-model="formData.skus" :category-id="formData.categoryId" />
                        </el-form-item>
                    </template>
                </el-form>
            </el-splitter-panel>
        </el-splitter>
        <template #footer>
            <el-button type="primary" :loading="submitLoading" :disabled="failed" @click="onSubmit">提交</el-button>
        </template>
    </app-dialog>
</template>

<script lang="ts" setup>
import { ref, shallowRef, computed, onMounted, nextTick } from 'vue'
import { ElMessage, type TreeInstance } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { buildTree } from '@/helpers/filters'
import { createCategoryList, createProductDetail, createProductUpdate } from '@/services/api/product'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppAttr from './attr/index.vue'
import AppSku from './sku/index.vue'

const props = defineProps<{
    record?: Product.ProductListItem
}>()

const show = shallowRef(true)
const treeRef = shallowRef<TreeInstance>()
const categoryList = shallowRef<Product.CategoryItem[]>([])

const formData = ref<Partial<Product.ProductDetail>>({
    id: props.record?.id,
    isCustom: false,
    attrs: [],
    skus: []
})

const loading = computed(() => categoryLoading.value || detailLoading.value)

const { loading: categoryLoading } = createCategoryList({
    onSuccess: (res) => {
        categoryList.value = buildTree(res.data, 'id', 'parentId', (node) => node.parentId === 0)

        nextTick(() => {
            const categoryId = props.record?.categoryId
            if (categoryId) {
                treeRef.value?.setCurrentKey(categoryId)
            }
        })
    }
})

const { loading: detailLoading, rawFetch: getProductDetail, failed } = createProductDetail({
    manual: true
})

const { loading: submitLoading, rawFetch: updateProduct } = createProductUpdate({
    manual: true
})

const onCategoryClick = (item: Product.CategoryItem, node: Node) => {
    if (node.isLeaf) {
        formData.value.categoryId = item.id
        formData.value.attrs = []
        formData.value.skus = []
    }
}

const onSubmit = async () => {
    try {
        await updateProduct(formData.value)
        show.value = false
    } catch (err) {
        ElMessage.error(String(err))
    }
}

onMounted(() => {
    if (props.record) {
        getProductDetail({ id: props.record.id }).then((res) => {
            formData.value = res.data
        }).catch((err) => {
            ElMessage.error(err)
        })
    }
})
</script>

<style lang="less">
@import './index.less';
</style>