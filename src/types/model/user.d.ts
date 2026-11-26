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

    interface UserListRequest {
        pageIndex: number;
        pageSize: number;
        roleId?: number;
        userName?: string;
        status?: number;
    }

    /** 用户列表 */
    interface UserListItem {
        id: number;
        roleId: number;
        userName: string;
        nickName: string;
        avatar: string;
        status: number;
        loginTime: number;
    }

    interface UserInfoRequest {
        id: number;
    }

    /** 用户详情 */
    interface UserInfo {
        id: number;
        roleId: number; // 0 = '普通用户'
        userName: string;
        nickName: string;
        password: string;
        phone: string;
        email: string;
        avatar: string;
        status: number;
        loginIp: string;
        loginTime: number;
        createTime: number;
        updateTime: number;
    }

    interface UserRoleRequest {
        status?: number;
    }

    /** 用户角色列表 */
    interface UserRoleItem {
        id: number;
        parentId: number;
        roleName: string;
        status: number;
        remark: string;
        creatorId: number;
        creatorName: string;
        createTime: number;
        updateTime: number;
        children: UserRoleItem[];
    }

    interface AdminListRequest {
        pageIndex: number;
        pageSize: number;
        roleId?: number;
        userName?: string;
        status?: number;
    }

    /** 管理员列表 */
    interface AdminListItem {
        id: number;
        roleId: number;
        userName: string;
        avatar: string;
        status: number;
        loginIp: string;
        loginTime: number;
        loginCount: number;
    }

    interface AdminDetailRequest {
        id: number;
    }

    /** 管理员详情 */
    interface AdminDetail {
        id: number;
        roleId: number; // -1 = '超级管理员'
        userName: string;
        realName: string;
        password: string;
        phone: string;
        email: string;
        avatar: string;
        remark: string;
        status: number;
        loginIp: string;
        loginTime: number;
        loginCount: number;
        creatorId: number;
        creatorName: string;
        createTime: number;
        updateTime: number;
    }

    interface AdminRoleRequest {
        status?: number;
    }

    /** 管理员角色列表 */
    interface AdminRoleItem {
        id: number;
        parentId: number;
        roleName: string;
        authCodes: string[];
        status: number;
        remark: string;
        creatorId: number;
        creatorName: string;
        createTime: number;
        updateTime: number;
        children: AdminRoleItem[];
    }

    interface AdminRoleDetailRequest {
        id: number;
    }

    /** 管理员角色详情 */
    interface AdminRoleDetail {
        id: number;
        parentId: number;
        roleName: string;
        authCodes: string[];
        status: number;
        remark: string;
        creatorId: number; // 0 = '系统'
        creatorName: string;
        createTime: number;
        updateTime: number;
    }

    /** 新增/更新管理员角色 */
    interface AdminRoleUpdateRequest {
        id: number; // 0 = 新增
        parentId: number;
        roleName: string;
        authCodes: string[];
    }
}