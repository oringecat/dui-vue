import http from '@/services/http'
import type { RequestOptions, BaseResponse } from '@/services/http/types'

/**
 * 获取订单列表
 */
export function createOrderList(options?: RequestOptions<{ req: Order.OrderListParams; res: BaseResponse<Order.OrderListItem[]>; }>) {
  return http.createRequest('GET', '/api/order/list', options)
}