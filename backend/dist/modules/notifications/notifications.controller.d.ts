import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(): Promise<{
        id: string;
        title: string;
        message: string;
        type: string;
        read: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        title: string;
        message: string;
        type: string;
        read: boolean;
        createdAt: Date;
    }>;
    create(createNotificationDto: CreateNotificationDto): Promise<{
        read: boolean;
        createdAt: Date;
        title: string;
        message: string;
        type: string;
        userId?: string;
        tenantId?: string;
        id: string;
    }>;
    markAsRead(id: string): Promise<{
        id: string;
        message: string;
    }>;
}
