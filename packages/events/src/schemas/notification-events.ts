export const NOTIFICATION_EVENTS = {
  NOTIFICATION_CREATED: 'notification.created',
  NOTIFICATION_SENT: 'notification.sent',
  NOTIFICATION_READ: 'notification.read',
} as const;

export type NotificationEventType = (typeof NOTIFICATION_EVENTS)[keyof typeof NOTIFICATION_EVENTS];

export interface NotificationCreatedEvent {
  eventId: string;
  tenantId: string;
  notificationId: string;
  userId: string;
  type: string;
  title: string;
  channel: string;
  timestamp: string;
}

export interface NotificationSentEvent {
  eventId: string;
  tenantId: string;
  notificationId: string;
  userId: string;
  channel: string;
  sentAt: string;
  timestamp: string;
}

export interface NotificationReadEvent {
  eventId: string;
  tenantId: string;
  notificationId: string;
  userId: string;
  readAt: string;
  timestamp: string;
}
