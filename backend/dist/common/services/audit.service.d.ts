export declare class AuditService {
    logAction(userId: string, action: string, resource: string, resourceId?: string, details?: any): Promise<void>;
    getAuditLogs(userId?: string, action?: string, resource?: string, from?: Date, to?: Date): Promise<any[]>;
}
