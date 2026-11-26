<template>
    <app-dialog class="attribute-edit" :title="authTitle" :width="600" :show="show" @closed="emit('closed', refresh)">
        <el-form class="el-form--vertical" :model="formData" label-width="auto">
            <el-form-item label="所在分组">
                <el-select ref="selectRef" v-model="formData.groupId" :empty-values="[0]" :value-on-clear="0" filterable
                    clearable placeholder="请选择">
                    <template #header>
                        <el-button text bg size="small" @click="openView">管理</el-button>
                    </template>
                    <el-option v-for="option in attributeStore.attributeGroups" :key="option.id" :value="option.id"
                        :label="option.name" />
                </el-select>
            </el-form-item>
            <el-form-item label="属性名称">
                <el-input v-model="formData.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="支持多选">
                <el-switch v-model="formData.multiple" />
            </el-form-item>
            <el-form-item label="属性枚举">
                <app-input-tag v-model="tagValues" tag-type="primary" tag-effect="light" size="large"
                    placeholder="请输入后按回车键" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="onSubmit">提交</el-button>
        </template>
        <component :is="components[componentId]" @closed="closeComponent" />
    </app-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, defineAsyncComponent, type Component } from 'vue'
import { useComponent } from '@/composables/component'
import { useAttributeStore } from '@/stores/attribute'
import type { SelectInstance } from 'element-plus'
import AppDialog from '@pc/components/ui/dialog/index.vue'
import AppInputTag from '@pc/components/ui/input-tag/index.vue'

const props = defineProps<{
    authTitle: string
    record: Attribute.AttributeItem
}>()

const emit = defineEmits<{ closed: [boolean] }>()

const components: Record<string, Component> = {
    group: defineAsyncComponent(() => import('./group/index.vue'))
}

const { componentId, openComponent, closeComponent } = useComponent()

const attributeStore = useAttributeStore()

const show = ref(true)
const refresh = ref(false)
const selectRef = ref<SelectInstance>()

const formData = ref<Attribute.AttributeItem>({
    id: 0,
    name: '',
    groupId: 0,
    values: [],
    multiple: false,
    updateTime: 0
})

const toValue = (value: string) => formData.value.values.find((item) => item.value === value) ?? { id: 0, value }

const tagValues = computed({
    get: () => formData.value.values.map(({ value }) => value),
    set: (values) => formData.value.values = values.map(toValue)
})

const openView = () => {
    selectRef.value?.blur()
    openComponent('group')
}

const onSubmit = () => {
    show.value = false
    refresh.value = true
}

onMounted(() => {
    if (props.record) {
        formData.value = { ...props.record }
    }
})
</script>