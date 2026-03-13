import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotifications1700000011000 implements MigrationInterface {
  public readonly name = 'CreateNotifications1700000011000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE notification_channel_enum AS ENUM ('email', 'sms', 'push', 'in_app')
    `);
    await queryRunner.query(`
      CREATE TYPE notification_status_enum AS ENUM ('pending', 'sent', 'failed', 'read')
    `);
    await queryRunner.query(`
      CREATE TABLE notifications (
        id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID                        NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
        user_id   UUID                        NOT NULL REFERENCES users   (id) ON DELETE CASCADE,
        type      VARCHAR(100)                NOT NULL,
        title     VARCHAR(255)                NOT NULL,
        body      TEXT                        NOT NULL,
        channel   notification_channel_enum   NOT NULL,
        status    notification_status_enum    NOT NULL DEFAULT 'pending',
        read_at   TIMESTAMPTZ,
        created_at TIMESTAMPTZ                NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_notifications_tenant_id ON notifications (tenant_id)`);
    await queryRunner.query(`CREATE INDEX idx_notifications_user_id   ON notifications (user_id)`);
    await queryRunner.query(`CREATE INDEX idx_notifications_status    ON notifications (status)`);
    await queryRunner.query(`ALTER TABLE notifications ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`
      CREATE POLICY tenant_isolation ON notifications
        USING (tenant_id = current_setting('app.current_tenant', true)::UUID)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation ON notifications`);
    await queryRunner.query(`DROP TABLE IF EXISTS notifications`);
    await queryRunner.query(`DROP TYPE IF EXISTS notification_status_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS notification_channel_enum`);
  }
}
