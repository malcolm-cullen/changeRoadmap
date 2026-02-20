import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const pool = await db();
  const { rows } = await pool.query('SELECT * FROM bau_items ORDER BY created_at DESC');
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const pool = await db();

  const { rows } = await pool.query(
    `INSERT INTO bau_items (title, description, category, submitter_name, submission_date)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [body.title, body.description, body.category, body.submitter_name, body.submission_date]
  );
  return NextResponse.json({ id: rows[0].id }, { status: 201 });
}
