import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const pool = await db();
  const { rows: projects } = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
  const { rows: krs } = await pool.query('SELECT * FROM key_results ORDER BY project_id, row_number');

  const result = projects.map((p) => ({
    ...p,
    key_results: krs.filter((kr) => kr.project_id === p.id),
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const pool = await db();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO projects (initiative_name, submitter_name, submission_date, problem_today, problem_why_now, problem_who_impacted, business_objective)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [body.initiative_name, body.submitter_name, body.submission_date, body.problem_today, body.problem_why_now, body.problem_who_impacted, body.business_objective]
    );
    const projectId = rows[0].id;

    const krs = (body.key_results as Record<string, string>[]) || [];
    for (let i = 0; i < krs.length; i++) {
      const kr = krs[i];
      await client.query(
        `INSERT INTO key_results (project_id, row_number, key_result, baseline, target, measurement_source)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [projectId, i + 1, kr.key_result, kr.baseline, kr.target, kr.measurement_source]
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ id: projectId }, { status: 201 });
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
