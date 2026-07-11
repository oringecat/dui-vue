<template>
    <pc-view class="order-list">
        <app-filter :options="filterOptions" :rules="filterRules" @submit="onSearch">
            <template #startTime-endTime="{ item }">
                <el-form-item :label="item.label" prop="date">
                    <el-date-picker type="daterange" v-model="dateValue" value-format="YYYY-MM-DD"
                        start-placeholder="开始日期" end-placeholder="结束日期" />
                </el-form-item>
            </template>
        </app-filter>
        <el-tabs v-model="componentId" v-if="viewComponents.length">
            <el-tab-pane v-for="{ code, title } in viewComponents" :key="code" :label="title" :name="code" />
        </el-tabs>
        <component ref="componentRef" :is="activeComponent" v-bind="{ componentId, queryParams }"
            v-if="activeComponent" />
    </pc-view>
</template>

<script lang="ts" setup>
import { shallowRef, computed, defineAsyncComponent } from 'vue'
import { type FormRules } from 'element-plus'
import { useDataFilter } from '@/composables/datatable'
import { useAuthComponents } from '@/composables/auth-components'
import AppFilter from '@pc/components/ui/form-filter/index.vue'

const { viewComponents } = useAuthComponents()

const componentRef = shallowRef()
const componentId = shallowRef(viewComponents[0]?.code)

const activeComponent = computed(() => {
    const item = viewComponents.find(({ code }) => code === componentId.value)
    return item?.component ? defineAsyncComponent(item.component) : null
})

const dateValue = shallowRef<string[]>()

// 表单验证规则
const filterRules: FormRules = {
    date: [{
        required: true,
        validator: () => dateValue.value?.length === 2
    }]
}

const { filterOptions, queryParams } = useDataFilter<Order.OrderParams>({
    filters: [
        {
            field: 'orderNumber',
            label: '订单号'
        },
        {
            field: 'status',
            label: '状态',
            options: () => [
                { label: '待付款', value: 1 },
                { label: '待发货', value: 2 },
                { label: '待收货', value: 3 },
                { label: '已完成', value: 4 }
            ]
        },
        {
            field: ['startTime', 'endTime'],
            label: '日期',
            visibility: (qs) => qs.status === 4
        },
    ],
    buttons: [
        { label: '查询', resolveParams: (qs) => buildQueryParams(qs) },
        { label: '重置', resolveParams: (qs) => buildQueryParams(qs), reset: true }
    ]
})

const buildQueryParams = (qs: Partial<Order.OrderParams>) => {
    if (qs.status === 4) {
        const [startTime, endTime] = dateValue.value || []
        qs.startTime = startTime
        qs.endTime = endTime
    } else {
        dateValue.value = []
    }
    return qs
}

const onSearch = () => {
    componentRef.value.query?.()
}
</script>