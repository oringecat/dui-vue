<template>
  <el-form ref="formRef" class="el-form--filter" :rules="formRules" :show-message="false">
    <slot name="before"></slot>
    <template v-for="(item, index) in options.filters" :key="index">
      <template v-if="item.visibility?.() ?? true">
        <slot :name="getFieldName(item.field)" :item="item">
          <el-form-item :label="item.label" :prop="getFieldName(item.field)">
            <el-select :placeholder="item.placeholder ?? '请选择'" v-model="item.value" :multiple="item.multiple"
              collapse-tags clearable @change="item.onChange" :style="handleStyle(item.width)" v-if="item.options">
              <el-option v-for="option in item.options()" :key="option.value" :value="option.value"
                :label="option.label" />
            </el-select>
            <el-input :placeholder="item.placeholder ?? '请输入'" v-model="item.value" :style="handleStyle(item.width)"
              v-else />
          </el-form-item>
        </slot>
      </template>
    </template>
    <slot name="after"></slot>
    <el-form-item v-if="options.buttons.length">
      <template v-for="(item, index) in options.buttons" :key="index">
        <el-button :class="item.className" :disabled="loading" @click="handleButtonClick(item)">
          {{ item.label }}
        </el-button>
      </template>
    </el-form-item>
    <slot></slot>
  </el-form>
</template>

<script lang="ts" generic="T extends Record<string, any>" setup>
import { shallowRef, computed, nextTick, type PropType, type VNode } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { FormOptions, FormButton, FilterField } from '@/composables/datatable/types'

// 声明 slot 类型
defineSlots<{
  [K in keyof T]: (props: { item: FilterField<T, K> }) => VNode[]
} & {
  before?: () => VNode[]
  after?: () => VNode[]
  default?: () => VNode[]
}>()

const props = defineProps({
  options: {
    type: Object as PropType<FormOptions<T>>,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Object as PropType<FormRules>,
    default: () => ({})
  }
})

const emit = defineEmits(['submit'])

const formRef = shallowRef<FormInstance>()

// 表单验证规则
const formRules = computed<FormRules>(() => {
  const rules = { ...props.rules }
  props.options.filters.forEach(({ field, required }) => {
    if (required) {
      rules[getFieldName(field)] = [{ required }]
    }
  })
  return rules
})

const getFieldName = (field: string | (keyof T)[]) => {
  return Array.isArray(field) ? field.join('-') : field
}

const handleStyle = (width?: number) => {
  const style: Partial<CSSStyleDeclaration> = {}
  if (width) {
    style.width = width + 'px'
  }
  return style
}

const handleButtonClick = async ({ reset, refresh = true, buildQueryParams }: FormButton) => {
  await buildQueryParams()

  if (reset) formRef.value?.clearValidate()

  if (refresh) {
    nextTick(() => {
      formRef.value?.validate((isValid) => {
        if (isValid) emit('submit')
      })
    })
  }
}

// 导出表单实例
defineExpose({
  formInstance: formRef
})
</script>