import { emptyText } from '@/constants/common'

/**
 * 创建 label 获取函数
 * @param options 
 * @returns 
 */
export function createLabelGetter(options: Readonly<Common.SelectOption[]>) {
    const labelMap = new Map(options.map((item) => [String(item.value), item.label]))
    return (value: unknown, fallback = emptyText) => labelMap.get(String(value)) ?? fallback
}