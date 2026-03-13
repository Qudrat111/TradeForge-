import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { BaseProducer } from '@tradeforge/events';
import {
  USER_EVENTS,
  UserRegisteredEvent,
  UserLoggedInEvent,
  RoleAssignedEvent,
  MfaEnabledEvent,
} from '@tradeforge/events';

export const KAFKA_CLIENT_TOKEN = Symbol('KAFKA_CLIENT');

@Injectable()
export class UserEventProducer extends BaseProducer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UserEventProducer.name);
  private connected = false;

  constructor(@Inject(KAFKA_CLIENT_TOKEN) kafka: Kafka) {
    super(kafka, 'identity-service');
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.connect();
      this.connected = true;
      this.logger.log('Kafka producer connected');
    } catch (err) {
      this.logger.warn(`Kafka unavailable — events will be skipped: ${String(err)}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.connected) {
      try {
        await this.disconnect();
      } catch (err) {
        this.logger.warn(`Error disconnecting Kafka producer: ${String(err)}`);
      }
    }
  }

  async publishUserRegistered(event: UserRegisteredEvent): Promise<void> {
    if (!this.connected) return;
    try {
      await this.publish(USER_EVENTS.USER_REGISTERED, event.userId, event);
    } catch (err) {
      this.logger.error(`Failed to publish ${USER_EVENTS.USER_REGISTERED}: ${String(err)}`);
    }
  }

  async publishUserLoggedIn(event: UserLoggedInEvent): Promise<void> {
    if (!this.connected) return;
    try {
      await this.publish(USER_EVENTS.USER_LOGGED_IN, event.userId, event);
    } catch (err) {
      this.logger.error(`Failed to publish ${USER_EVENTS.USER_LOGGED_IN}: ${String(err)}`);
    }
  }

  async publishRoleAssigned(event: RoleAssignedEvent): Promise<void> {
    if (!this.connected) return;
    try {
      await this.publish(USER_EVENTS.ROLE_ASSIGNED, event.userId, event);
    } catch (err) {
      this.logger.error(`Failed to publish ${USER_EVENTS.ROLE_ASSIGNED}: ${String(err)}`);
    }
  }

  async publishMfaEnabled(event: MfaEnabledEvent): Promise<void> {
    if (!this.connected) return;
    try {
      await this.publish(USER_EVENTS.MFA_ENABLED, event.userId, event);
    } catch (err) {
      this.logger.error(`Failed to publish ${USER_EVENTS.MFA_ENABLED}: ${String(err)}`);
    }
  }
}
