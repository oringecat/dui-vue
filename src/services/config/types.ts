// 本地配置
export interface AppConfig {
    AppId: string;
    AppName: string;
    version: string; // 应用版本
    versionCode: string; // 应用版本号
    serviceConfigUrl: string; // 远程服务配置地址
    tokenStorage: 'session' | 'local';
}

// 服务配置
export interface ServiceConfig {
    uuid: string;
    apiUrl: string;
    fileUrl: string;
    socketUrl: string;
}