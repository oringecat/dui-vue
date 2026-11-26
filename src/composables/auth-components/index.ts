import { shallowRef, shallowReactive, computed, defineAsyncComponent, toRaw, h, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { findTreeNodeById } from '@/helpers/filters'
import { useAuthStore, AuthType, type AuthRoute } from '@/stores/auth'
import type { ContextMenuState, ContextMenuItem } from '@pc/components/ui/context-menu/types'
import type { AuthComponentsOptions, ActionItem, RowContext, RowArgs } from './types'

// 动态权限组件
export function useAuthComponents<T extends object>(options: Partial<AuthComponentsOptions<T>> = {}) {
    const route = useRoute()
    const authStore = useAuthStore()
    const authCode = options.authCode ?? String(route.name)

    const { children = [] } = findTreeNodeById(authStore.userAuth, authCode, { id: 'code' }) ?? {}

    const viewComponents = children.filter(({ authType }) => authType === AuthType.Component)

    const actions = children.filter(({ authType }) => authType === AuthType.Action)

    const usedCodes = shallowReactive(new Set<string>()) // 缓存已被占用的 actions

    const actionComponent = shallowRef<Component>()

    // 解析标题
    const resolveTitle = ({ code, title }: AuthRoute, ...ctx: RowArgs<T>) => {
        const action = options.rowActions?.[code] ?? {}

        if (typeof action.title === 'function') {
            return ctx.length ? action.title(...ctx) : title
        }

        return action.title ?? title
    }

    // 创建组件
    const createComponent = (auth: AuthRoute, ...ctx: RowArgs<T>) => {
        if (auth.component) {
            const asyncComponent = defineAsyncComponent(auth.component)

            actionComponent.value = h(asyncComponent, {
                authCode: auth.code,
                authTitle: resolveTitle(auth, ...ctx),
                record: toRaw(ctx[0]),
                onClosed: (refresh: boolean) => {
                    actionComponent.value = undefined
                    if (refresh) options.onClosed?.(auth.code)
                }
            })
        } else {
            console.warn(auth.code, '组件未定义')
        }
    }

    // 打开组件
    const openComponent = (code: string, ...ctx: RowArgs<T>) => {
        const target = actions.find((a) => a.code === code) ?? {
            code,
            title: code,
            authType: AuthType.Action,
            component: options.customComponents?.[code]
        }
        createComponent(target, ...ctx)
    }

    const hasAction = (code: string) => {
        return actions.some((action) => action.code === code)
    }

    const getActions = (codes: string | string[], ...ctx: RowArgs<T>) => {
        const actionCodes = Array.isArray(codes) ? codes : [codes]

        return actions.reduce<ActionItem[]>((result, a) => {
            if (actionCodes.includes(a.code)) {
                const { onClick, disabled } = options.rowActions?.[a.code] ?? {}

                result.push({
                    code: a.code,
                    title: resolveTitle(a),
                    icon: a.icon,
                    className: a.className,
                    disabled: ctx.length ? disabled?.(...ctx) : false,
                    onClick: () => {
                        const handled = ctx.length && onClick ? onClick(...ctx) : true

                        if (handled instanceof Promise) {
                            handled.then(() => createComponent(a, ...ctx))
                        } else if (handled) {
                            createComponent(a, ...ctx)
                        }
                    }
                })
                
                usedCodes.add(a.code)
            }
            return result
        }, [])
    }

    const contextMenus = computed(() => {
        const filtered = actions.filter(({ code }) => !usedCodes.has(code))

        return filtered.reduce<ContextMenuItem<T>[]>((result, a) => {
            const { onClick, visibility, disabled } = options.rowActions?.[a.code] ?? {}

            result.push({
                code: a.code,
                title: (state) => resolveTitle(a, state.row, state.index),
                icon: a.icon,
                className: a.className,
                onClick: ({ row, index }) => {
                    const handled = onClick ? onClick(row, index) : true

                    if (handled instanceof Promise) {
                        handled.then(() => createComponent(a, row, index))
                    } else if (handled) {
                        createComponent(a, row, index)
                    }
                },
                visibility: (state) => visibility?.(state.row, state.index) ?? true,
                disabled: (state) => disabled?.(state.row, state.index) ?? false,
            })

            return result
        }, [])
    })

    const hasRestAction = computed(() => contextMenus.value.length > 0)

    // 获取剩余权限组件
    const getRestActions = (...ctx: RowContext<T>) => {
        const [row, index] = ctx
        const state: ContextMenuState<T> = { x: 0, y: 0, row, index }

        return contextMenus.value.reduce<ActionItem[]>((result, { title, onClick, disabled, visibility, ...rest }) => {
            // 排除隐藏项
            if (visibility(state)) {
                result.push({
                    ...rest,
                    title: title(state),
                    disabled: disabled(state),
                    onClick: () => onClick(state)
                })
            }
            return result
        }, [])
    }

    return {
        viewComponents,
        actionComponent,
        contextMenus,
        hasRestAction,
        hasAction,
        getActions,
        getRestActions,
        openComponent
    }
}