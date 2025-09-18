export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Data shapes for the graph response
type GraphNode = { id: string; label: string; name: string }
type GraphLink = { source: string; target: string; relation: string }

export async function GET() {
  // Infer the element type of the findMany result to satisfy TS
  const schemes = await prisma.scheme.findMany({ include: { linksFrom: true } })
  type SchemeWithLinks = typeof schemes[number]
  type LinkRow = SchemeWithLinks['linksFrom'][number]

  const nodes: GraphNode[] = schemes.map((s: SchemeWithLinks) => ({
    id: s.id,
    label: s.shortCode || s.name,
    name: s.name,
  }))

  const links: GraphLink[] = schemes.flatMap((s: SchemeWithLinks) =>
    s.linksFrom.map((l: LinkRow) => ({
      source: l.fromId,
      target: l.toId,
      relation: l.relation,
    })),
  )

  return NextResponse.json({ nodes, links })
}
