import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'roadmap.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initialiseSchema(db);
  }
  return db;
}

function initialiseSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS key_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      row_number INTEGER NOT NULL,
      key_result TEXT,
      baseline TEXT,
      target TEXT,
      measurement_source TEXT
    );

    CREATE TABLE IF NOT EXISTS feature_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      requester_name TEXT NOT NULL,
      submission_date TEXT NOT NULL,
      estimated_size TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'submitted',
      priority TEXT DEFAULT NULL,
      pm_notes TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS production_support (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      submitter_name TEXT NOT NULL,
      submission_date TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'medium',
      affected_system TEXT,
      status TEXT NOT NULL DEFAULT 'submitted',
      priority TEXT DEFAULT NULL,
      pm_notes TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bau_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      submitter_name TEXT NOT NULL,
      submission_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'submitted',
      pm_notes TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
