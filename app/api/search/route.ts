export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { globalSearch } from '@/lib/db-utils';

// GET /api/search?q=...&limit=...
export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('q');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        schemes: [], 
        legalDocs: [], 
        templates: [] 
      });
    }

    const results = await globalSearch(query.trim(), limit);
    return NextResponse.json(results);
  } catch (error) {
    console.error('[search.GET] error', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}