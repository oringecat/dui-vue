declare namespace Brand {
    /** 品牌列表 */
    interface BrandListRequest {
        pageIndex: number;
        pageSize: number;
        categoryId?: number;
        id?: number;
        brandName?: string;
        status?: number;
    }

    interface BrandListItem {
        id: number;
        categoryId: number;
        code: string;
        brandName: string;
        status: number;
        createTime: number;
    }

    /** 品牌分类列表 */
    interface CategoryListRequest {
        id?: number;
        code?: string;
        categoryName?: string;
        status?: number;
    }

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