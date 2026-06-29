import http from '@/services/http'
import type { RequestOptions, BaseResponse } from '@/services/http/types'

/**
 * 获取订单列表
 */
export function getOrderList(options?: RequestOptions<{ req: Order.OrderParams; res: BaseResponse<Order.OrderItem[]>; }>) {
  return http.createRequest('GET', '/api/order/list', options)
}