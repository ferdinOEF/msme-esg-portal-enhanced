export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/esg-plans?userId=...
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const plans = await prisma.eSGPlan.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            scheme: {
              select: { id: true, name: true, shortCode: true, type: true }
            }
          },
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
        },
        _count: { select: { items: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('[esg-plans.GET] error', error);
    return NextResponse.json(
      { error: 'Failed to fetch ESG plans' },
      { status: 500 }
    );
  }
}

// POST /api/esg-plans
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.userId || !body.name || !body.companyName) {
      return NextResponse.json(
        { error: 'userId, name, and companyName are required' },
        { status: 400 }
      );
    }

    const plan = await prisma.eSGPlan.create({
      data: {
        userId: body.userId,
        name: body.name,
        description: body.description || null,
        companyName: body.companyName,
        sector: body.sector || '',
        size: body.size || 'MICRO',
        state: body.state || '',
        udyamNumber: body.udyamNumber || null,
        turnoverCr: body.turnoverCr ? parseFloat(body.turnoverCr) : null,
        status: body.status || 'DRAFT',
        targetDate: body.targetDate ? new Date(body.targetDate) : null,
      },
      include: {
        items: {
          include: {
            scheme: {
              select: { id: true, name: true, shortCode: true, type: true }
            }
          }
        },
        _count: { select: { items: true } }
      }
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error('[esg-plans.POST] error', error);
    return NextResponse.json(
      { error: 'Failed to create ESG plan' },
      { status: 500 }
    );
  }
}