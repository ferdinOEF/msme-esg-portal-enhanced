export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Jurisdiction } from '@prisma/client'

function ok(req: NextRequest) {
  const key = req.headers.get('x-admin-key') || ''
  return !!key && !!process.env.ADMIN_KEY && key === process.env.ADMIN_KEY
}

export async function POST(req: NextRequest) {
  if (!ok(req)) return new NextResponse('Unauthorized', { status: 401 })

  const text = await req.text()
  const lines = text.split(/\r?\n/).filter(Boolean)
  const header = (lines.shift()?.split(',').map(s => s.trim()) || [])

  // We at least need a title
  if (!header.includes('title')) return new NextResponse('Bad CSV header', { status: 400 })

  const idx = (k: string) => header.indexOf(k)

  let count = 0
  for (const line of lines) {
    const cells = line.split(',')

    const title = (cells[idx('title')] || '').trim()
    if (!title) continue

    const jurisdictionStr = (cells[idx('jurisdiction')] || 'CENTRAL').trim().toUpperCase()
    const jurisdiction = Object.values(Jurisdiction).includes(jurisdictionStr as Jurisdiction) 
      ? (jurisdictionStr as Jurisdiction) 
      : Jurisdiction.CENTRAL
    const sector = (cells[idx('sector')] || '').trim() || null
    const locationTag = (cells[idx('locationTag')] || '').trim() || null
    const summary = (cells[idx('summary')] || '').trim()
    const url = (cells[idx('url')] || '').trim() || null

    // Normalize tags: allow "|" or "," in source, store as comma-separated string
    const tags = String(cells[idx('tags')] || '')
      .replace(/\|/g, ',')
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)
      .join(',')

    await prisma.legalDoc.create({
      data: {
        title,
        jurisdiction,
        sector,
        locationTag,
        summary,
        url,
        tags,
      },
    })

    count++
  }

  return NextResponse.json({ count })
}
