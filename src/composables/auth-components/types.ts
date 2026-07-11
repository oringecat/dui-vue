export interface AuthComponentsOptions<T> {
    authCode: string;
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