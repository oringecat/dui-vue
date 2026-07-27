<template>
    <div v-loading="loading" style="width: 100%;">
        <table cellspacing="0" cellpadding="0" v-if="attrs.length">
            <thead>
                <tr>
                    <th>属性</th>
                    <th>规格</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in attrs" :key="index">
                    <td>{{ item.sale.saleName }}</td>
                    <td>
                        <el-checkbox-group v-model="item.checked" @change="(value) => onChecked(item.sale.id, value)">
                            <template v-for="spec in item.specs" :key="spec.id">
                                <el-checkbox :label="spec.specName" :value="spec.id" />
                            </template>
                        </el-checkbox-group>
                        <table cellspacing="0" cellpadding="0" v-if="item.sale.isCustom && item.options.length">
                            <thead>
                                <tr>
                                    <th>已选</th>
                                    <th>自定义</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(option, index) in item.options" :key="index">
                                    <td>{{ option.specName }}</td>
                                    <td>
                                        <el-input v-model="option.customName" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <table cellspacing="0" cellpadding="0" style="margin-top: 18px;" v-if="selected.length">
            <thead>
                <tr>
                    <td v-for="({ sale }, index) in selected" :key="index">{{ sale.saleName }}</td>
                    <td>价格</td>
                    <td>数量</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="({ attrs, sku }, index) in skus" :key="index">
                    <td v-for="{ spec } in attrs" :key="spec.id">
                        {{ spec.customName || spec.specName }}
                    </td>
                    <td>
                        <el-input-number v-model="sku.price" />
                    </td>
                    <td>
                        <el-input-number v-model="sku.stock" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import type { CheckboxValueType } from 'element-plus'
import type { SaleAttribute, SaleSpec } from '@/types/product'
import { createCategorySaleAttrList, createCategorySaleSpecList } from '@/services/api/product'

const props = defineProps<{
    categoryId: number
}>()

const emit = defineEmits(['submit'])

const attrs = ref<{ sale: SaleAttribute; specs: SaleSpec[]; checked: number[]; options: (SaleSpec & { customName: string; })[] }[]>([])

const skus = ref<{
    attrs: { sale: SaleAttribute; spec: SaleSpec & { customName: string; } }[];
    sku: { price: number; stock: number };
}[]>([])

const selected = computed(() => attrs.value.filter(({ checked }) => checked.length))

const onChecked = (saleId: number, checkedValue: CheckboxValueType[]) => {
    const target = attrs.value.find(({ sale }) => sale.id === saleId)

    if (target) {
        const filtered = target.specs.filter((spec) => checkedValue.includes(spec.id))

        target.options = filtered.map((item) => ({
            ...item,
            customName: ''
        }))
    }

    const options = selected.value.reduce<{ sale: SaleAttribute; spec: SaleSpec & { customName: string; } }[][]>((res, { sale, options }) => {
        return [...res, options.map((spec) => ({ sale, spec }))]
    }, [])

    skus.value = cartesianProduct(options)
}

// 计算笛卡尔积
const cartesianProduct = (options: { sale: SaleAttribute; spec: SaleSpec & { customName: string; } }[][]) => {
    return options.reduce<{
        attrs: { sale: SaleAttribute; spec: SaleSpec & { customName: string; } }[];
        sku: { price: number; stock: number };
    }[]>((res, current) => res.flatMap((prev) => current.map((item) => ({
        attrs: [...prev.attrs, item],
        sku: { price: 0, stock: 0 }
    }))), [{ attrs: [], sku: { price: 0, stock: 0 } }])
}

const loading = computed(() => saleAttrLoading.value || saleSpecLoading.value)

const { loading: saleAttrLoading, rawFetch: getSaleAttrList } = createCategorySaleAttrList({
    manual: true
})

const { loading: saleSpecLoading, rawFetch: getSaleSpecList } = createCategorySaleSpecList({
    manual: true
})

watch(() => props.categoryId, (id) => {
    attrs.value = []
    skus.value = []

    Promise.all([
        getSaleAttrList({ categoryId: id }),
        getSaleSpecList({ categoryId: id })
    ]).then(([attrRes, specRes]) => {
        const filtered = attrRes.data.filter((item) => item.categoryId === id)

        attrs.value = filtered.map((sale) => ({
            sale,
            specs: specRes.data.filter((spec) => spec.saleId === sale.id),
            checked: [],
            options: []
        }))
    })
}, { immediate: true })
</script>

<style lang="less" scoped>
table,
th,
td {
    border: 1px solid #f2f2f2;
    padding: 5px;
}

table {
    width: 100%;
    border-collapse: collapse;
}
</style>