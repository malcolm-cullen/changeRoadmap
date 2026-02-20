import { Pool } from 'pg';

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    schemaReady = initSchema(pool);
  }
  return pool;
}

async function initSchema(p: Pool): Promise<void> {
  await p.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      initiative_name TEXT NOT NULL,
      submitter_name TEXT NOT NULL,
      submission_date TEXT NOT NULL,
      problem_today TEXT,
      problem_why_now TEXT,
      problem_who_impacted TEXT,
      business_objective TEXT,
      status TEXT NOT NULL DEFAULT 'submitted',
      priority TEXT DEFAULT NULL,
      pm_notes TEXT DEFAULT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS key_results (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      row_number INTEGER NOT NULL,
      key_result TEXT,
      baseline TEXT,
      target TEXT,
      measurement_source TEXT
    );

    CREATE TABLE IF NOT EXISTS feature_requests (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      requester_name TEXT NOT NULL,
      submission_date TEXT NOT NULL,
      estimated_size TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'submitted',
      priority TEXT DEFAULT NULL,
      pm_notes TEXT DEFAULT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS production_support (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      submitter_name TEXT NOT NULL,
      submission_date TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'medium',
      affected_system TEXT,
      status TEXT NOT NULL DEFAULT 'submitted',
      priority TEXT DEFAULT NULL,
      pm_notes TEXT DEFAULT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS bau_items (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      submitter_name TEXT NOT NULL,
      submission_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'submitted',
      pm_notes TEXT DEFAULT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

export async function db(): Promise<Pool> {
  const p = getPool();
  await schemaReady;
  return p;
}
