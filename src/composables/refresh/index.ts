import { shallowRef, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import eventBus from '@/utils/bus'

export function useRefresh(callback: () => void, refreshId?: number | string) {
    const route = useRoute()
    const refreshKey = refreshId ?? route.path
    const refreshing = shallowRef(false)

    const startRefresh = () => nextTick(() => {
        refreshing.value = true
        callback()
    })

    // 手动触发下拉刷新完成事件
    const refreshFinish = () => {
        refreshing.value = false
        nextTick(() => eventBus.emit('pull-refresh-finish'))
    }

    // 监听下拉刷新事件
    const refreshListener = eventBus.on('pull-refresh-start', (key = route.path) => {
        if (key !== refreshKey) {
            nextTick(() => eventBus.emit('pull-refresh-finish'))
        } else {
            startRefresh()
        }
    })

    onUnmounted(() => refreshListener.off())

    return {
        refreshing,
        refreshFinish
    }
}