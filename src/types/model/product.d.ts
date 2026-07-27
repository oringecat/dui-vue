declare namespace Product {
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
        status: number;
        createTime: number;
    }

    /** 商品详情 */
    interface ProductDetailRequest {
        id: number;
    }

    interface ProductDetail {
        id: number;
        categoryId: number;
        code: string;
        title: string;
        brandId: number;
        brandName: string;
        description: string;
        isCustom: boolean; // 是否定制商品
        images: ProductImage[];
        status: number;
        createTime: number;
        updateTime: number;
    }

    interface ProductImage {
        id: number;
        productId: number;
        url: string;
        size: 'thumbnail' | 'small' | 'medium' | 'large' | 'original';
        isMain: boolean;
    }

    /** 分类列表 */
    interface CategoryListRequest {
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

    /** 销售属性列表 */
    interface CategorySaleAttrListRequest {
        categoryId: number;
    }

    interface CategorySaleAttrItem {
        id: number;
        categoryId: number;
        saleName: string;
        isCustom: boolean;
    }

    /** 销售规格列表 */
    interface CategorySaleSpecListRequest {
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