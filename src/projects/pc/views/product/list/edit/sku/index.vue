<template>
    <div class="product-sku" v-loading="loading">
        <table cellspacing="0" cellpadding="0" v-if="saleGroups.length">
            <thead>
                <tr>
                    <th>名称</th>
                    <th>规格</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in saleGroups" :key="index">
                    <td>{{ item.sale.saleName }}</td>
                    <td>
                        <el-checkbox-group v-model="item.checked" @change="(value) => onChecked(item.sale.id, value)">
                            <template v-for="spec in item.specs" :key="spec.id">
                                <el-checkbox :label="spec.specName" :value="spec.id" />
                            </template>
                        </el-checkbox-group>
                        <table cellspacing="0" cellpadding="0" v-if="item.sale.isCustom && item.attrs.length">
                            <thead>
                                <tr>
                                    <th>已选</th>
                                    <th>自定义</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(attr, index) in item.attrs" :key="index">
                                    <td>{{ getSpecName(attr.specId) }}</td>
                                    <td>
                                        <el-input v-model="attr.customName" placeholder="选填" @change="rebuildSkus" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <table cellspacing="0" cellpadding="0" v-if="selected.length">
            <thead>
                <tr>
                    <td v-for="({ sale }, index) in selected" :key="index">{{ sale.saleName }}</td>
                    <td>价格</td>
                    <td>库存</td>
                    <td>编码</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(sku, index) in saleSkus" :key="index">
                    <td v-for="attr in sku.attrs" :key="`${attr.saleId}-${attr.specId}`">
                        {{ attr.customName || getSpecName(attr.specId) }}
                    </td>
                    <td>
                        <el-input-number v-model="sku.price" :min="0" />
                    </td>
                    <td>
                        <el-input-number v-model="sku.stock" :min="0" />
                    </td>
                    <td>
                        <el-input v-model="sku.code" placeholder="选填" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import type { CheckboxValueType } from 'element-plus'
import { createCategorySaleAttrList, createCategorySaleSpecList } from '@/services/api/product'
import type { ProductSaleGroup } from './types'

const props = defineProps<{
    modelValue: Product.ProductSkuItem[]
    categoryId: number
}>()

const emit = defineEmits<{
    'update:modelValue': [value: Product.ProductSkuItem[]]
}>()

const saleGroups = ref<ProductSaleGroup[]>([])

const saleSkus = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const selected = computed(() => saleGroups.value.filter(({ checked }) => checked.length))

const getSpecName = (specId: number) => {
    const item = saleGroups.value.flatMap(({ specs }) => specs).find(({ id }) => id === specId)
    return item?.specName || '无效'
}

// 重建 SKU 列表
const rebuildSkus = () => {
    saleSkus.value = cartesianSku(selected.value.map(({ attrs }) => attrs))
}

const onChecked = (saleId: number, checkedValue: CheckboxValueType[]) => {
    const target = saleGroups.value.find(({ sale }) => sale.id === saleId)
    if (target) {
        // 缓存旧数据，避免重新填写
        const prevMap = new Map(target.attrs.map((a) => [`${a.saleId}-${a.specId}`, a]))
        const filtered = target.specs.filter((s) => checkedValue.includes(s.id))

        target.attrs = filtered.map((a) => {
            const prev = prevMap.get(`${a.saleId}-${a.id}`)
            return prev ?? {
                saleId: a.saleId,
                specId: a.id,
                customName: '',
                image: '',
                thumbnail: ''
            }
        })

        rebuildSkus()
    }
}

// 组合的唯一 key
const attrsKey = (attrs: Product.ProductSkuAttr[]) =>
    attrs.map((a) => `${a.saleId}-${a.specId}`).sort().join('|')

// 计算笛卡尔积
const cartesianSku = (attrs: Product.ProductSkuAttr[][]) => {
    if (!attrs.length) return []
    
    // 缓存旧数据，避免重新填写
    const prevMap = new Map(saleSkus.value.map((sku) => [attrsKey(sku.attrs), sku]))

    const skus: Product.ProductSkuItem[] = [{
        id: 0,
        code: '',
        attrs: [],
        price: 0,
        stock: 0
    }]

    return attrs.reduce<Product.ProductSkuItem[]>((res, cur) => res.flatMap((sku) => cur.map((item) => {
        const prev = prevMap.get(attrsKey([...sku.attrs, item]))
        const attrs = [...sku.attrs, {
            ...item,
            customName: item.customName || getSpecName(item.specId) // 空则回退为规格名称（不受后续规格改名影响）
        }]
        return {
            id: 0,
            code: '',
            price: 0,
            stock: 0,
            ...prev,
            attrs
        }
    })), skus)
}

const loading = computed(() => saleAttrLoading.value || saleSpecLoading.value)

const { loading: saleAttrLoading, rawFetch: getSaleAttrList } = createCategorySaleAttrList({
    manual: true
})

const { loading: saleSpecLoading, rawFetch: getSaleSpecList } = createCategorySaleSpecList({
    manual: true
})

watch(() => props.categoryId, (id) => {
    saleGroups.value = []

    Promise.all([
        getSaleAttrList({ categoryId: id }),
        getSaleSpecList({ categoryId: id })
    ]).then(([attrRes, specRes]) => {
        const filtered = attrRes.data.filter((item) => item.categoryId === id)

        saleGroups.value = filtered.map((sale) => {
            const specs = specRes.data.filter((spec) => spec.saleId === sale.id)

            // 从已有 SKU 中收集该销售属性已勾选的规格（按 specId 去重）
            const attrMap = new Map<number, Product.ProductSkuAttr>()
            props.modelValue.forEach((sku) => {
                sku.attrs.forEach((attr) => {
                    if (attr.saleId === sale.id && !attrMap.has(attr.specId)) {
                        attrMap.set(attr.specId, { ...attr })
                    }
                })
            })

            const attrs = [...attrMap.values()]

            return {
                sale,
                specs,
                checked: attrs.map((attr) => attr.specId),
                attrs
            }
        })

        // 过滤掉无效的销售属性（待定：显示无效的销售属性，但是不可编辑）
        // const validSaleSpecMap = new Map<number, Set<number>>()
        // saleGroups.value.forEach(({ sale, specs }) => {
        //     validSaleSpecMap.set(sale.id, new Set(specs.map((s) => s.id)))
        // })

        // saleSkus.value = saleSkus.value.filter((sku) =>
        //     sku.attrs.every((attr) => validSaleSpecMap.get(attr.saleId)?.has(attr.specId))
        // )

        rebuildSkus()
    })
}, { immediate: true })
</script>

<style lang="less" scoped>
@import './index.less';
</style>