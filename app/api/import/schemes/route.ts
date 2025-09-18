export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function ok(req: NextRequest) {
  const key = req.headers.get('x-admin-key') || ''
  return !!key && !!process.env.ADMIN_KEY && key === process.env.ADMIN_KEY
}

export async function POST(req: NextRequest) {
  if (!ok(req)) return new NextResponse('Unauthorized', { status: 401 })

  const text = await req.text()
  const lines = text.split(/\r?\n/).filter(Boolean)
  const header = (lines.shift()?.split(',').map(s => s.trim()) || [])

  const reqCols = ['name', 'type', 'authority']
  for (const c of reqCols) {
    if (!header.includes(c)) return new NextResponse('Bad CSV header', { status: 400 })
  }

  const idx = (k: string) => header.indexOf(k)

  let count = 0
  for (const line of lines) {
    const cells = line.split(',')

    const item = {
      name: (cells[idx('name')] || '').trim(),
      shortCode: (cells[idx('shortCode')] || '').trim() || null,
      type: (cells[idx('type')] || 'scheme').trim(),
      authority: (cells[idx('authority')] || '').trim(),
      pillar: String(cells[idx('pillar')] || '')
        .replace(/\|/g, ',')
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean)
        .join(','),
      tags: String(cells[idx('tags')] || '')
        .replace(/\|/g, ',')
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean)
        .join(','),
      description: cells[idx('description')] || '',
      benefits: cells[idx('benefits')] || null,
      eligibility: cells[idx('eligibility')] || null,
      documentsUrl: cells[idx('documentsUrl')] || null,
    }

    await prisma.scheme.upsert({
      where: { name: item.name },
      update: item,
      create: item,
    })

    count++
  }

  return NextResponse.json({ count })
}
