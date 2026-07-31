<template>
    <app-dialog class="product-edit" title="编辑" width="1200" :loading="loading" :show="show">
        <el-splitter>
            <el-splitter-panel size="200px">
                <el-tree ref="treeRef" :class="{ 'readonly': !!props.record }" :data="categoryList"
                    :props="{ label: 'categoryName', }" node-key="id" @node-click="onCategoryClick" highlight-current />
            </el-splitter-panel>
            <el-splitter-panel>
                <el-form :model="formData" label-width="auto">
                    <el-form-item label="商品标题">
                        <el-input v-model="formData.title" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="关键字">
                        <el-input v-model="formData.keywords" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="品牌">
                        <el-select v-model="formData.brandId" placeholder="请选择">
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品属性" v-if="formData.categoryId">
                        <app-attr class="product-edit__table" v-model="formData.attrs"
                            :category-id="formData.categoryId" />
                    </el-form-item>
                    <el-form-item label="详情">
                        <div class="g-wangeditor">
                            <Toolbar class="g-wangeditor__toolbar" :editor="editorRef" />
                            <Editor class="g-wangeditor__editor" v-model="formData.description"
                                @onCreated="handleCreated" />
                        </div>
                    </el-form-item>
                </el-form>
                <app-spu class="product-edit__table" :product-id="formData.id" :category-id="formData.categoryId"
                    v-if="formData.categoryId" />
            </el-splitter-panel>
        </el-splitter>
        <template #footer>
            <el-button type="primary" :loading="submitLoading" :disabled="failed" @click="onSubmit">提交</el-button>
        </template>
    </app-dialog>
</template>

<script lang="ts" setup>
import { ref, shallowRef, computed, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { ElMessage, type TreeInstance } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { buildTree } from '@/helpers/filters'
import { createCategoryList, createProductDetail, createProductUpdate } from '@/services/api/product'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppAttr from './attr/index.vue'
import AppSpu from './spu/index.vue'

const props = defineProps<{
    record?: Product.ProductListItem
}>()

const show = shallowRef(true)
const treeRef = shallowRef<TreeInstance>()
const categoryList = shallowRef<Product.CategoryItem[]>([])

const formData = ref<Partial<Product.ProductDetail>>({
    id: props.record?.id,
    userId: 0,
    attrs: []
})

const editorRef = shallowRef()
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

const handleCreated = (editor: unknown) => {
    editorRef.value = editor
}

const onCategoryClick = (item: Product.CategoryItem, node: Node) => {
    if (node.isLeaf) {
        formData.value.categoryId = item.id
        formData.value.attrs = []
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

onBeforeUnmount(() => {
    editorRef.value?.destroy()
})
</script>

<style lang="less">
@import './index.less';
</style>