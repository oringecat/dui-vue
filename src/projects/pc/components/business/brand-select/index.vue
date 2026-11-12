<template>
    <app-remote-select v-model="selectedValue" :options="brandList" :option-props="{ label: 'brandName', value: 'id' }"
        :loading="loading" :remote-method="remoteMethod" @reset="onReset" @change="onChange">
    </app-remote-select>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import { createBrandList } from '@/services/api/brand'
import AppRemoteSelect from '@pc/components/ui/remote-select/index.vue'

const props = defineProps<{
    params?: Partial<Brand.BrandListRequest>
}>()

const emit = defineEmits<{
    change: [item?: Brand.BrandListItem]
}>()

const selectedValue = defineModel<number>()

const brandList = shallowRef<Brand.BrandListItem[]>([])

const { loading, fetch } = createBrandList({
    manual: true,
    data: {
        pageIndex: 1,
        pageSize: 10,
        ...props.params
    },
    onSuccess: (res) => {
        brandList.value = res.data

        if (!res.data.some(({ id }) => id === selectedValue.value)) {
            selectedValue.value = undefined
            emit('change')
        }
    }
})

const onChange = (value?: number) => {
    const item = brandList.value.find(({ id }) => id === value)
    emit('change', item)
}

const onReset = (id?: number) => {
    selectedValue.value = id
    fetch({
        ...props.params,
        id
    })
}

const remoteMethod = (query: string) => {
    if (query) {
        fetch({
            ...props.params,
            brandName: query
        })
    }
}

defineExpose({
    onReset
})
</script>