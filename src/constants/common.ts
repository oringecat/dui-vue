export const emptyText = '-'

export enum ValueType {
    Enum = 1, // 枚举值
    Text = 2, // 文本
    Number = 3, // 数值
}

export const valueTypeOptions: Readonly<Common.SelectOption[]> = [
    { label: '选项', value: ValueType.Enum },
    { label: '文本', value: ValueType.Text },
    { label: '数字', value: ValueType.Number }
]

export enum LoadMode {
    Cache = -1,   // 缓存复用不刷新
    Current = 0,  // 保持页码并刷新
    Reset = 1     // 重置页码并刷新
}

// 图片类型
export const ImageTypes: Readonly<string[]> = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/bmp'
]