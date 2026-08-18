<template>
    <app-dialog class="product-spu" title="规格" width="960">
        <el-form :model="formData" label-width="auto" v-loading="loading">
            <el-form-item label="名称">
                <el-input v-model="formData.spuName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="编码">
                <el-input v-model="formData.code" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="是否定制">
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
                                <td>{{ item.attribute.name }}</td>
                                <td>
                                    <el-checkbox-group v-model="item.checked"
                                        @change="(value) => onChecked(item, value)">
                                        <template v-for="spec in item.attribute.values" :key="spec.id">
                                            <el-checkbox :label="spec.value" :value="spec.id" />
                                        </template>
                                    </el-checkbox-group>
                                    <el-button size="small" icon="plus" :disabled="isCustomDisabled(item)"
                                        @click="addCustomSpec(item)" v-if="item.sale.isCustom">自定义</el-button>
                                    <table cellspacing="0" cellpadding="0"
                                        v-if="item.sale.isCustom && item.specs.length">
                                        <thead>
                                            <tr>
                                                <th>已选</th>
                                                <th>自定义</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(spec, index) in item.specs" :key="index">
                                                <td>
                                                    <el-tag :type="spec.valueId ? 'primary' : 'warning'"
                                                        @close="removeSpec(item, index)" closable>
                                                        {{ getSpecName(spec.valueId) }}
                                                    </el-tag>
                                                </td>
                                                <td>
                                                    <el-input v-model="spec.specName"
                                                        :placeholder="spec.valueId ? '选填' : '必填'"
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
                                <th v-for="({ attribute }, index) in checkedSales" :key="index">{{ attribute.name }}
                                </th>
                                <th>价格</th>
                                <th>库存</th>
                                <th>编码</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(sku, index) in formData.skus" :key="index">
                                <td v-for="spec in sku.specs" :key="spec.id">
                                    {{ spec.specName || getSpecName(spec.valueId) }}
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
            <el-form-item label="规格描述">
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
import { createCategoryList } from '@/services/api/product'
import { useAttributeStore } from '@/stores/attribute'
import type { SaleTemplate } from './types'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import AppDialog from '@pc/components/ui/dialog/index.vue'

const props = defineProps<{
    spu?: Product.ProductSpuItem
    categoryId: number
}>()

const attributeStore = useAttributeStore()

const saleTemplates = ref<SaleTemplate[]>([])

const formData = reactive<Product.ProductSpuItem>({
    id: 0,
    code: '',
    spuName: '',
    spuContent: '',
    isCustom: false,
    skus: [],
    ...props.spu
})

const editorRef = shallowRef()

const handleCreated = (editor: unknown) => {
    editorRef.value = editor
}

const { loading, rawFetch: getCategoryList } = createCategoryList({
    manual: true
})

// 已勾选的销售属性
const checkedSales = computed(() => saleTemplates.value.filter(({ specs }) => specs.length))

const specNameMap = computed(() => {
    const map = new Map<number, string>()
    saleTemplates.value.forEach(({ attribute }) => {
        attribute.values.forEach((spec) => map.set(spec.id, spec.value))
    })
    return map
})

const getSpecName = (valueId: number) => specNameMap.value.get(valueId) || '自定义'

let customSpecId = 0

// 新增自定义规格
const addCustomSpec = (item: SaleTemplate) => {
    item.specs.push({
        id: --customSpecId,
        attributeId: item.sale.attributeId,
        valueId: 0,
        specName: ''
    })
    rebuildSkus()
}

// 删除自定义规格
const removeSpec = (item: SaleTemplate, index: number) => {
    const [spec] = item.specs.splice(index, 1)
    if (spec) {
        item.checked = item.checked.filter((id) => id !== spec.valueId)
    }
    rebuildSkus()
}

const isCustomDisabled = (item: SaleTemplate) => {
    return item.specs.filter(({ valueId }) => valueId === 0).length >= 3
}

// 重建 SKU 列表
const rebuildSkus = () => {
    formData.skus = cartesianSku(checkedSales.value.map(({ specs }) => specs))
}

const onChecked = (target: SaleTemplate, checkedValue: CheckboxValueType[]) => {
    // 缓存旧数据，避免重新填写
    const prevMap = new Map(target.specs.map((a) => [`${a.attributeId}-${a.valueId}`, a]))

    const checkedValues = target.attribute.values.filter((s) => checkedValue.includes(s.id))
    const customs = target.specs.filter((s) => !s.valueId)

    const specs = checkedValues.map((v) => {
        const prev = prevMap.get(`${target.sale.attributeId}-${v.id}`)
        return prev ?? {
            id: --customSpecId,
            attributeId: target.sale.attributeId,
            valueId: v.id,
            specName: ''
        }
    })

    target.specs = [...specs, ...customs]
    rebuildSkus()
}

// 组合的唯一 key
const specsKey = (specs: Product.ProductSpec[]) => {
    return specs.map((a) => (a.valueId ? `v-${a.valueId}` : `i-${a.id}`)).sort().join('|')
}

const createEmptySku = (): Product.ProductSkuItem => ({
    id: 0,
    code: '',
    specs: [],
    price: 0,
    stock: 0,
    image: {
        url: '',
        width: 0,
        height: 0
    }
})

// 计算笛卡尔积
const cartesianSku = (specs: Product.ProductSpec[][]) => {
    if (!specs.length) return []

    // 缓存旧数据，避免重新填写
    const prevMap = new Map(formData.skus.map((sku) => [specsKey(sku.specs), sku]))

    return specs.reduce<Product.ProductSkuItem[]>((res, cur) => res.flatMap((sku) => cur.map((item) => {
        const specs = [...sku.specs, {
            ...item,
            specName: item.specName || getSpecName(item.valueId) // 空则回退为规格名称（不受后续规格改名影响）
        }]

        const prevSku = prevMap.get(specsKey(specs))

        return {
            ...(prevSku ?? createEmptySku()),
            specs
        }
    })), [createEmptySku()])
}

onMounted(() => {
    const categoryId = props.categoryId

    Promise.all([
        getCategoryList({ categoryId }),
        attributeStore.readyPromise
    ]).then(([categoryRes]) => {
        const sales = categoryRes.data[0]?.sales ?? []

        saleTemplates.value = sales.flatMap((sale) => {
            const attribute = attributeStore.getAttributeById(sale.attributeId)
            if (!attribute) return []

            // 从已有 SKU 中收集该销售属性已勾选的规格
            const specMap = new Map<string, Product.ProductSpec>()

            formData.skus.forEach((sku) => {
                sku.specs.forEach((attr) => {
                    const key = attr.valueId ? `v-${attr.valueId}` : `i-${attr.id}`
                    if (attr.attributeId === sale.attributeId && !specMap.has(key)) {
                        specMap.set(key, { ...attr })
                    }
                })
            })

            const specs = [...specMap.values()]

            return [{
                sale,
                attribute,
                checked: specs.map((attr) => attr.valueId).filter((id) => id > 0),
                specs
            }]
        })

        rebuildSkus()
    })
})

onBeforeUnmount(() => {
    editorRef.value?.destroy()
})
</script>