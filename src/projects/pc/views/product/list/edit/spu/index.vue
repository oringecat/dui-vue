<template>
    <app-dialog class="product-spu" title="规格" width="960">
        <el-form :model="formData" label-width="auto" v-loading="loading">
            <el-form-item label="名称">
                <el-input v-model="formData.spuName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="编码">
                <el-input v-model="formData.code" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="定制">
                <el-switch v-model="formData.isCustom" />
            </el-form-item>
            <el-form-item label="销售属性" v-if="saleTemplates.length">
                <div class="g-table">
                    <table cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th>名称</th>
                                <th>规格</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in saleTemplates" :key="index">
                                <td>{{ item.sale.saleName }}</td>
                                <td>
                                    <el-checkbox-group v-model="item.checked"
                                        @change="(value) => onChecked(item, value)">
                                        <template v-for="spec in item.specs" :key="spec.id">
                                            <el-checkbox :label="spec.specName" :value="spec.id" />
                                        </template>
                                    </el-checkbox-group>
                                    <table cellspacing="0" cellpadding="0"
                                        v-if="item.sale.isCustom && item.attrs.length">
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
                                                    <el-input v-model="attr.customName" placeholder="选填"
                                                        @change="rebuildSkus" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </el-form-item>
            <el-form-item label="库存单位" v-if="checkedSales.length">
                <div class="g-table">
                    <table cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th v-for="({ sale }, index) in checkedSales" :key="index">{{ sale.saleName }}</th>
                                <th>价格</th>
                                <th>库存</th>
                                <th>编码</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(sku, index) in formData.skus" :key="index">
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
            </el-form-item>
            <el-form-item label="规格说明">
                <div class="g-wangeditor simple">
                    <Toolbar class="g-wangeditor__toolbar" mode="simple" :editor="editorRef" />
                    <Editor class="g-wangeditor__editor" v-model="formData.spuContent" @onCreated="handleCreated" />
                </div>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary">保存</el-button>
        </template>
    </app-dialog>
</template>

<script lang="ts" setup>
import { ref, shallowRef, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import type { CheckboxValueType } from 'element-plus'
import { createCategorySaleAttrList, createCategorySaleSpecList } from '@/services/api/product'
import type { SaleTemplate } from './types'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import AppDialog from '@pc/components/ui/dialog/index.vue'

const props = defineProps<{
    spu?: Product.ProductSpuItem
    categoryId: number
}>()

const saleTemplates = ref<SaleTemplate[]>([])

const formData = reactive<Product.ProductSpuItem>({
    id: 0,
    code: '',
    spuName: '默认',
    spuContent: '',
    isCustom: false,
    skus: [],
    ...props.spu
})

const editorRef = shallowRef()

const handleCreated = (editor: unknown) => {
    editorRef.value = editor
}

const { loading: saleAttrLoading, rawFetch: getSaleAttrList } = createCategorySaleAttrList({
    manual: true
})

const { loading: saleSpecLoading, rawFetch: getSaleSpecList } = createCategorySaleSpecList({
    manual: true
})

const loading = computed(() => saleAttrLoading.value || saleSpecLoading.value)

// 已勾选的销售属性
const checkedSales = computed(() => saleTemplates.value.filter(({ checked }) => checked.length))

const specNameMap = computed(() => {
    const map = new Map<number, string>()
    saleTemplates.value.forEach(({ specs }) => {
        specs.forEach((spec) => map.set(spec.id, spec.specName))
    })
    return map
})

const getSpecName = (specId: number) => specNameMap.value.get(specId) || '无效'

// 重建 SKU 列表
const rebuildSkus = () => {
    formData.skus = cartesianSku(checkedSales.value.map(({ attrs }) => attrs))
}

const onChecked = (target: SaleTemplate, checkedValue: CheckboxValueType[]) => {
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

// 组合的唯一 key
const attrsKey = (attrs: Product.ProductSkuAttr[]) => {
    return attrs.map((a) => `${a.saleId}-${a.specId}`).sort().join('|')
}

const createEmptySku = (): Product.ProductSkuItem => ({
    id: 0,
    code: '',
    attrs: [],
    price: 0,
    stock: 0
})

// 计算笛卡尔积
const cartesianSku = (attrs: Product.ProductSkuAttr[][]) => {
    if (!attrs.length) return []

    // 缓存旧数据，避免重新填写
    const prevMap = new Map(formData.skus.map((sku) => [attrsKey(sku.attrs), sku]))

    return attrs.reduce<Product.ProductSkuItem[]>((res, cur) => res.flatMap((sku) => cur.map((item) => {
        const attrs = [...sku.attrs, {
            ...item,
            customName: item.customName || getSpecName(item.specId) // 空则回退为规格名称（不受后续规格改名影响）
        }]

        const prevSku = prevMap.get(attrsKey(attrs))

        return {
            ...(prevSku ?? createEmptySku()),
            attrs
        }
    })), [createEmptySku()])
}

onMounted(() => {
    const categoryId = props.categoryId

    Promise.all([
        getSaleAttrList({ categoryId }),
        getSaleSpecList({ categoryId })
    ]).then(([attrRes, specRes]) => {
        const filtered = attrRes.data.filter((item) => item.categoryId === categoryId)

        saleTemplates.value = filtered.map((sale) => {
            const specs = specRes.data.filter((spec) => spec.saleId === sale.id)

            // 从已有 SKU 中收集该销售属性已勾选的规格（按 specId 去重）
            const attrMap = new Map<number, Product.ProductSkuAttr>()

            formData.skus.forEach((sku) => {
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

        // 待定：（过滤掉无效的销售属性）或（显示无效的销售属性，但是不可编辑）
        // const validSaleSpecMap = new Map<number, Set<number>>()
        // saleTemplates.value.forEach(({ sale, specs }) => {
        //     validSaleSpecMap.set(sale.id, new Set(specs.map((s) => s.id)))
        // })

        // formData.skus = formData.skus.filter((sku) =>
        //     sku.attrs.every((attr) => validSaleSpecMap.get(attr.saleId)?.has(attr.specId))
        // )

        rebuildSkus()
    })
})

onBeforeUnmount(() => {
    editorRef.value?.destroy()
})
</script>