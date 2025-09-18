export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/files?schemeId=...
// Returns files linked to a scheme
export async function GET(req: NextRequest) {
  try {
    const schemeId = req.nextUrl.searchParams.get('schemeId');
    if (!schemeId) {
      return NextResponse.json({ files: [] });
    }

    const files = await prisma.file.findMany({
      where: { schemeId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        url: true,
        type: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ files });
  } catch (err) {
    console.error('[files.GET] error', err);
    return NextResponse.json({ error: 'Failed to load files' }, { status: 500 });
  }
}

// POST /api/files
// Body: { schemeId: string, name: string, url?: string, type?: 'CIRCULAR'|'FAQ'|'FORM'|'OTHER', status?: 'UPLOADED'|'PENDING' }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) as
      | { schemeId?: string; name?: string; url?: string; type?: string; status?: string }
      | null;

    if (!body?.schemeId || !body?.name) {
      return NextResponse.json(
        { error: 'schemeId and name are required' },
        { status: 400 },
      );
    }

    const file = await prisma.file.create({
      data: {
        schemeId: body.schemeId,
        name: body.name,
        url: body.url ?? null,
        type: (body.type as any) ?? 'OTHER',
        status: (body.status as any) ?? 'UPLOADED',
      },
      select: {
        id: true,
        name: true,
        url: true,
        type: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ file }, { status: 201 });
  } catch (err) {
    console.error('[files.POST] error', err);
    return NextResponse.json({ error: 'Failed to create file record' }, { status: 500 });
  }
}

// DELETE /api/files?id=...
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await prisma.file.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[files.DELETE] error', err);
    return NextResponse.json({ error: 'Failed to delete file record' }, { status: 500 });
  }
}
