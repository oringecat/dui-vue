import http from '@/services/http'
import type { RequestOptions, BaseResponse } from '@/services/http/types'

/**
 * 获取商品列表
 */
export function createProductList(options?: RequestOptions<{ req: Product.ProductListParams; res: BaseResponse<Product.ProductListItem[]>; }>) {
  return http.createRequest('GET', '/api/product/list', options)
}

/**
 * 获取分类列表
 */
export function createCategoryList(options?: RequestOptions<{ req: Product.CategoryListParams; res: BaseResponse<Product.CategoryItem[]>; }>) {
  return http.createRequest('GET', '/api/product/category', options)
}

/**
 * 获取销售属性列表
 */
export function createCategorySaleAttrList(options?: RequestOptions<{ req: Product.CategorySaleAttrListParams; res: BaseResponse<Product.CategorySaleAttrItem[]>; }>) {
  return http.createRequest('GET', '/api/product/category/sale-attribute', options)
}

/**
 * 获取销售规格列表
 */
export function createCategorySaleSpecList(options?: RequestOptions<{ req: Product.CategorySaleSpecListParams; res: BaseResponse<Product.CategorySaleSpecItem[]>; }>) {
  return http.createRequest('GET', '/api/product/category/sale-spec', options)
}