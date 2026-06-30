declare namespace Order {
    interface OrderParams {
        pageIndex: number;
        pageSize: number;
        orderNumber?: string;
        status?: number;
        startTime?: string;
        endTime?: string;
    }

    interface OrderItem {
        id: number;
        userId: number;
        orderNumber: string;
        status: number;
        orderTime: string;
    }
}