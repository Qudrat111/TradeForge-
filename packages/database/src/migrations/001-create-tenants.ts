import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenants1700000001000 implements MigrationInterface {
  public readonly name = 'CreateTenants1700000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE tenant_plan_enum AS ENUM ('free', 'starter', 'professional', 'enterprise')
    `);
    await queryRunner.query(`
      CREATE TYPE tenant_status_enum AS ENUM ('active', 'suspended', 'pending')
    `);
    await queryRunner.query(`
      CREATE TABLE tenants (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name        VARCHAR(255)        NOT NULL,
        slug        VARCHAR(100)        NOT NULL,
        plan        tenant_plan_enum    NOT NULL,
        country_code VARCHAR(2)         NOT NULL,
        settings    JSONB               NOT NULL DEFAULT '{}',
        status      tenant_status_enum  NOT NULL DEFAULT 'pending',
        verified_at TIMESTAMPTZ,
        created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_tenants_slug UNIQUE (slug)
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_tenants_slug   ON tenants (slug)`);
    await queryRunner.query(`CREATE INDEX idx_tenants_status ON tenants (status)`);
    await queryRunner.query(`ALTER TABLE tenants ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`
      CREATE POLICY tenant_isolation ON tenants
        USING (id = current_setting('app.current_tenant', true)::UUID)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation ON tenants`);
    await queryRunner.query(`DROP TABLE IF EXISTS tenants`);
    await queryRunner.query(`DROP TYPE IF EXISTS tenant_status_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS tenant_plan_enum`);
  }
}
