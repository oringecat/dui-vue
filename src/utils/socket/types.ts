export interface SocketOptions {
    url: string,
    protocols?: string | string[]
    heartbeatMessage?: () => MessageEvent['data'];
    onOpen?: () => void;
    onMessage: (data: MessageEvent['data']) => void;
    onClose?: (event?: CloseEvent) => void;
    onError?: (error: Event) => void;
    onBeforeReconnect?: (count: number) => void;
    onReconnect?: () => void;
}

export interface ConnectionOptions {
    onSuccess?: () => void;
    onFail?: () => void;
}