/** 
 * 数据表配置项
 */
export interface DataTableOptions {
    pageSize?: number; // 每页条数
    pageIndex?: number; // 当前页码
}

/** 
 * 按钮基类
 */
export interface BaseButton {
    label: string;
    className?: string;
    reset?: boolean;  // 是否重置表单
    refresh?: boolean; // 是否立即刷新
}

/** 
 * 动作按钮
 */
export interface ActionButton<T> extends BaseButton {
    resolveParams?: (params: Partial<T>) => Partial<T> | Promise<Partial<T>>;
}

/** 
 * 表单按钮
 */
export interface FormButton extends BaseButton {
    buildQueryParams: () => void | Promise<void>;
}

/** 
 * 过滤字段
 */
export interface FilterField<T, K extends keyof T> {
    field: K | (keyof T)[];
    label?: string;
    value?: T[K];
    placeholder?: string;
    multiple?: boolean;
    required?: boolean;
    width?: number;
    visibility?: (params: Partial<T>) => boolean; // 控制元素显示或隐藏
    options?: (params: Partial<T>) => {
        label: string;
        value: NonNullable<T[K]>;
    }[];
    onChange?: (value?: T[K]) => void;
}

/**
 * 映射索引项
 */
export type FilterItem<T> = {
    [K in keyof T]: FilterField<T, K>
}[keyof T & string]

/**
 * 过滤选项
 */
export interface FilterOptions<T> {
    filters: FilterItem<T>[];
    buttons?: ActionButton<T>[];
    onReset?: () => void;
}

/**
 * 表单选项
 */
export interface FormOptions<T> {
    filters: FilterItem<T>[];
    buttons: FormButton[];
}