declare namespace Brand {
    interface BrandListRequest {
        pageIndex: number;
        pageSize: number;
        categoryId?: number;
        id?: number;
        brandName?: string;
        status?: number;
    }

    /** 品牌列表 */
    interface BrandListItem {
        id: number;
        categoryId: number;
        code: string;
        brandName: string;
        status: number;
        createTime: number;
    }

    interface CategoryListRequest {
        id?: number;
        code?: string;
        categoryName?: string;
        status?: number;
    }

    /** 品牌分类列表 */
    interface CategoryItem {
        id: number;
        parentId: number;
        code: string;
        categoryName: string;
        status: number;
        icon: string;
        sort: number;
        createTime: number;
    }
}