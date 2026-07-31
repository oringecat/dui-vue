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
export function createProductUpdate(options: ApiOptions<{ req: Product.ProductDetail; }>) {
  return http.createRequest({
    method: 'POST',
    url: '/product/update',
    options
  })
}

/**
 * 获取标准商品化单元列表
 */
export function createProductSpuList(options: ApiOptions<{ req: Product.ProductSpuListRequest; res: Product.ProductSpuItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/spu/list',
    options
  })
}

/**
 * 新增/更新标准商品化单元
 */
export function createProductSpuUpdate(options: ApiOptions<{ req: Product.ProductSpuItem[]; }>) {
  return http.createRequest({
    method: 'POST',
    url: '/product/spu/update',
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
 * 获取分类基础属性列表
 */
export function createCategoryAttrList(options?: ApiOptions<{ req: Product.CategoryAttrListRequest; res: Product.CategoryAttrItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/category/attribute',
    options
  })
}

/**
 * 获取分类销售属性列表
 */
export function createCategorySaleAttrList(options?: ApiOptions<{ req: Product.CategorySaleAttrListRequest; res: Product.CategorySaleAttrItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/category/sale-attribute',
    options
  })
}

/**
 * 获取分类销售规格列表
 */
export function createCategorySaleSpecList(options?: ApiOptions<{ req: Product.CategorySaleSpecListRequest; res: Product.CategorySaleSpecItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/product/category/sale-spec',
    options
  })
}