<template>
    <app-dialog :show="show">
        {{ record }}
    </app-dialog>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import AppDialog from '@pc/components/ui/dialog/index.vue'

const props = defineProps<{
    record: Product.CategoryItem
}>()

const show = shallowRef(true)
</script>