export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCategories } from '@/lib/db-utils';

// GET /api/categories
export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('[categories.GET] error', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories
export async function POST(req: NextRequest) {
  try {
    const key = req.headers.get('x-admin-key') || '';
    if (!key || !process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: body.name,
        description: body.description || null,
        color: body.color || null,
        icon: body.icon || null,
        parentId: body.parentId || null,
      },
      include: {
        parent: true,
        children: true,
        _count: { select: { schemes: true } }
      }
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('[categories.POST] error', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}