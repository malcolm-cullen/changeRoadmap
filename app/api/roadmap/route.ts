import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const pool = await db();

  const [{ rows: projects }, { rows: krs }, { rows: features }, { rows: support }, { rows: bau }] =
    await Promise.all([
      pool.query("SELECT *, 'project' as type FROM projects ORDER BY created_at DESC"),
      pool.query('SELECT * FROM key_results ORDER BY project_id, row_number'),
      pool.query("SELECT *, 'feature' as type FROM feature_requests ORDER BY created_at DESC"),
      pool.query("SELECT *, 'support' as type FROM production_support ORDER BY created_at DESC"),
      pool.query("SELECT *, 'bau' as type FROM bau_items ORDER BY created_at DESC"),
    ]);

  const projectsWithKrs = projects.map((p) => ({
    ...p,
    key_results: krs.filter((kr) => kr.project_id === p.id),
  }));

  return NextResponse.json({ projects: projectsWithKrs, features, support, bau });
}
