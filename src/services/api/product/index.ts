import http, { type ApiOptions } from '@/services/http'

/**
 * 获取商品列表
 */
export function createProductList(options?: ApiOptions<{ req: Product.ProductListParams; res: Product.ProductListItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/list',
    options
  })
}

/**
 * 获取分类列表
 */
export function createCategoryList(options?: ApiOptions<{ req: Product.CategoryListParams; res: Product.CategoryItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/category',
    options
  })
}

/**
 * 获取销售属性列表
 */
export function createCategorySaleAttrList(options?: ApiOptions<{ req: Product.CategorySaleAttrListParams; res: Product.CategorySaleAttrItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/category/sale-attribute',
    options
  })
}

/**
 * 获取销售规格列表
 */
export function createCategorySaleSpecList(options?: ApiOptions<{ req: Product.CategorySaleSpecListParams; res: Product.CategorySaleSpecItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/category/sale-spec',
    options
  })
}