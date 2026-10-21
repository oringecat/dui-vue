import http from '@/services/http'
import type { ApiOptions, BaseResponse } from '@/services/http/types'

/**
 * 获取服务器时间
 */
export function createServerTime(options?: ApiOptions<{ res: number; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/server/time',
    options
  })
}

/**
 * 获取属性列表
 */
export function createAttributeList(options?: ApiOptions<{ req: Attribute.AttributeListRequest; res: Attribute.AttributeItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/attribute/list',
    options
  })
}

/**
 * 获取属性分组列表
 */
export function createAttributeGroupList(options?: ApiOptions<{ res: Attribute.AttributeGroup[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/attribute/group/list',
    options
  })
}

/**
 * 新增/更新属性
 */
export function createAttributeUpdate(options: ApiOptions<{ req: Attribute.AttributeItem; }>) {
  return http.createRequest({
    method: 'POST',
    url: '/attribute/update',
    options
  })
}

/**
 * 文件上传
 */
export function uploadFile(file: File) {
  const data = new FormData()
  data.append('file', file)

  return http.request<BaseResponse<Common.UploadFile>>({
    method: 'POST',
    url: '/file/upload',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}