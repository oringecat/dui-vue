// 销售属性模板
export interface SaleTemplate {
    sale: Product.CategorySale;
    attribute: Attribute.AttributeItem;
    checked: number[]; // 选中的 valueId
    specs: Product.ProductSpec[];
}