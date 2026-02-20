import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM bau_items ORDER BY created_at DESC').all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();

  const insert = db.prepare(`
    INSERT INTO bau_items (title, description, category, submitter_name, submission_date)
    VALUES (@title, @description, @category, @submitter_name, @submission_date)
  `);

  const result = insert.run(body);
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
