<template>
    <div class="dui-upload">
        <div v-if="listType === 'text'">
            <slot>
                <el-button type="primary" @click="uploadRef?.click()">上传</el-button>
            </slot>
            <ul>
                <li v-for="(item, index) in uploadItems" :key="item.url">
                    <span>{{ item.name || item.url }}</span>
                    <el-button type="primary" size="small" @click="handleDelete(index)" link>删除</el-button>
                    <el-button type="primary" size="small" link>下载</el-button>
                </li>
            </ul>
        </div>
        <ul class="dui-upload-list" :class="{ [`dui-upload-list--${size}`]: !!size }" v-else>
            <li class="dui-upload-list__item" v-for="(item, index) in uploadItems" :key="item.url">
                <el-popover placement="top" width="auto" :popper-style="{ minWidth: 0 }"
                    :disabled="uploading.has(item.url)">
                    <template #reference>
                        <div class="dui-upload-thumb" v-loading="uploading.has(item.url)">
                            <img class="dui-upload-thumb__image" :src="getImageUrl(item, 32)"
                                @click="replaceUpload(index)" />
                        </div>
                    </template>
                    <el-button size="small" @click="handlePreview(index)" link>预览</el-button>
                    <el-button size="small" @click="handleDelete(index)" link>删除</el-button>
                </el-popover>
            </li>
            <li class="dui-upload-list__item" v-if="uploadItems.length < limit">
                <div class="dui-upload-button" @click="uploadRef?.click()">
                    <app-icon icon="Plus" />
                </div>
            </li>
        </ul>
        <input ref="uploadRef" class="dui-upload-input" type="file" @change="handleUpload" :accept="uploadAccept"
            :multiple="limit > 1" />
        <el-image-viewer :url-list="previewList" :initial-index="previewIndex" :show-progress="previewList.length > 1"
            @close="showPreview = false" teleported v-if="showPreview" />
    </div>
</template>

<script lang="ts" setup>
import { shallowRef, reactive, computed } from 'vue'
import type { ComponentSize, ListType } from 'element-plus'
import { ImageTypes } from '@/constants/enums'
import { uploadFile } from '@/services/api/common'
import imageCompression from 'browser-image-compression'
import AppIcon from '@pc/components/ui/icon/index.vue'

const props = withDefaults(defineProps<{
    listType?: ListType
    accept?: string
    size?: ComponentSize
    limit?: number
}>(), {
    listType: 'picture-card',
    limit: 5
})

const uploadItems = defineModel<Common.UploadFile[]>({ required: true })

const uploadRef = shallowRef<HTMLInputElement>()
const showPreview = shallowRef(false)
const previewIndex = shallowRef(0)
const replaceIndex = shallowRef(-1)

const uploading = reactive(new Set<string>())

const uploadAccept = computed(() => props.listType === 'text' ? props.accept : 'image/*')

// 剩余可选上传文件数
const maxCount = computed(() => Math.max(props.limit - uploadItems.value.length, 0))

// 预览列表
const previewList = computed(() => uploadItems.value.map((item) => getImageUrl(item, 800)))

const getImageUrl = (item: Common.UploadFile, width: number) => {
    const url = typeof item === 'string' ? item : item.url
    return url.startsWith('blob') ? url : `${url}/${width}`
}

// 打开预览图
const handlePreview = (index: number) => {
    previewIndex.value = index
    showPreview.value = true
}

const handleDelete = (index: number) => {
    uploadItems.value = uploadItems.value.filter((_, i) => i !== index)
}

// 替换上传（待实现）
const replaceUpload = (index: number) => {
    replaceIndex.value = index
    uploadRef.value?.click()
}

// 上传到临时目录（返回临时路径），表单提交后移动到正式目录，未提交的临时文件定时清理
const handleUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const files = Array.from(input.files ?? []).slice(0, maxCount.value)
    input.value = ''

    const localItems: Common.UploadFile[] = files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        width: 0,
        height: 0
    }))

    uploadItems.value = [...uploadItems.value, ...localItems]

    try {
        const uploaded = new Map<string, Common.UploadFile>()

        // 处理并发上传
        await Promise.allSettled(files.map(async (file, i) => {
            const local = localItems[i]
            if (!local) return

            uploading.add(local.url)

            try {
                let target = file
                // 上传前压缩图片
                if (ImageTypes.includes(file.type)) {
                    target = await imageCompression(file, {
                        maxSizeMB: 2,
                        maxWidthOrHeight: 1920,
                        initialQuality: 0.9,
                        useWebWorker: false
                    })
                }
                const res = await uploadFile(target)
                uploaded.set(local.url, res.data || { ...local, url: '失败占位图' })
            } catch {
                uploaded.set(local.url, { ...local, url: '失败占位图' })
            }
        }))

        if (uploaded.size) {
            uploadItems.value = uploadItems.value.map((item) => uploaded.get(item.url) ?? item)
        }
    } finally {
        localItems.forEach((item) => uploading.delete(item.url))
    }
}
</script>

<style lang="less">
@import './index.less';
</style>