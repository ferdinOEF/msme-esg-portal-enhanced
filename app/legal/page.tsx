export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db'

export default async function LegalPage() {
  const docs = await prisma.legalDoc.findMany({ orderBy: { createdAt: 'desc' } })
  type Doc = typeof docs[number]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Legal Hub</h1>
      <p className="text-sm text-slate-600">
        CPCB guidelines, NGT rulings, central & Goa state rules â€” mapped for MSMEs.
      </p>

      <div className="space-y-3">
        {docs.map((d: Doc) => (
          <div key={d.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{d.title}</div>
                <div className="text-xs text-slate-500">
                  {d.jurisdiction}
                  {d.sector ? ` â€¢ ${d.sector}` : ''}
                  {d.locationTag ? ` â€¢ ${d.locationTag}` : ''}
                </div>
              </div>
              {d.url && (
                <a className="btn" href={d.url} target="_blank">
                  Open
                </a>
              )}
            </div>
            <p className="text-sm mt-2">{d.summary}</p>
            <div className="text-xs mt-2">Tags: {d.tags}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
