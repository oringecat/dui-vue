import type { ColumnAlignment } from 'element-plus'

export interface TableOptions<T> {
    columns: TableColumn<T>[];
}

/**
 * 表格字段
 */
export interface ColumnField<T, K extends keyof T> {
    field: K | (string & {});
    label: string | (() => string);
    className?: string;
    align?: ColumnAlignment;
    width?: number;
    sortable?: boolean;
    show?: boolean;
    decimal?: number; // 保留小数点位数
    fixed?: boolean | 'left' | 'right';
    formatValue?: (row: T) => unknown
}

/**
 * 表格列
 */
export type TableColumn<T> = {
    [K in keyof T]: ColumnField<T, K>
}[keyof T & string]