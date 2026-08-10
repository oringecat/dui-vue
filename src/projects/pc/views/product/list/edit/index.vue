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
                        <el-input-tag v-model="keywords" placeholder="请输入后按回车键" />
                    </el-form-item>
                    <el-form-item label="品牌">
                        <el-select v-model="formData.brandId" placeholder="请选择">
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品属性" v-if="formData.categoryId">
                        <app-attribute v-model="formData.attrs" :category-id="formData.categoryId" />
                    </el-form-item>
                    <el-form-item label="销售规格">
                        <div class="g-table">
                            <el-button type="primary" size="small" :disabled="!formData.categoryId"
                                @click="openComponent('spu')">新增</el-button>
                            <table cellspacing="0" cellpadding="0" v-if="spuList.length">
                                <thead>
                                    <tr>
                                        <th>编码</th>
                                        <th>名称</th>
                                        <th>库存</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(spu, index) in spuList" :key="spu.id">
                                        <td>{{ spu.code }}</td>
                                        <td>{{ spu.spuName }}</td>
                                        <td>{{spu.skus.reduce((total, sku) => total + sku.stock, 0)}}</td>
                                        <td>
                                            <el-button size="small"
                                                @click="openComponent('spu', { spu })">编辑</el-button>
                                            <el-button size="small" type="danger"
                                                @click="onSpuDelete(index)">删除</el-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </el-form-item>
                    <el-form-item label="详情描述">
                        <div class="g-wangeditor">
                            <Toolbar class="g-wangeditor__toolbar" :editor="editorRef" />
                            <Editor class="g-wangeditor__editor" v-model="formData.description"
                                @onCreated="handleCreated" />
                        </div>
                    </el-form-item>
                </el-form>
            </el-splitter-panel>
        </el-splitter>
        <template #footer>
            <el-button type="primary" :loading="submitLoading" :disabled="failed" @click="onSubmit">提交</el-button>
        </template>
        <component :show="showComponent" :is="components[componentId]"
            v-bind="{ categoryId: formData.categoryId, ...componentProps }" @closed="closeComponent" />
    </app-dialog>
</template>

<script lang="ts" setup>
import { ref, shallowRef, computed, onMounted, nextTick, onBeforeUnmount, defineAsyncComponent, type Component } from 'vue'
import { ElMessage, ElMessageBox, type TreeInstance } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { buildTree } from '@/helpers/filters'
import { useComponent } from '@/composables/component'
import { createCategoryList, createProductDetail, createProductUpdate, createProductSpuList } from '@/services/api/product'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppAttribute from './attribute/index.vue'

const props = defineProps<{
    record?: Product.ProductListItem
}>()

const components: Record<string, Component> = {
    spu: defineAsyncComponent(() => import('./spu/index.vue'))
}

const { showComponent, componentId, componentProps, openComponent, closeComponent } = useComponent()

const show = shallowRef(true)
const treeRef = shallowRef<TreeInstance>()
const categoryList = shallowRef<Product.CategoryItem[]>([])
const spuList = ref<Product.ProductSpuItem[]>([])

const editorRef = shallowRef()

const handleCreated = (editor: unknown) => {
    editorRef.value = editor
}

const formData = ref<Partial<Product.ProductDetail>>({
    id: props.record?.id,
    categoryId: 0,
    userId: 0,
    attrs: []
})

// 关键字
const keywords = computed({
    get: () => formData.value.tags ? formData.value.tags.split(',') : [],
    set: (val) => formData.value.tags = val.join(',')
})

const loading = computed(() => categoryLoading.value || detailLoading.value || spuLoading.value)

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

const { loading: spuLoading, rawFetch: getProductSpuList } = createProductSpuList({
    manual: true
})

const { loading: submitLoading, rawFetch: updateProduct } = createProductUpdate({
    manual: true
})

// 编辑模式禁止修改分类
const onCategoryClick = (item: Product.CategoryItem, node: Node) => {
    if (!props.record && node.isLeaf) {
        formData.value.categoryId = item.id
        formData.value.attrs = []
    }
}

const onSpuDelete = (index: number) => {
    ElMessageBox.confirm('该操作无法撤销，确认要删除吗？', '注意', {
        type: 'warning'
    }).then(() => {
        spuList.value.splice(index, 1)
    })
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
        Promise.all([
            getProductDetail({ id: props.record.id }),
            getProductSpuList({ productId: props.record.id })
        ]).then(([detailRes, spuRes]) => {
            formData.value = detailRes.data
            spuList.value = spuRes.data
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