import http, { type ApiOptions } from '@/services/http'

/**
 * 获取商品列表
 */
export function createProductList(options?: ApiOptions<{ req: Product.ProductListRequest; res: Product.ProductListItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/list',
    options
  })
}

/**
 * 获取商品详情
 */
export function createProductDetail(options?: ApiOptions<{ req: Product.ProductDetailRequest; res: Product.ProductDetail; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/detail',
    options
  })
}

/**
 * 新增/更新商品
 */
export function createProductUpdate(options?: ApiOptions<{ req: Partial<Product.ProductDetail>; }>) {
  return http.createRequest({
    method: 'post',
    url: '/product/update',
    options
  })
}

/**
 * 获取分类列表
 */
export function createCategoryList(options?: ApiOptions<{ req: Product.CategoryListRequest; res: Product.CategoryItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/category',
    options
  })
}

/**
 * 获取销售属性列表
 */
export function createCategorySaleAttrList(options?: ApiOptions<{ req: Product.CategorySaleAttrListRequest; res: Product.CategorySaleAttrItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/category/sale-attribute',
    options
  })
}

/**
 * 获取销售规格列表
 */
export function createCategorySaleSpecList(options?: ApiOptions<{ req: Product.CategorySaleSpecListRequest; res: Product.CategorySaleSpecItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/category/sale-spec',
    options
  })
}