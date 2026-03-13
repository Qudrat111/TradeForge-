import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDocuments1700000009000 implements MigrationInterface {
  public readonly name = 'CreateDocuments1700000009000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE documents (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id   UUID         NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
        name        VARCHAR(255) NOT NULL,
        type        VARCHAR(100) NOT NULL,
        url         VARCHAR(2048) NOT NULL,
        size_bytes  BIGINT       NOT NULL,
        uploaded_by UUID         REFERENCES users (id) ON DELETE SET NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id   VARCHAR      NOT NULL,
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`CREATE INDEX idx_documents_tenant_id   ON documents (tenant_id)`);
    await queryRunner.query(`CREATE INDEX idx_documents_entity      ON documents (entity_type, entity_id)`);
    await queryRunner.query(`CREATE INDEX idx_documents_uploaded_by ON documents (uploaded_by)`);
    await queryRunner.query(`ALTER TABLE documents ENABLE ROW LEVEL SECURITY`);
    await queryRunner.query(`
      CREATE POLICY tenant_isolation ON documents
        USING (tenant_id = current_setting('app.current_tenant', true)::UUID)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP POLICY IF EXISTS tenant_isolation ON documents`);
    await queryRunner.query(`DROP TABLE IF EXISTS documents`);
  }
}
