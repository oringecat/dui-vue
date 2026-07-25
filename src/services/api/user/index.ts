import http from '@/services/http'
import type { ApiOptions } from '@/services/http/types'

/**
 * 用户登录
 */
export function createLogin(options?: ApiOptions<{ req: User.LoginParams; res: User.UserInfo; }>) {
  return http.createRequest({
    method: 'POST',
    url: '/user/login',
    options
  })
}

/**
 * 用户登出
 */
export function createLogout(options?: ApiOptions) {
  return http.createRequest({
    method: 'POST',
    url: '/user/logout',
    options
  })
}

/**
 * 令牌校验
 */
export function createCheckToken(options?: ApiOptions<{ res: User.UserInfo; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/user/checktoken',
    options
  })
}

/**
 * 获取用户权限
 */
export function createUserAuths(options?: ApiOptions<{ res: string[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/user/auths',
    options
  })
}