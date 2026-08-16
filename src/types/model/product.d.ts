import { AttributeValueType } from '@/constants/enums'

declare global {
    namespace Product {
        /** 商品列表 */
        interface ProductListRequest {
            pageIndex: number;
            pageSize: number;
            title?: string;
            categoryId?: number;
            status?: number;
        }

        interface ProductListItem {
            id: number;
            categoryId: number;
            title: string;
            price: number;
            image: {
                url: string;
                width: number;
                height: number;
            };
            status: number;
            createTime: number;
        }

        /** 商品详情 */
        interface ProductDetailRequest {
            id: number;
            userId?: number;
        }

        interface ProductDetail {
            id: number; // 商品ID
            shopId: number; // shopId = 0 自营商品
            categoryId: number;
            shopCategoryId: number;
            title: string;
            brandId: number;
            brandName: string;
            tags: string;
            attrs: ProductAttrItem[];
            images: ProductImage[];
            description: string;
            status: number;
            createTime: number;
            updateTime: number;
        }

        interface ProductImage {
            id: number;
            url: string;
            width: number; // 原始宽度
            height: number; // 原始高度
            isMain: boolean;
        }

        /** 商品基础属性 */
        interface ProductAttrItem {
            id: number;
            attributeId: number;
            attributeValue: string;
        }

        /** 标准化商品单元列表 */
        interface ProductSpuListRequest {
            productId: number;
        }

        interface ProductSpuItem {
            id: number;
            code: string;
            spuName: string;
            spuContent: string;
            isCustom: boolean; // 是否可定制化
            skus: ProductSkuItem[];
        }

        /** 商品库存单位 */
        interface ProductSkuItem {
            id: number;
            code: string;
            specs: ProductSpec[];
            price: number;
            stock: number;
            image: {
                url: string;
                width: number;
                height: number;
            };
        }

        /** 商品规格 */
        interface ProductSpec {
            attributeId: number;
            valueId: number;
            specName: string;
        }

        /** 分类列表 */
        interface CategoryListRequest {
            categoryId?: number;
            code?: string;
            categoryName?: string;
            status?: number;
        }

        interface CategoryItem {
            id: number;
            parentId: number;
            code: string;
            categoryName: string;
            attrs: CategoryAttr[]; // 基础属性
            sales: CategorySale[]; // 销售属性
            status: number;
            icon: string;
            sort: number;
            createTime: number;
        }

        interface CategoryAttr {
            id: number;
            attributeId: number;
            valueType: AttributeValueType;
            required: boolean;
        }

        interface CategorySale {
            id: number;
            attributeId: number;
            isCustom: boolean; // 是否允许自定义规格
        }
    }
}
