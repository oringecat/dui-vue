import { shallowRef, computed } from 'vue'
import { defineStore } from 'pinia'
import { createAttributeGroupList, createAttributeList } from '@/services/api/common'

export const useAttributeStore = defineStore('attribute', () => {
    const loading = shallowRef(false)
    const groups = shallowRef<Attribute.AttributeGroup[]>([])
    const attributes = shallowRef<Attribute.AttributeItem[]>([])

    const attributeMap = computed(() => new Map(attributes.value.map((item) => [item.id, item])))

    // 属性分组
    const attributeGroups = computed(() => groups.value.map((group) => ({
        ...group,
        attrs: attributes.value.filter(({ groupId }) => groupId === group.id)
    })))

    const getAttributeById = (id: number) => {
        return attributeMap.value.get(id)
    }

    const { rawFetch: getAttributes } = createAttributeList({ manual: true })
    const { rawFetch: getAttributeGroups } = createAttributeGroupList({ manual: true })

    const loadData = async () => {
        try {
            loading.value = true
            
            const [attrRes, groupRes] = await Promise.all([
                getAttributes(),
                getAttributeGroups()
            ])

            attributes.value = attrRes.data
            groups.value = groupRes.data
        } finally {
            loading.value = false
        }
    }

    const readyPromise = loadData()

    return {
        loading,
        groups,
        attributes,
        attributeGroups,
        getAttributeById,
        readyPromise
    }
})
