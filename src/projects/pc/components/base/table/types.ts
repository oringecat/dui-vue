export interface TableOptions<T> {
    columns: TableColumn<T>[];
}

/**
 * 表格字段
 */
export interface TableField<T, K extends keyof T> {
    field: K | (string & {});
    label: string | (() => string);
    className?: string;
    align?: string;
    width?: number;
    sortable?: boolean;
    show?: boolean;
    decimal?: number; // 保留小数点位数
    formatValue?: (row: T) => unknown
}

/**
 * 表格列
 */
export type TableColumn<T> = {
    [K in keyof T]: TableField<T, K>
}[keyof T & string]