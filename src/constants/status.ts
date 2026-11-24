import { createLabelGetter } from '@/helpers/options'

export enum EnableStatus {
    Disabled = 0, // 禁用
    Enabled = 1, // 启用
}

export const enableStatusOptions: Readonly<Common.SelectOption[]> = [
    { label: '停用', value: EnableStatus.Disabled },
    { label: '启用', value: EnableStatus.Enabled }
]

export const getEnableStatusLabel = createLabelGetter(enableStatusOptions)