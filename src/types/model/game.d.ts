declare namespace Game {
    interface GameListRequest {
        pageIndex: number;
        pageSize: number;
    }

    interface GameListItem {
        id: number;
        categoryId: number;
        title: string;
    }

    interface GameDetail {
        id: number;
        categoryId: number;
        title: string;
        tags: string;
        items: GameItem[];
        description: string;
        createTime: number;
        updateTime: number;
    }

    interface GameItem {
        id: number;
        productId: number; // 关联商品
        typeId: number;
        gameType: string;
        developerId: number;
        publisherId: number;
        gameName: string;
        alias: string;
        initialPrice: number;  // 首发价
        platform: string;
        ageRating: string; // 分级
        language: string;
        player: number;
        rating: number;
        ratingCount: number;
        releaseDate: string;
    }
}