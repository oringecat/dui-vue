<template>
    <app-dialog>
        {{ selectedRow }}
    </app-dialog>
</template>

<script lang="ts" setup>
import AppDialog from '@pc/components/base/dialog/index.vue'

const props = defineProps<{
    selectedRow?: Product.ProductItem
}>()
</script>