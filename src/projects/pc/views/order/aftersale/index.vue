<template>
    <pc-view>{{ authCode }}</pc-view>
</template>

<script lang="ts" setup>
const props = defineProps<{
    authCode: string
}>()
</script>