/**
 * 从数组中创建树列表
 * @param data 
 * @param idKey 
 * @param parentIdKey 
 * @param filter 
 * @returns 
 */
export function buildTree<T>(data: T[], idKey: keyof T, parentIdKey: keyof T, filter: (node: T) => boolean = () => true) {
    const map = new Map<T[keyof T], T & { children: T[] }>()
    for (const item of data) {
        const id = item[idKey]
        map.set(id, { ...item, children: [] })
    }
    for (const item of data) {
        const id = item[idKey]
        const parentId = item[parentIdKey]
        if (parentId !== id) {
            const currentNode = map.get(id)
            const parentNode = map.get(parentId)
            if (currentNode && parentNode) {
                parentNode.children.push(currentNode)
            }
        }
    }
    const nodes = []
    for (const node of map.values()) {
        if (filter(node)) {
            nodes.push(node)
        }
    }
    return nodes
}

/**
 * 查找树形结构中某个节点
 * @param data 
 * @param value 
 * @param props 
 * @returns 
 */
export function findTreeNodeById<T extends object, K extends keyof T>(data: T[], value: T[K], props?: Partial<{ id: K, children: K }>): T | undefined {
    const { id = 'id' as K, children = 'children' as K } = props ?? {}
    for (const item of data) {
        if (item[id] === value) {
            return item
        }
        const nodes = item[children]
        if (Array.isArray(nodes)) {
            const res = findTreeNodeById(nodes, value, props)
            if (res) return res
        }
    }
    return undefined
}

/**
 * 检查某个属性值是否存在树形中
 * @param data 
 * @param value 
 * @param props 
 * @returns 
 */
export function hasValueInTree<T extends object, K extends keyof T>(data: T[], value: T[K], props?: Partial<{ id: K, children: K }>) {
    const { id = 'id' as K, children = 'children' as K } = props ?? {}
    const checkItem = (item: T) => {
        if (item[id] === value) {
            return true
        }
        const nodes = item[children]
        if (Array.isArray(nodes)) {
            return nodes.some(checkItem)
        }
        return false
    }
    return data.some(checkItem)
}

/**
 * 获取对象嵌套属性值
 * @param obj 
 * @param path 
 * @returns 
 */
export function getNestedValue(obj: unknown, path: string) {
    const keys = path.split('.')

    for (const key of keys) {
        if (obj == null || typeof obj !== 'object') {
            return undefined
        }
        obj = (obj as Record<string, unknown>)[key]
    }

    return obj
}