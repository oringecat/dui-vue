import type { AsyncComponentLoader } from 'vue'

export type RowContext<T> = [row: T, index?: number]

/** 可选参数 */
export type RowArgs<T> = [] | RowContext<T>

export interface AuthComponentsOptions<T> {
    authCode: string;
    rowActions: Record<string, {
        title?: string | ((...ctx: RowContext<T>) => string);
        disabled?: (...ctx: RowContext<T>) => boolean;
        visibility?: (...ctx: RowContext<T>) => boolean;
        onClick?: (...ctx: RowContext<T>) => boolean | void | Promise<void>;
    }>;
    customComponents: Record<string, AsyncComponentLoader>; // 注册自定义组件
    onClosed: (code: string) => void;
}

export interface ActionItem {
    code: string;
    title: string;
    icon?: string;
    className?: string;
    disabled?: boolean;
    onClick: () => void;
}