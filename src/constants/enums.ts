export enum AttributeValueType {
    Enum = 1, // 枚举值
    Text = 2, // 文本
    Number = 3, // 数值
}

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