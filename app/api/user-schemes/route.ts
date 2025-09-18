export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/user-schemes?userId=...
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const userSchemes = await prisma.userScheme.findMany({
      where: { userId },
      include: {
        scheme: {
          select: {
            id: true,
            name: true,
            shortCode: true,
            type: true,
            authority: true,
            pillar: true,
            priority: true,
            documentsUrl: true,
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ userSchemes });
  } catch (error) {
    console.error('[user-schemes.GET] error', error);
    return NextResponse.json(
      { error: 'Failed to fetch user schemes' },
      { status: 500 }
    );
  }
}

// POST /api/user-schemes
// Body: { userId: string, schemeId: string, status?: string, isFavorite?: boolean, notes?: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.userId || !body.schemeId) {
      return NextResponse.json(
        { error: 'userId and schemeId are required' },
        { status: 400 }
      );
    }

    const data: any = {
      userId: body.userId,
      schemeId: body.schemeId,
      status: body.status || 'INTERESTED',
      isFavorite: body.isFavorite ?? false,
      notes: body.notes || null,
    };

    // Set timestamps based on status
    if (body.status === 'APPLIED') {
      data.appliedAt = new Date();
    } else if (body.status === 'COMPLETED') {
      data.completedAt = new Date();
    }

    const userScheme = await prisma.userScheme.upsert({
      where: {
        userId_schemeId: {
          userId: body.userId,
          schemeId: body.schemeId
        }
      },
      update: data,
      create: data,
      include: {
        scheme: {
          select: {
            id: true,
            name: true,
            shortCode: true,
            type: true,
            authority: true,
            pillar: true,
            priority: true,
          }
        }
      }
    });

    return NextResponse.json({ userScheme });
  } catch (error) {
    console.error('[user-schemes.POST] error', error);
    return NextResponse.json(
      { error: 'Failed to update user scheme' },
      { status: 500 }
    );
  }
}

// DELETE /api/user-schemes?userId=...&schemeId=...
export async function DELETE(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const schemeId = req.nextUrl.searchParams.get('schemeId');

    if (!userId || !schemeId) {
      return NextResponse.json(
        { error: 'userId and schemeId are required' },
        { status: 400 }
      );
    }

    await prisma.userScheme.delete({
      where: {
        userId_schemeId: { userId, schemeId }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[user-schemes.DELETE] error', error);
    return NextResponse.json(
      { error: 'Failed to delete user scheme' },
      { status: 500 }
    );
  }
}