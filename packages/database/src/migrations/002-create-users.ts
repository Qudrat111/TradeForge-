import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1700000002000 implements MigrationInterface {
  public readonly name = 'CreateUsers1700000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE user_role_enum AS ENUM ('super_admin', 'admin', 'manager', 'buyer', 'supplier', 'viewer')
    `);
    await queryRunner.query(`
      CREATE TYPE user_status_enum AS ENUM ('active', 'inactive', 'suspended')
    `);
    await queryRunner.query(`
      CREATE TABLE users (
        id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id      UUID              NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
        email          VARCHAR           NOT NULL,
        password_hash  VARCHAR           NOT NULL,
        full_name      VARCHAR(255)      NOT NULL,
        role           user_role_enum    NOT NULL,
        status         user_status_enum  NOT NULL DEFAULT 'active',
        mfa_enabled    BOOLEAN           NOT NULL DEFAULT FALSE,
        mfa_secret     VARCHAR,
        last_login_at  TIMESTAMPTZ,
        created_at     TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_users_email UNIQUE (email)
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_users_tenant_id ON users (tenant_id)`);
    await queryRunner.query(`CREATE INDEX idx_users_email     ON users (email)`);
    await queryRunner.query(`ALTER TABLE users ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`
      CREATE POLICY tenant_isolation ON users
        USING (tenant_id = current_setting('app.current_tenant', true)::UUID)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation ON users`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_status_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum`);
  }
}
