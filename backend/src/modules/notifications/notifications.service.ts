import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  async findAll() {
    // Mock implementation
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

  async findOne(id: string) {
    // Mock implementation
    return {
      id,
      title: 'Notification',
      message: 'This is a notification',
      type: 'info',
      read: false,
      createdAt: new Date(),
    };
  }

  async create(createNotificationDto: CreateNotificationDto) {
    // Mock implementation
    return {
      id: '3',
      ...createNotificationDto,
      read: false,
      createdAt: new Date(),
    };
  }

  async markAsRead(id: string) {
    // Mock implementation
    return {
      id,
      message: 'Notification marked as read',
    };
  }
}
