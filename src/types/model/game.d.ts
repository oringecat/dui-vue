declare namespace Game {
    interface GameListRequest {
        pageIndex: number;
        pageSize: number;
    }

    interface GameListItem {
        id: number;
        productId: number; // 关联商品
        gameName: string;
    }
}