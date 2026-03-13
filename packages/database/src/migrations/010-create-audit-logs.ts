import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLogs1700000010000 implements MigrationInterface {
  public readonly name = 'CreateAuditLogs1700000010000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE audit_logs (
        id          UUID         NOT NULL DEFAULT gen_random_uuid(),
        tenant_id   UUID         NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id   VARCHAR      NOT NULL,
        action      VARCHAR(50)  NOT NULL,
        actor_id    VARCHAR      NOT NULL,
        changes     JSONB,
        ip_address  VARCHAR(45),
        timestamp   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      ) PARTITION BY RANGE (timestamp)
    `);
    await queryRunner.query(`
      CREATE TABLE audit_logs_default
        PARTITION OF audit_logs DEFAULT
    `);
    await queryRunner.query(`
      CREATE INDEX idx_audit_logs_tenant_id   ON audit_logs (tenant_id)`);
    await queryRunner.query(`
      CREATE INDEX idx_audit_logs_entity      ON audit_logs (entity_type, entity_id)`);
    await queryRunner.query(`
      CREATE INDEX idx_audit_logs_actor_id    ON audit_logs (actor_id)`);
    await queryRunner.query(`
      CREATE INDEX idx_audit_logs_timestamp   ON audit_logs (timestamp)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS audit_logs`);
  }
}
