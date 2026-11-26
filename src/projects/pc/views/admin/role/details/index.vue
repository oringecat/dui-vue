<template>
    <app-dialog :title="authTitle" :show="show">
        {{ record }}
    </app-dialog>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import AppDialog from '@pc/components/ui/dialog/index.vue'

const props = defineProps<{
    authTitle: string
    record?: User.AdminRoleItem
}>()

const show = shallowRef(true)
</script>