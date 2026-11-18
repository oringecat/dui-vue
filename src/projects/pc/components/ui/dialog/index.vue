<template>
    <el-dialog ref="dialogRef" class="dui-dialog" v-model="visible" :width="width" :close-on-click-modal="false"
        :close-on-press-escape="false" align-center @closed="onClosed">
        <slot></slot>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <slot name="footer"></slot>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { shallowRef, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElLoading, type DialogInstance, type LoadingInstance } from 'element-plus'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    width: {
        type: [String, Number],
        default: 'auto'
    }
})

const emit = defineEmits(['update:show', 'closed'])

const dialogRef = shallowRef<DialogInstance>()
const loadingRef = shallowRef<LoadingInstance>()
const visible = shallowRef(false)

const updateShow = () => {
    visible.value = props.show
}

const onClosed = () => {
    emit('closed')
}

watch(() => props.show, updateShow)

watch(visible, (val) => emit('update:show', val))

watch(() => props.loading, (status) => nextTick(() => {
    const target = dialogRef.value?.dialogContentRef?.$el

    if (status) {
        loadingRef.value = ElLoading.service({ target })
    } else {
        loadingRef.value?.close()
    }
}), { immediate: true })

onMounted(() => updateShow())
onBeforeUnmount(() => loadingRef.value?.close())
</script>

<style lang="less">
@import './index.less';
</style>