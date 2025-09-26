"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
let NotificationsService = class NotificationsService {
    async findAll() {
        return [
            {
                id: '1',
                title: 'New Order Received',
                message: 'Order #12345 has been received and is ready for processing',
                type: 'info',
                read: false,
                createdAt: new Date(),
            },
            {
                id: '2',
                title: 'Inventory Low',
                message: 'Item SKU-001 is running low on inventory',
                type: 'warning',
                read: false,
                createdAt: new Date(),
            },
        ];
    }
    async findOne(id) {
        return {
            id,
            title: 'Notification',
            message: 'This is a notification',
            type: 'info',
            read: false,
            createdAt: new Date(),
        };
    }
    async create(createNotificationDto) {
        return {
            id: '3',
            ...createNotificationDto,
            read: false,
            createdAt: new Date(),
        };
    }
    async markAsRead(id) {
        return {
            id,
            message: 'Notification marked as read',
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)()
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map