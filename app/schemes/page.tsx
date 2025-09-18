export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'

type SchemeCard = {
  id: string
  name: string
  shortCode: string | null
  type: string
  authority: string | null
  tags: string
  description: string | null
  benefits: string | null
  eligibility: string | null
  documentsUrl: string | null
}

export default async function SchemesPage() {
  const schemes: SchemeCard[] = await prisma.scheme.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      shortCode: true,
      type: true,
      authority: true,
      tags: true,
      description: true,
      benefits: true,
      eligibility: true,
      documentsUrl: true,
    },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Schemes & Certifications</h1>
      <p className="text-sm text-slate-600">Browse and manage applicable schemes.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schemes.map((s) => (
          <div key={s.id} className="rounded-lg border p-4 shadow-sm bg-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{s.name}</div>
                <div className="text-xs text-slate-500">
                  {s.shortCode ? `${s.shortCode} · ` : ''}{s.type}
                  {s.authority ? ` · ${s.authority}` : ''}
                </div>
              </div>
              {s.documentsUrl ? (
                <a
                  href={s.documentsUrl}
                  className="text-sm text-blue-600 hover:underline"
                  target="_blank"
                >
                  Docs
                </a>
              ) : null}
            </div>

            {s.tags ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {s.tags.split(',').map((t) => (
                  <span key={t} className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                    {t.trim()}
                  </span>
                ))}
              </div>
            ) : null}

            {s.description ? (
              <p className="mt-3 text-sm">{s.description}</p>
            ) : null}

            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium">Details</summary>
              <div className="mt-2 space-y-2 text-sm">
                {s.eligibility && (
                  <div>
                    <div className="font-medium">Eligibility</div>
                    <p>{s.eligibility}</p>
                  </div>
                )}
                {s.benefits && (
                  <div>
                    <div className="font-medium">Benefits</div>
                    <p>{s.benefits}</p>
                  </div>
                )}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  )
}
