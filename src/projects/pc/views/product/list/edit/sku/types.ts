export interface ProductSaleGroup {
    sale: Product.CategorySaleAttrItem;
    specs: Product.CategorySaleSpecItem[];
    checked: number[];
    attrs: Product.ProductSkuAttr[];
}