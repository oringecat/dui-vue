import { shallowReactive, toRefs } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { showConfirmDialog } from 'vant'
import type { ComponentManagerOptions } from './types'

function createComponentManager() {
    // 组件关闭回调集合
    const closeActions = new Map<symbol, () => Promise<void>>()

    return (options: Partial<ComponentManagerOptions> = {}) => {
        const { destroyOnClose = true, confirmMessage } = options

        const key = Symbol()

        const state = shallowReactive({
            componentId: '', // 当前组件实例
            componentProps: {},
            showComponent: false
        })

        const handleClose = () => {
            if (closeActions.has(key)) {
                state.showComponent = false
                closeActions.delete(key)
            }
        }

        const openComponent = <T extends object>(componentName: string, props?: T) => {
            //console.log('打开组件', componentName)
            state.componentId = componentName
            state.componentProps = props ?? {}
            state.showComponent = true

            // 注册当前组件关闭回调
            closeActions.set(key, async () => {
                const message = typeof confirmMessage === 'function' ? confirmMessage(componentName) : confirmMessage
                if (message) {
                    await showConfirmDialog({
                        message,
                        closeOnPopstate: false
                    })
                }
                handleClose()
            })
        }

        const closeComponent = () => {
            //console.log('关闭组件', componentId.value)
            if (destroyOnClose) {
                state.componentId = ''
                state.componentProps = {}
            }
            handleClose()
        }

        // 只会在页面回退时生效
        onBeforeRouteLeave(() => {
            if (state.showComponent) {
                const lastAction = [...closeActions.values()].at(-1)
                lastAction?.()
                return false
            } else {
                closeActions.clear()
                return true
            }
        })

        return {
            openComponent,
            closeComponent,
            ...toRefs(state)
        }
    }
}

export const useComponent = createComponentManager()