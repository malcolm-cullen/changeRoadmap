import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  const krs = db.prepare('SELECT * FROM key_results ORDER BY project_id, row_number').all();

  const result = (projects as Record<string, unknown>[]).map((p) => ({
    ...p,
    key_results: (krs as Record<string, unknown>[]).filter((kr) => kr.project_id === p.id),
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();

  const insert = db.prepare(`
    INSERT INTO projects (initiative_name, submitter_name, submission_date, problem_today, problem_why_now, problem_who_impacted, business_objective)
    VALUES (@initiative_name, @submitter_name, @submission_date, @problem_today, @problem_why_now, @problem_who_impacted, @business_objective)
  `);

  const insertKr = db.prepare(`
    INSERT INTO key_results (project_id, row_number, key_result, baseline, target, measurement_source)
    VALUES (@project_id, @row_number, @key_result, @baseline, @target, @measurement_source)
  `);

  const transaction = db.transaction((data: Record<string, unknown>) => {
    const result = insert.run(data);
    const projectId = result.lastInsertRowid;

    const krs = (data.key_results as Record<string, unknown>[]) || [];
    krs.forEach((kr, i) => {
      insertKr.run({ project_id: projectId, row_number: i + 1, ...kr });
    });

    return projectId;
  });

  const id = transaction(body);
  return NextResponse.json({ id }, { status: 201 });
}
