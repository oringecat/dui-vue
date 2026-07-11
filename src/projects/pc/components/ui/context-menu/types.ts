/**
 * 右键菜单
 */
export interface ContextMenuState<T> {
    x: number;
    y: number;
    index: number;
    row: T;
}

/**
 * 右键菜单项
 */
export interface ContextMenuItem<T> {
    code: string;
    title: string;
    icon?: string;
    className?: string;
    disabled: (state: ContextMenuState<T>) => boolean;
    visibility: (state: ContextMenuState<T>) => boolean;
    onClick: (state: ContextMenuState<T>) => void;
}