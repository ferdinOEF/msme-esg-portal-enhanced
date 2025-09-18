export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/db'

type TemplateCard = {
  id: string
  title: string
  category: string
  contentMd: string
  tags: string
}

export default async function ToolsPage() {
  const templates: TemplateCard[] = await prisma.template.findMany({
    orderBy: { title: 'asc' },
    select: { id: true, title: true, category: true, contentMd: true, tags: true },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Compliance Tools</h1>
      <p className="text-sm text-slate-600">Downloadable checklists, audit templates, and policy samples.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="rounded-lg border p-4 shadow-sm bg-white">
            <div className="text-lg font-semibold">{t.title}</div>
            <div className="text-xs text-slate-500">{t.category.toUpperCase()}</div>

            {t.tags ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {t.tags.split(',').map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            ) : null}

            <pre className="bg-slate-50 rounded p-2 mt-2 text-xs whitespace-pre-wrap">
              {t.contentMd}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
