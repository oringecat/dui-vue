import type { AsyncComponentLoader } from 'vue'

/**
 * 权限路由
 */
export interface AuthRoute {
    code: string;
    title: string;
    authType: AuthType;
    url?: string;
    component?: AsyncComponentLoader;
    icon?: string;
    remark?: string;
    children?: AuthRoute[];
}

/**
 * 权限类型
 */
export enum AuthType {
    Route = 1, // 路由
    Component = 2, // 组件
    Action = 3, // 动作
    Link = 4, // 外链
    Iframe = 5, // 内联框架
}