declare namespace Attribute {
    interface AttributeListRequest {
        groupId?: number;
        attributeName?: string;
    }

    interface AttributeGroup {
        id: number;
        name: string;
        code: string;
        sort: number;
    }

    interface AttributeItem {
        id: number;
        name: string;
        groupId: number;
        values: AttributeValue[];
        multiple: boolean; // 是否多选
        updateTime: number;
    }

    /** 属性枚举 */
    interface AttributeValue {
        id: number;
        value: string;
    }
}