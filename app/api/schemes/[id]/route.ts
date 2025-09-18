export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSchemeById } from '@/lib/db-utils';

// GET /api/schemes/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = req.nextUrl.searchParams.get('userId') || undefined;
    const scheme = await getSchemeById(params.id, userId);

    if (!scheme) {
      return NextResponse.json(
        { error: 'Scheme not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ scheme });
  } catch (error) {
    console.error('[schemes.GET] error', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheme' },
      { status: 500 }
    );
  }
}

// PUT /api/schemes/[id] - Update scheme
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const key = req.headers.get('x-admin-key') || '';
    if (!key || !process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Process pillar and tags
    const pillar = String(body.pillar || '')
      .replace(/\|/g, ',')
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)
      .join(',');

    const tags = String(body.tags || '')
      .replace(/\|/g, ',')
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)
      .join(',');

    const scheme = await prisma.scheme.update({
      where: { id: params.id },
      data: {
        name: body.name,
        shortCode: body.shortCode || null,
        type: body.type,
        categoryId: body.categoryId || null,
        authority: body.authority || null,
        jurisdiction: body.jurisdiction || 'CENTRAL',
        pillar,
        description: body.description || null,
        benefits: body.benefits || null,
        eligibility: body.eligibility || null,
        documentsUrl: body.documentsUrl || null,
        tags,
        priority: body.priority || 'MEDIUM',
        isActive: body.isActive ?? true,
      },
      include: {
        category: true,
        _count: { select: { files: true, userSchemes: true } }
      }
    });

    return NextResponse.json({ scheme });
  } catch (error) {
    console.error('[schemes.PUT] error', error);
    return NextResponse.json(
      { error: 'Failed to update scheme' },
      { status: 500 }
    );
  }
}

// DELETE /api/schemes/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const key = req.headers.get('x-admin-key') || '';
    if (!key || !process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.scheme.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[schemes.DELETE] error', error);
    return NextResponse.json(
      { error: 'Failed to delete scheme' },
      { status: 500 }
    );
  }
}