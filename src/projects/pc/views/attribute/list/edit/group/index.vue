<template>
    <app-dialog title="分组" :width="600" :show="show" @closed="emit('closed', refresh)">
        <div class="dui-table g-table">
            <table cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>代码</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <el-input />
                        </td>
                        <td>
                            <el-input />
                        </td>
                        <td>
                            <el-button size="small">添加</el-button>
                        </td>
                    </tr>
                    <tr v-for="(item, index) in dataList" :key="index">
                        <td>
                            <el-input v-model="item.name" placeholder="请输入" />
                        </td>
                        <td>
                            <el-input v-model="item.code" placeholder="请输入" />
                        </td>
                        <td>
                            <el-button type="danger" size="small">删除</el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <template #footer>
            <el-button type="primary" @click="onSubmit">保存</el-button>
        </template>
    </app-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAttributeStore } from '@/stores/attribute'
import AppDialog from '@pc/components/ui/dialog/index.vue'

const emit = defineEmits<{ closed: [boolean] }>()

const attributeStore = useAttributeStore()

const show = ref(true)
const refresh = ref(false)
const dataList = ref<Attribute.AttributeGroup[]>([])

attributeStore.readyPromise.then(() => {
    // 拷贝对象
    dataList.value = attributeStore.groups.map((group) => ({ ...group }))
})

const onSubmit = () => {
    // 比较原始数据提交表单
    show.value = false
    refresh.value = true
}
</script>