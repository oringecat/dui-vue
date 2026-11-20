declare namespace User {
    /** 登录参数 */
    interface LoginRequest {
        account: string;
        password: string;
        client: string;
        version: string;
    }

    /** 登录信息 */
    interface LoginInfo {
        id: number;
        roleId: number;
        userName: string;
        realName: string;
        avatar: string;
        token: string;
    }

    /** 管理员列表 */
    interface AdminListRequest {
        pageIndex: number;
        pageSize: number;
        roleId?: number;
        userName?: string;
        status?: number;
    }

    interface AdminListItem {
        id: number;
        roleId: number;
        userName: string;
        realName: string;
        avatar: string;
        status: number;
        loginTime: number;
    }

    /** 管理员角色列表 */
    interface AdminRoleRequest {
        status?: number;
    }

    interface AdminRoleItem {
        id: number;
        roleName: string;
        status: number;
        creatorName: string;
        updateTime: number;
    }

    /** 管理员角色详情 */
    interface AdminRoleDetailRequest {
        id: number;
    }

    interface AdminRoleDetail {
        id: number; // -1 = '超级管理员'
        parentId: number;
        roleName: string;
        authCodes: string[];
        status: number;
        creatorId: number; // 0 = '系统'
        creatorName: string;
        createTime: number;
        updateTime: number;
        children: AdminRoleDetail[];
    }
}