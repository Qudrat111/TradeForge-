import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRfqs1700000005000 implements MigrationInterface {
  public readonly name = 'CreateRfqs1700000005000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE rfq_status_enum AS ENUM ('draft', 'published', 'closed', 'awarded', 'cancelled')
    `);
    await queryRunner.query(`
      CREATE TYPE rfq_response_status_enum AS ENUM ('pending', 'submitted', 'accepted', 'rejected', 'withdrawn')
    `);
    await queryRunner.query(`
      CREATE TABLE rfqs (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id   UUID            NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
        buyer_id    UUID            NOT NULL REFERENCES users   (id) ON DELETE RESTRICT,
        title       VARCHAR(255)    NOT NULL,
        description TEXT            NOT NULL,
        currency    VARCHAR(3)      NOT NULL,
        deadline    TIMESTAMPTZ     NOT NULL,
        status      rfq_status_enum NOT NULL DEFAULT 'draft',
        items       JSONB           NOT NULL DEFAULT '[]',
        created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_rfqs_tenant_id ON rfqs (tenant_id)`);
    await queryRunner.query(`CREATE INDEX idx_rfqs_buyer_id  ON rfqs (buyer_id)`);
    await queryRunner.query(`CREATE INDEX idx_rfqs_status    ON rfqs (status)`);
    await queryRunner.query(`
      CREATE TABLE rfq_responses (
        id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rfq_id              UUID                     NOT NULL REFERENCES rfqs (id) ON DELETE CASCADE,
        supplier_tenant_id  VARCHAR                  NOT NULL,
        unit_price          DECIMAL(20, 4)           NOT NULL,
        total_price         DECIMAL(20, 4)           NOT NULL,
        currency            VARCHAR(3)               NOT NULL,
        lead_time_days      INTEGER                  NOT NULL DEFAULT 0,
        notes               TEXT,
        status              rfq_response_status_enum NOT NULL DEFAULT 'pending',
        created_at          TIMESTAMPTZ              NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_rfq_responses_rfq_id ON rfq_responses (rfq_id)`);
    await queryRunner.query(`CREATE INDEX idx_rfq_responses_status ON rfq_responses (status)`);
    await queryRunner.query(`ALTER TABLE rfqs          ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`ALTER TABLE rfq_responses ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`
      CREATE POLICY tenant_isolation ON rfqs
        USING (tenant_id = current_setting('app.current_tenant', true)::UUID)
    `);
    await queryRunner.query(`
      CREATE POLICY tenant_isolation ON rfq_responses
        USING (rfq_id IN (SELECT id FROM rfqs WHERE tenant_id = current_setting('app.current_tenant', true)::UUID))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation ON rfq_responses`);
    await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation ON rfqs`);
    await queryRunner.query(`DROP TABLE IF EXISTS rfq_responses`);
    await queryRunner.query(`DROP TABLE IF EXISTS rfqs`);
    await queryRunner.query(`DROP TYPE IF EXISTS rfq_response_status_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS rfq_status_enum`);
  }
}
