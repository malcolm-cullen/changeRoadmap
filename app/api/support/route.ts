import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM production_support ORDER BY created_at DESC').all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();

  const insert = db.prepare(`
    INSERT INTO production_support (title, description, submitter_name, submission_date, severity, affected_system)
    VALUES (@title, @description, @submitter_name, @submission_date, @severity, @affected_system)
  `);

  const result = insert.run(body);
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
