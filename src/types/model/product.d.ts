declare namespace Product {
    /** 商品列表 */
    interface ProductListParams {
        pageIndex: number;
        pageSize: number;
        productName?: string;
        categoryId?: number;
        status?: number;
    }

    interface ProductListItem {
        id: number;
        productName: string;
        status: number;
        createTime: number;
    }

    /** 分类列表 */
    interface CategoryListParams {
        categoryName?: string;
        status?: number;
    }

    interface CategoryItem {
        id: number;
        parentId: number;
        categoryName: string;
        status: number;
        icon: string;
        sort: number;
        createTime: number;
    }

    /** 销售属性列表 */
    interface CategorySaleAttrListParams {
        categoryId: number;
    }

    interface CategorySaleAttrItem {
        id: number;
        categoryId: number;
        saleName: string;
        isCustom: boolean;
    }

    /** 销售规格列表 */
    interface CategorySaleSpecListParams {
        categoryId: number;
        saleId?: number;
    }

    interface CategorySaleSpecItem {
        id: number;
        categoryId: number;
        saleId: number;
        specName: string;
    }
}