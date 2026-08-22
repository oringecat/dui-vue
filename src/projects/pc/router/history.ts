import { reactive, computed, toRefs } from 'vue'
import { createRouter } from 'vue-router'
import { defineStore } from 'pinia'
import type { RouterOptions, RouteLocationRaw, RouteLocationNormalized } from 'vue-router'
import type { HistoryRoute, HistoryState } from './types'

export const useHistoryStore = defineStore('history', () => {
  const sessionKey = 'historys_' + (import.meta.env.PROJECT_ID || 'pc')

  const state = reactive<HistoryState>({
    historys: [], // 路由历史栈
    excludes: [], // 不缓存的视图
    actionName: '', // 当前路由动作
    currentName: '', // 当前路由名称
  })

  const sessionData = sessionStorage.getItem(sessionKey)

  if (sessionData) {
    const sessionHistorys = JSON.parse(sessionData) as HistoryRoute[]
    state.historys = sessionHistorys
  }

  const currentIndex = computed(() => state.historys.findIndex((e) => e.name === state.currentName))

  const updateHistorys = () => {
    sessionStorage.setItem(sessionKey, JSON.stringify(state.historys))
  }

  // 创建路由
  const create = (options: RouterOptions) => {
    const router = createRouter(options)
    const { push, replace, go, forward, back } = router

    // 跳转
    router.push = (to: RouteLocationRaw) => {
      if (to.replace === true) {
        state.actionName = 'push-replace'
      } else {
        state.actionName = 'push'
      }
      return push(to)
    }

    // 替换
    router.replace = (to: RouteLocationRaw) => {
      state.actionName = 'replace'
      return replace(to)
    }

    // 前进后退
    router.go = (delta: number) => {
      if (delta > 0) {
        state.actionName = 'forward'
      }
      if (delta < 0) {
        state.actionName = 'back'
      }
      go(delta)
    }

    // 前进
    router.forward = () => {
      state.actionName = 'forward'
      forward()
    }

    // 后退
    router.back = () => {
      state.actionName = 'back'
      back()
    }

    router.beforeResolve((to) => {
      addHistory(to)
    })

    router.afterEach(() => {
      state.excludes = []
    })

    return router
  }

  // 添加历史记录
  const addHistory = (route: RouteLocationNormalized) => {
    const newHistory = {
      name: route.name?.toString() || route.path,
      title: route.meta.title as string ?? '标签页',
      fullPath: route.fullPath,
      redirected: !!route.redirectedFrom
    }

    const targetIndex = state.historys.findIndex((e) => e.name === newHistory.name)

    if (targetIndex > -1) {
      state.historys[targetIndex] = newHistory
    } else {
      if (state.actionName === 'replace') {
        const lastIndex = state.historys.length - 1
        const lastItem = state.historys[lastIndex]

        if (lastItem) {
          state.excludes.push(lastItem.name as string)
          state.historys[lastIndex] = newHistory // 更新最后一条记录
        } else {
          state.historys.push(newHistory)
        }
      } else {
        // 忽略重定向的页面
        if (!newHistory.redirected) {
          state.historys.push(newHistory)
        }
      }
    }

    state.actionName = ''
    state.currentName = newHistory.name
    updateHistorys()
  }

  // 移除历史记录
  const removeHistory = (routeName?: string) => {
    if (routeName) {
      const index = state.historys.findIndex((e) => e.name === routeName)
      state.excludes.push(routeName)

      if (index > -1) {
        state.historys.splice(index, 1)
        updateHistorys()
      }
    } else {
      state.historys = [] // 待优化，清除缓存
      updateHistorys()
    }
  }

  // 移除其他历史记录
  const removeOtherHistorys = () => {
    const target = state.historys[currentIndex.value]
    if (target) {
      state.excludes = state.historys.filter((e) => e.name !== state.currentName).map((e) => e.name)
      state.historys = [target]
      updateHistorys()
    }
  }

  // 移除左侧历史记录
  const removeLeftHistorys = () => {
    if (currentIndex.value > 0) {
      const removed = state.historys.splice(0, currentIndex.value)
      state.excludes.push(...removed.map((e) => e.name))
      updateHistorys()
    }
  }

  // 移除右侧历史记录
  const removeRightHistorys = () => {
    if (currentIndex.value > -1 && currentIndex.value < state.historys.length - 1) {
      const removed = state.historys.splice(currentIndex.value + 1)
      state.excludes.push(...removed.map((e) => e.name))
      updateHistorys()
    }
  }

  return {
    currentIndex,
    create,
    removeHistory,
    removeOtherHistorys,
    removeLeftHistorys,
    removeRightHistorys,
    ...toRefs(state)
  }
})