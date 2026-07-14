<template>
    <template v-for="(item, index) in menus" :key="index">
        <el-sub-menu :index="item.code" :show-timeout="100" :hide-timeout="100" v-if="item.children?.length">
            <template #title>
                <!--如果没有图标，用标题第一个字代替-->
                <template v-if="item.icon">
                    <app-icon class="menu-icon" :icon="item.icon" />
                    <span>{{ item.title }}</span>
                </template>
                <template v-else>
                    <i class="menu-icon menu-icon--text">{{ item.title.slice(0, 1) }}</i>
                    <span>{{ item.title.slice(1) }}</span>
                </template>
            </template>
            <!--如果存在子级，递归组件自身-->
            <app-sub-menu :menus="item.children" />
        </el-sub-menu>
        <el-menu-item :index="item.code" v-else>
            <app-icon class="menu-icon" :icon="item.icon" v-if="item.icon" />
            <span>{{ item.title }}</span>
        </el-menu-item>
    </template>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { AuthRoute } from '@/stores/auth/types'
import AppIcon from '@pc/components/ui/icon/index.vue'

export default defineComponent({
    name: 'AppSubMenu',
    components: {
        AppIcon
    },
    props: {
        menus: {
            type: Array as PropType<AuthRoute[]>,
            required: true
        }
    }
})
</script>