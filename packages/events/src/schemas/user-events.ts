export const USER_EVENTS = {
  USER_REGISTERED: 'user.registered',
  USER_LOGGED_IN: 'user.logged_in',
  USER_DEACTIVATED: 'user.deactivated',
  PASSWORD_CHANGED: 'user.password_changed',
  MFA_ENABLED: 'user.mfa_enabled',
  ROLE_ASSIGNED: 'user.role_assigned',
} as const;

export type UserEventType = (typeof USER_EVENTS)[keyof typeof USER_EVENTS];

export interface UserRegisteredEvent {
  eventId: string;
  tenantId: string;
  userId: string;
  email: string;
  role: string;
  timestamp: string;
}

export interface UserLoggedInEvent {
  eventId: string;
  tenantId: string;
  userId: string;
  ipAddress: string;
  timestamp: string;
}

export interface UserDeactivatedEvent {
  eventId: string;
  tenantId: string;
  userId: string;
  deactivatedBy: string;
  reason: string;
  timestamp: string;
}

export interface PasswordChangedEvent {
  eventId: string;
  tenantId: string;
  userId: string;
  timestamp: string;
}

export interface MfaEnabledEvent {
  eventId: string;
  tenantId: string;
  userId: string;
  timestamp: string;
}

export interface RoleAssignedEvent {
  eventId: string;
  tenantId: string;
  userId: string;
  role: string;
  assignedBy: string;
  timestamp: string;
}
