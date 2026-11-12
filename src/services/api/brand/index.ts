import http from '@/services/http'
import type { ApiOptions } from '@/services/http/types'

/**
 * 获取品牌列表
 */
export function createBrandList(options?: ApiOptions<{ req: Brand.BrandListRequest; res: Brand.BrandListItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/brand/list',
    options
  })
}

/**
 * 获取分类列表
 */
export function createCategoryList(options?: ApiOptions<{ req: Brand.CategoryListRequest; res: Brand.CategoryItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/brand/category',
    options
  })
}