/**
 * 右键菜单
 */
export interface ContextMenuState<T> {
    x: number;
    y: number;
    row: T;
    index?: number; // 仅 table-v2 有 rowIndex
}

/**
 * 右键菜单项
 */
export interface ContextMenuItem<T> {
    code: string;
    title: (state: ContextMenuState<T>) => string;
    icon?: string;
    className?: string;
    disabled: (state: ContextMenuState<T>) => boolean;
    visibility: (state: ContextMenuState<T>) => boolean;
    onClick: (state: ContextMenuState<T>) => void;
}