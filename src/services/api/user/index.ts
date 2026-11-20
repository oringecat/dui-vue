import http from '@/services/http'
import type { ApiOptions } from '@/services/http/types'

/**
 * 用户登录
 */
export function createLogin(options?: ApiOptions<{ req: User.LoginRequest; res: User.LoginInfo; }>) {
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
export function createCheckToken(options?: ApiOptions<{ res: User.LoginInfo; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/user/checktoken',
    options
  })
}

/**
 * 获取用户权限
 */
export function createUserAuth(options?: ApiOptions<{ res: string[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/user/auth',
    options
  })
}

/**
 * 获取同级及子级管理员列表
 */
export function createAdminList(options?: ApiOptions<{ req: User.AdminListRequest; res: User.AdminListItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/admin/list',
    options
  })
}

/**
 * 获取同级管理员角色列表
 */
export function createAdminRoleList(options?: ApiOptions<{ req: User.AdminRoleRequest; res: User.AdminRoleItem[]; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/admin/role',
    options
  })
}

/**
 * 获取管理员角色详情
 */
export function createAdminRoleDetail(options?: ApiOptions<{ req: User.AdminRoleDetailRequest; res: User.AdminRoleDetail; }>) {
  return http.createRequest({
    method: 'GET',
    url: '/admin/role/detail',
    options
  })
}