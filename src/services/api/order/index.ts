import http from '@/services/http'
import type { ApiOptions } from '@/services/http/types'

/**
 * 获取订单列表
 */
export function createOrderList(options?: ApiOptions<{ req: Order.OrderListParams; res: Order.OrderListItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/order/list',
    options
  })
}