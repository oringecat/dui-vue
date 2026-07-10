import type { ColumnAlignment, TableV2FixedDir } from 'element-plus'

/**
 * 表格字段
 */
export interface TableField<T, K extends keyof T> {
    field: K | (string & {});
    label: string | (() => string);
    className?: string;
    align?: ColumnAlignment;
    width?: number;
    sortable?: boolean;
    visibility?: boolean | (() => boolean); // 控制元素显示或隐藏
    decimal?: number; // 保留小数点位数
    fixed?: true | TableV2FixedDir;
    formatValue?: (row: T) => unknown
}

/**
 * 表格列
 */
export type TableColumn<T> = {
    [K in keyof T]: TableField<T, K>
}[keyof T & string]