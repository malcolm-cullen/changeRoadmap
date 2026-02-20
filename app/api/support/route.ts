import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const pool = await db();
  const { rows } = await pool.query('SELECT * FROM production_support ORDER BY created_at DESC');
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const pool = await db();

  const { rows } = await pool.query(
    `INSERT INTO production_support (title, description, submitter_name, submission_date, severity, affected_system)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [body.title, body.description, body.submitter_name, body.submission_date, body.severity, body.affected_system]
  );
  return NextResponse.json({ id: rows[0].id }, { status: 201 });
}
