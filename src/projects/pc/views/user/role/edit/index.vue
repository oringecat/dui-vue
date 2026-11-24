<template>
    <app-dialog title="编辑" :width="600" :show="show" :loading="loading">
        <div class="user-role-edit">
            <div class="user-role-edit__title" v-if="parentName">{{ parentName }}</div>
            <el-form :class="{ 'user-role-edit__form': !!parentName }" :model="formData">
                <el-form-item label="角色名称">
                    <el-input v-model="formData.roleName" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="管理权限">
                    <el-card class="user-role-edit__tree" shadow="never">
                        <template #header>
                            <el-checkbox v-model="isChecked" label="全选" :indeterminate="isIndeterminate"
                                @change="checkAll" />
                            <el-button type="primary" link @click="toggleAll">
                                {{ isExpanded ? '收缩' : '展开' }}
                            </el-button>
                        </template>
                        <el-tree ref="treeRef" :data="treeData" node-key="code" :props="{ label: 'title' }"
                            show-checkbox @check="nodeCheck" />
                    </el-card>
                    <el-text type="info">已选 {{ formData.authCodes.length }} 项目</el-text>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <el-button type="primary" @click="onSubmit">提交</el-button>
        </template>
    </app-dialog>
</template>

<script lang="ts" setup>
import { shallowRef, reactive, onMounted, nextTick } from 'vue'
import type { TreeInstance } from 'element-plus'
import { createAdminRoleDetail } from '@/services/api/user'
import { useAuthStore, type AuthRoute } from '@/stores/auth'
import AppDialog from '@pc/components/ui/dialog/index.vue'

const props = defineProps<{
    authCode: string
    record?: User.AdminRoleItem
}>()

const authStore = useAuthStore()

const show = shallowRef(true)
const isChecked = shallowRef(false)
const isIndeterminate = shallowRef(false)
const isExpanded = shallowRef(false)

const treeRef = shallowRef<TreeInstance>()
const treeData = shallowRef<AuthRoute[]>([]) // 父级权限树
const parentName = shallowRef('') // 父级角色

const formData = reactive<User.AdminRoleUpdateRequest>({
    id: 0,
    parentId: 0,
    roleName: '',
    authCodes: []
})

const { loading, rawFetch } = createAdminRoleDetail()

const getAllKeys = () => {
    return Object.keys(treeRef.value?.store.nodesMap ?? {})
}

const nodeCheck = () => {
    if (treeRef.value) {
        const total = getAllKeys().length
        const checkedKeys = treeRef.value.getCheckedKeys()
        const checked = checkedKeys.length

        isChecked.value = checked === total
        isIndeterminate.value = checked > 0 && checked < total
        formData.authCodes = [...checkedKeys, ...treeRef.value.getHalfCheckedKeys()] as string[]
    }
}

// 全选/取消
const checkAll = () => {
    isIndeterminate.value = false
    treeRef.value?.setCheckedKeys(isChecked.value ? getAllKeys() : [])
    nodeCheck()
}

// 展开/收缩
const toggleAll = () => {
    isExpanded.value = !isExpanded.value

    Object.values(treeRef.value?.store.nodesMap ?? {}).forEach((node) => {
        node.expanded = isExpanded.value
    })
}

const onSubmit = () => {
    show.value = false
}

// 过滤树节点
const filterNodes = (data: AuthRoute[], codes: Set<string>) => {
    return data.reduce<AuthRoute[]>((result, node) => {
        const children = node.children ? filterNodes(node.children, codes) : []
        if (codes.has(node.code) || children.length) {
            result.push({
                ...node, children
            })
        }
        return result
    }, [])
}

const setNodeChecked = (codes: string[]) => nextTick(() => {
    codes.forEach((code) => {
        treeRef.value?.setChecked(code, true, false)
    })
    nodeCheck()
})

onMounted(() => {
    if (props.record) {
        const { id, parentId, roleName, authCodes } = props.record

        if (props.authCode === 'user-role-add') {
            parentName.value = roleName
            treeData.value = filterNodes(authStore.userAuth, new Set(authCodes))
            formData.parentId = id
        } else {
            if (parentId > 0) {
                rawFetch({
                    id: parentId
                }).then((res) => {
                    parentName.value = res.data.roleName
                    treeData.value = filterNodes(authStore.userAuth, new Set(res.data.authCodes))
                    setNodeChecked(authCodes)
                })
            } else {
                treeData.value = authStore.userAuth
                setNodeChecked(authCodes)
            }

            formData.id = id
            formData.parentId = parentId
            formData.roleName = roleName
            formData.authCodes = [...authCodes]
        }
    } else {
        treeData.value = authStore.userAuth
    }
})
</script>

<style lang="less">
@import './index.less';
</style>