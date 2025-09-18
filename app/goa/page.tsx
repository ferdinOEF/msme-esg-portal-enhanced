import { prisma } from "@/lib/db";
import type { Scheme, LegalDoc } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function GoaPage() {
  const [goaSchemes, goaDocs]: [Scheme[], LegalDoc[]] = await Promise.all([
    prisma.scheme.findMany({
      where: { tags: { contains: "goa", mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.legalDoc.findMany({
      where: { locationTag: { contains: "goa", mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Goa — State incentives & notices</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="text-lg font-semibold mb-2">Goa Circulars / Legal</div>
          <ul className="text-sm list-disc ml-5">
            {goaDocs.map((d: LegalDoc) => <li key={d.id}>{d.title}</li>)}
          </ul>
        </div>

        <div className="card">
          <div className="text-lg font-semibold mb-2">Goa-specific Schemes / Top-ups</div>
          <ul className="text-sm list-disc ml-5">
            {goaSchemes.map((s: Scheme) => (
              <li key={s.id}>{s.name} {s.shortCode ? `(${s.shortCode})` : ""}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
