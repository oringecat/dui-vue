// 销售属性模板
export interface SaleTemplate {
    sale: Product.CategorySaleAttrItem;
    specs: Product.CategorySaleSpecItem[];
    checked: number[]; // 选中的 specId
    attrs: Product.ProductSkuAttr[];
}