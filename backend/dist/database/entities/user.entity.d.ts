export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    phone: string;
    isActive: boolean;
    tenantId: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
    userRoles: UserRole[];
}
export declare class Role {
    id: number;
    code: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    userRoles: UserRole[];
}
export declare class UserRole {
    id: string;
    userId: string;
    roleId: number;
    createdAt: Date;
    user: User;
    role: Role;
}
