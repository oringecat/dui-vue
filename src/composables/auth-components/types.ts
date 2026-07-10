export interface AuthComponentsOptions<T> {
    parentCode: string;
    actions: Record<string, {
        disabled?: (row: T, index: number) => boolean;
        visibility?: (row: T, index: number) => boolean;
        onClick?: (row: T, index: number) => void;
    }>;
    onClosed: (code: string) => void;
}

export interface ActionItem {
    code: string;
    title: string;
    icon?: string;
    disabled?: boolean;
    onClick: () => void;
}

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