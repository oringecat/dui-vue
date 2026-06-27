<template>
    <pc-view class="order-list">
        <app-filter :options="filterOptions" :model="queryParams" :rules="filterRules" @submit="loadData">
            <template #status="{ item }">
                <el-form-item :label="item.label">
                    <el-select v-model="item.value" placeholder="请选择">
                        <el-option v-for="option in item.options?.()" :key="option.value" :label="option.label"
                            :value="option.value" />
                    </el-select>
                </el-form-item>
                <template v-if="item.value === 4">
                    <el-form-item label="日期" prop="date">
                        <el-date-picker type="daterange" v-model="dateValue" value-format="YYYY-MM-DD"
                            start-placeholder="开始日期" end-placeholder="结束日期" />
                    </el-form-item>
                </template>
            </template>
        </app-filter>
        <div>订单列表</div>
    </pc-view>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import { type FormRules } from 'element-plus'
import { useDataFilter } from '@/composables/datatable'
import AppFilter from '@pc/components/base/form-filter/index.vue'

const dateValue = shallowRef<string[]>()

const { filterOptions, queryParams } = useDataFilter<Order.OrderParams>({
    filters: [
        {
            field: 'orderNumber',
            label: '订单号'
        },
        {
            field: 'status',
            label: '状态',
            value: 0,
            options: () => [
                { label: '全部', value: 0 },
                { label: '待付款', value: 1 },
                { label: '待发货', value: 2 },
                { label: '待收货', value: 3 },
                { label: '已完成', value: 4 }
            ],
            required: true
        }
    ],
    buttons: [
        { label: '查询', resolveParams: (qs) => buildQueryParams(qs) },
        { label: '重置', resolveParams: (qs) => buildQueryParams(qs), reset: true }
    ]
})

// 表单验证规则
const filterRules: FormRules = {
    date: [{
        required: true,
        validator: () => dateValue.value?.length === 2
    }]
}

const loadData = () => {
    console.log('发送请求', queryParams.value)
}

const buildQueryParams = (qs: Partial<Order.OrderParams>) => {
    if (qs.status === 4) {
        const [startTime, endTime] = dateValue.value || []
        qs.startTime = startTime
        qs.endTime = endTime
    }
    return qs
}
</script>