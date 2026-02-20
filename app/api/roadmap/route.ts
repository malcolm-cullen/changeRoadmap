import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();

  const projects = db.prepare('SELECT *, \'project\' as type FROM projects ORDER BY created_at DESC').all();
  const krs = db.prepare('SELECT * FROM key_results ORDER BY project_id, row_number').all();
  const features = db.prepare('SELECT *, \'feature\' as type FROM feature_requests ORDER BY created_at DESC').all();
  const support = db.prepare('SELECT *, \'support\' as type FROM production_support ORDER BY created_at DESC').all();
  const bau = db.prepare('SELECT *, \'bau\' as type FROM bau_items ORDER BY created_at DESC').all();

  const projectsWithKrs = (projects as Record<string, unknown>[]).map((p) => ({
    ...p,
    key_results: (krs as Record<string, unknown>[]).filter((kr) => kr.project_id === p.id),
  }));

  return NextResponse.json({
    projects: projectsWithKrs,
    features,
    support,
    bau,
  });
}
