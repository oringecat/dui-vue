<template>
    <el-dialog v-model="visible" @closed="onClosed">
        <slot></slot>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary">提交</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { shallowRef, onMounted, watch } from 'vue'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:show', 'closed'])

const visible = shallowRef(false)

const updateShow = () => {
    visible.value = props.show
}

const onClosed = () => {
    emit('closed')
}

watch(() => props.show, updateShow)

watch(visible, (val) => emit('update:show', val))

onMounted(updateShow)
</script>