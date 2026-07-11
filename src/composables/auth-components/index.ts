import { shallowRef, shallowReactive, computed, defineAsyncComponent, h, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { findTreeNodeById } from '@/helpers/filters'
import { useAuthStore } from '@/stores/auth'
import { AuthType, type AuthRoute } from '@/stores/auth/types'
import type { ContextMenuState, ContextMenuItem } from '@pc/components/ui/context-menu/types'
import type { AuthComponentsOptions, ActionItem } from './types'

// 动态权限组件
export function useAuthComponents<T extends object>(options: Partial<AuthComponentsOptions<T>> = {}) {
    const route = useRoute()
    const authStore = useAuthStore()
    const authCode = options.authCode ?? String(route.name)

    const { children = [] } = findTreeNodeById(authStore.userAuths, authCode, { id: 'code' }) ?? {}

    const viewComponents = children.filter(({ authType }) => authType === AuthType.Component)

    const actions = children.filter(({ authType }) => authType === AuthType.Action)

    const usedCodes = shallowReactive(new Set<string>()) // 缓存已被占用的 actions

    const showComponent = shallowRef(false)
    const currentComponent = shallowRef<Component>()

    // 打开组件
    const openComponent = ({ code, component }: AuthRoute, row?: T) => {
        if (component) {
            const asyncComponent = defineAsyncComponent(component)
            showComponent.value = true

            // 创建组件
            currentComponent.value = h(asyncComponent, {
                show: showComponent.value,
                selectedRow: row,
                onClosed: () => {
                    showComponent.value = false
                    options.onClosed?.(code)
                }
            })
        } else {
            console.warn(code, '组件未定义')
        }
    }

    const getActions = (...codes: string[]) => {
        return actions.reduce<ActionItem[]>((result, a) => {
            if (codes.includes(a.code)) {
                result.push({
                    code: a.code,
                    title: a.title,
                    icon: a.icon,
                    onClick: () => openComponent(a)
                })
                usedCodes.add(a.code)
            }
            return result
        }, [])
    }

    const contextMenus = computed(() => {
        const filtered = actions.filter(({ code }) => !usedCodes.has(code))

        return filtered.reduce<ContextMenuItem<T>[]>((result, a) => {
            const { onClick, visibility, disabled } = options.actions?.[a.code] ?? {}

            result.push({
                code: a.code,
                title: a.title,
                icon: a.icon,
                onClick: ({ row, index }) => {
                    onClick?.(row, index)
                    openComponent(a, row)
                },
                visibility: (state) => visibility?.(state.row, state.index) ?? true,
                disabled: (state) => disabled?.(state.row, state.index) ?? false,
            })

            return result
        }, [])
    })

    const getRowActions = (row: T, index: number) => {
        const state: ContextMenuState<T> = { x: 0, y: 0, index, row }

        return contextMenus.value.reduce<ActionItem[]>((result, { onClick, disabled, visibility, ...rest }) => {
            // 排除隐藏项
            if (!(visibility(state) ?? true)) {
                return result
            }

            result.push({
                ...rest,
                disabled: disabled(state),
                onClick: () => onClick(state)
            })

            return result
        }, [])
    }

    const hasRowAction = computed(() => contextMenus.value.length > 0)

    return {
        viewComponents,
        currentComponent,
        contextMenus,
        hasRowAction,
        getActions,
        getRowActions
    }
}