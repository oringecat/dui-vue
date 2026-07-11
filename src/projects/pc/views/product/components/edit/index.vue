<template>
    <app-dialog>
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
    </app-dialog>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import type { ProductSku, Category, SaleAttribute, SaleSpec } from '@/types/product'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppCategory from './category/index.vue'
import AppSales from './sales/index.vue'
import AppSpec from './spec/index.vue'
import AppSku from './sku/index.vue'

const props = defineProps<{
    selectedRow?: Product.ProductItem
}>()

const categorys = reactive<Category[]>([])
const sales = reactive<SaleAttribute[]>([])
const specs = reactive<SaleSpec[]>([])
const skus = reactive<ProductSku[]>([])
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