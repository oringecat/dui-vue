<template>
    <app-dialog>
        {{ selectedRow }}
    </app-dialog>
</template>

<script lang="ts" setup>
import AppDialog from '@pc/components/ui/dialog/index.vue'

const props = defineProps<{
    selectedRow: Order.ListItem
}>()
</script>