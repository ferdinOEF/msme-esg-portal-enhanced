export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db-utils';

// GET /api/dashboard?userId=...
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const stats = await getDashboardStats(userId);
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('[dashboard.GET] error', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}