import type { Method, AxiosRequestConfig } from 'axios'

export type RequestShape = { req?: object, res?: unknown }

export interface RequestConfig<T extends RequestShape = RequestShape> {
    url: string;
    method?: Method;
    options?: RequestOptions<T>;
    retryCount?: number; // 重试次数，0 = 无限次
    defaultData?: () => Partial<T['req']>;
}

export interface RequestOptions<T extends RequestShape = RequestShape> {
    manual?: boolean; // 是否手动执行
    headers?: AxiosRequestConfig['headers'];
    data?: T['req']; // 请求参数
    onSuccess?: (res: T['res']) => void;
    onError?: (err: string) => void;
    onFinally?: () => void;
}

export type ApiOptions<T extends RequestShape = RequestShape> = RequestOptions<{
    req?: T extends { req: infer R } ? R : object;
    res: BaseResponse<T['res']>
}>

/**
 * 统一响应结构
 */
export interface BaseResponse<T = unknown> {
    code: ResultCode;
    data: T;
    message: string;
    total: number;
}

// 错误响应结构
export interface ErrorResponse {
    code: ResultCode;
    message: string;
}

/**
 * 响应状态码枚举
 */
export enum ResultCode {
    Success = 200, //成功
    Error = 400, //失败
    Unauthorized = 401, //令牌无效
}