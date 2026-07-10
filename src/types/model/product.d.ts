declare namespace Product {
    interface ProductParams {
        pageIndex: number;
        pageSize: number;
        categoryId?: number;
        status?: number;
    }

    interface ProductItem {
        id: number;
        productName: string;
        status: number;
    }
}