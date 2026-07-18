declare namespace Order {
    interface OrderListParams {
        pageIndex: number;
        pageSize: number;
        orderNumber?: string;
        status?: number;
        startTime?: string;
        endTime?: string;
    }

    interface OrderListItem {
        id: number;
        userId: number;
        orderNumber: string;
        status: number;
        orderTime: number; // 时间戳日期
    }
}