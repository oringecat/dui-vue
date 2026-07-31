<template>
    <div class="product-spu" v-loading="loading">
        <el-tabs v-model="currentTab">
            <el-tab-pane v-for="form in spuForms" :key="form.spu.id" :label="form.spu.spuName" :name="form.spu.spuName">
                <table cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>名称</th>
                            <th>规格</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="{ sale, specs, state } in getSaleRows(form)" :key="sale.id">
                            <td>{{ sale.saleName }}</td>
                            <td>
                                <el-checkbox-group v-model="state.checked"
                                    @change="(value) => onChecked(form, state, specs, value)">
                                    <el-checkbox v-for="spec in specs" :key="spec.id" :label="spec.specName"
                                        :value="spec.id" />
                                </el-checkbox-group>
                                <table cellspacing="0" cellpadding="0" v-if="sale.isCustom && state.attrs.length">
                                    <thead>
                                        <tr>
                                            <th>已选</th>
                                            <th>自定义</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="attr in state.attrs" :key="attr.specId">
                                            <td>{{ getSpecName(attr.specId) }}</td>
                                            <td>
                                                <el-input v-model="attr.customName" placeholder="选填"
                                                    @change="rebuildSkus(form)" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table cellspacing="0" cellpadding="0" v-if="getCheckedSales(form).length">
                    <thead>
                        <tr>
                            <td v-for="{ sale } in getCheckedSales(form)" :key="sale.id">
                                {{ sale.saleName }}
                            </td>
                            <td>价格</td>
                            <td>库存</td>
                            <td>编码</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(sku, index) in form.spu.skus" :key="index">
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

            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { CheckboxValueType } from 'element-plus'
import { createProductSpuList, createCategorySaleAttrList, createCategorySaleSpecList } from '@/services/api/product'
import type { SaleTemplate, SaleState, SpuForm } from './types'

const props = withDefaults(defineProps<{
    productId?: number
    categoryId: number
}>(), {
    productId: 0
})

const currentTab = ref('')
const saleTemplates = ref<SaleTemplate[]>([])
const spuForms = ref<SpuForm[]>([])

const loading = computed(() => spuLoading.value || saleAttrLoading.value || saleSpecLoading.value)

const { loading: spuLoading, rawFetch: getProductSpuList } = createProductSpuList({
    manual: !!props.productId
})

const { loading: saleAttrLoading, rawFetch: getSaleAttrList } = createCategorySaleAttrList({
    manual: true
})

const { loading: saleSpecLoading, rawFetch: getSaleSpecList } = createCategorySaleSpecList({
    manual: true
})

const specNameMap = computed(() => {
    const map = new Map<number, string>()
    saleTemplates.value.forEach(({ specs }) => {
        specs.forEach((spec) => map.set(spec.id, spec.specName))
    })
    return map
})

const getSpecName = (specId: number) => specNameMap.value.get(specId) || '无效'

const getSaleRows = (form: SpuForm) => saleTemplates.value.map(({ sale, specs }) => ({
    sale,
    specs,
    state: form.sales[sale.id] ??= { checked: [], attrs: [] }
}))

// 获取勾选的销售属性
const getCheckedSales = ({ sales }: SpuForm) => saleTemplates.value.filter(({ sale }) => sales[sale.id]?.checked.length)

// 重建 SKU 列表
const rebuildSkus = (form: SpuForm) => {
    const selected = getCheckedSales(form).map(({ sale }) => form.sales[sale.id]?.attrs ?? [])
    form.spu.skus = cartesianSku(form.spu.skus, selected)
}

const onChecked = (form: SpuForm, state: SaleState, specs: Product.CategorySaleSpecItem[], checkedValue: CheckboxValueType[]) => {
    // 缓存旧数据，避免重新填写
    const prevMap = new Map(state.attrs.map((a) => [`${a.saleId}-${a.specId}`, a]))
    const filtered = specs.filter((s) => checkedValue.includes(s.id))

    state.attrs = filtered.map((a) => {
        const prev = prevMap.get(`${a.saleId}-${a.id}`)
        return prev ?? {
            saleId: a.saleId,
            specId: a.id,
            customName: '',
            image: '',
            thumbnail: ''
        }
    })

    rebuildSkus(form)
}

// 组合的唯一 key
const attrsKey = (attrs: Product.ProductSkuAttr[]) => {
    return attrs.map((a) => `${a.saleId}-${a.specId}`).sort().join('|')
}

// 计算笛卡尔积
const cartesianSku = (prevSkus: Product.ProductSkuItem[], attrs: Product.ProductSkuAttr[][]) => {
    if (!attrs.length) return []

    // 缓存旧数据，避免重新填写
    const prevMap = new Map(prevSkus.map((sku) => [attrsKey(sku.attrs), sku]))

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

// 从已有 skus 反推销售属性勾选状态
const buildSalesFromSkus = (skus: Product.ProductSkuItem[]) => {
    const result: Record<number, SaleState> = {}

    saleTemplates.value.forEach(({ sale }) => {
        const attrMap = new Map<number, Product.ProductSkuAttr>()

        skus.forEach((sku) => {
            sku.attrs.forEach((attr) => {
                if (attr.saleId === sale.id && !attrMap.has(attr.specId)) {
                    attrMap.set(attr.specId, { ...attr })
                }
            })
        })

        const attrs = [...attrMap.values()]

        result[sale.id] = {
            checked: attrs.map((a) => a.specId),
            attrs
        }
    })

    return result
}

watch(() => props.categoryId, (id) => {
    saleTemplates.value = []

    // 分类变了，销售属性全部失效
    spuForms.value.forEach((form) => {
        form.sales = {}
        form.spu.skus = []
    })

    Promise.all([
        getSaleAttrList({ categoryId: id }),
        getSaleSpecList({ categoryId: id })
    ]).then(([attrRes, specRes]) => {
        saleTemplates.value = attrRes.data.map((sale) => ({
            sale,
            specs: specRes.data.filter((spec) => spec.saleId === sale.id)
        }))

        spuForms.value.forEach((form) => {
            form.sales = buildSalesFromSkus(form.spu.skus)
        })

        // 待定：（过滤掉无效的销售属性）或（显示无效的销售属性，但是不可编辑）
    })
}, { immediate: true })

onMounted(() => {
    if (props.productId) {
        getProductSpuList({ productId: props.productId }).then((res) => {
            spuForms.value = res.data.map((spu) => ({
                spu,
                sales: buildSalesFromSkus(spu.skus)
            }))
            currentTab.value = res.data[0]?.spuName ?? ''
        }).catch((err) => {
            ElMessage.error(err)
        })
    }
})
</script>