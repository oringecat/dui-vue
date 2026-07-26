<template>
    <app-dialog title="编辑" width="900">
        <el-splitter v-loading="loading">
            <el-splitter-panel size="240px" v-if="!selectedRow">
                <el-tree :data="categoryList" :props="{ label: 'categoryName', }" node-key="id"
                    @node-click="onCategoryClick" highlight-current />
            </el-splitter-panel>
            <el-splitter-panel>
                <div class="block">
                    <div>
                        <app-category @submit="(item) => categorys.push(item)" />
                    </div>
                    <div>
                        <pre>{{ categorys }}</pre>
                    </div>
                </div>
                <div class="block" v-if="categorys.length">
                    <div>
                        <app-sales v-bind="{ categorys }" @submit="(item) => sales.push(item)" />
                    </div>
                    <div>
                        <pre>{{ sales }}</pre>
                    </div>
                </div>
                <div class="block" v-if="sales.length">
                    <div>
                        <app-spec v-bind="{ categorys, sales }" @submit="(item) => specs.push(item)" />
                    </div>
                    <div>
                        <pre>{{ specs }}</pre>
                    </div>
                </div>
                <div class="block" v-if="specs.length">
                    <div>
                        <app-sku v-bind="{ categorys, sales, specs }" @submit="(item) => skus.push(item)" />
                    </div>
                </div>
            </el-splitter-panel>
        </el-splitter>
    </app-dialog>
</template>

<script lang="ts" setup>
import { reactive, shallowRef, computed } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { buildTree } from '@/helpers/filters'
import type { ProductSku, Category, SaleAttribute, SaleSpec } from '@/types/product'
import { createCategoryList, createCategorySaleAttrList, createCategorySaleSpecList } from '@/services/api/product'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppCategory from './category/index.vue'
import AppSales from './sales/index.vue'
import AppSpec from './spec/index.vue'
import AppSku from './sku/index.vue'

const props = defineProps<{
    selectedRow?: Product.ProductListItem
}>()

const categorys = reactive<Category[]>([])
const sales = reactive<SaleAttribute[]>([])
const specs = reactive<SaleSpec[]>([])
const skus = reactive<ProductSku[]>([])

const categoryList = shallowRef<Product.CategoryItem[]>([])
const saleAttrList = shallowRef<Product.CategorySaleAttrItem[]>([])
const saleSpecList = shallowRef<Product.CategorySaleSpecItem[]>([])

const loading = computed(() => categoryLoading.value || saleAttrLoading.value || saleSpecLoading.value)

const { loading: categoryLoading } = createCategoryList({
    onSuccess: (res) => {
        categoryList.value = buildTree(res.data, 'id', 'parentId', (node) => node.parentId === 0)
    },
    immediate: !props.selectedRow
})

const { loading: saleAttrLoading, fetch: getSaleAttrList } = createCategorySaleAttrList({
    onSuccess: (res) => {
        saleAttrList.value = res.data
    }
})

const { loading: saleSpecLoading, fetch: getSaleSpecList } = createCategorySaleSpecList({
    onSuccess: (res) => {
        saleSpecList.value = res.data
    }
})

const onCategoryClick = (item: Product.CategoryItem, node: Node) => {
    if (node.isLeaf) {
        getSaleAttrList({ categoryId: item.id })
        getSaleSpecList({ categoryId: item.id })
    }
}
</script>

<style lang="less">
.block {
    display: flex;
    border-bottom: 1px solid #f2f2f2;

    .el-select {
        min-width: 160px;
    }
}
</style>