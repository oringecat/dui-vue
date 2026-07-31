// 销售属性模板
export interface SaleTemplate {
    sale: Product.CategorySaleAttrItem;
    specs: Product.CategorySaleSpecItem[];
}

export interface SaleState {
    checked: number[]; // 选中的 specId
    attrs: Product.ProductSkuAttr[];
}

export interface SpuForm {
    spu: Product.ProductSpuItem;
    sales: Record<number, SaleState>;
}