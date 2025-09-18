import { useMemo, useState } from "react";
import SchemeCard from "@/components/SchemeCard";

type Scheme = {
  id: string;
  name: string;
  shortCode?: string | null;
  type: string;
  authority: string;
  description: string;
  benefits?: string | null;
  eligibility?: string | null;
  documentsUrl?: string | null;
  tags?: string | null; // comma-separated
};

export default function SchemesClient({ schemes }: { schemes: Scheme[] }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const sc of schemes) {
      (sc.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((t) => s.add(t));
    }
    return Array.from(s).sort();
  }, [schemes]);

  const filtered = useMemo(() => {
    const qq = q.toLowerCase().trim();
    const tt = tag.toLowerCase().trim();
    return schemes.filter((s) => {
      const hay =
        (s.name || "") +
        " " +
        (s.shortCode || "") +
        " " +
        (s.description || "") +
        " " +
        (s.eligibility || "") +
        " " +
        (s.benefits || "") +
        " " +
        (s.tags || "");
      const okQ = !qq || hay.toLowerCase().includes(qq);
      const okTag =
        !tt ||
        (s.tags || "")
          .toLowerCase()
          .split(",")
          .map((t) => t.trim())
          .includes(tt);
      return okQ && okTag;
    });
  }, [schemes, q, tag]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, description, eligibility…"
          className="border rounded px-3 py-2 w-full md:w-96"
          aria-label="Search schemes"
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-60"
          aria-label="Filter by tag"
        >
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((s) => (
          <SchemeCard key={s.id} scheme={s} />
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-slate-600">
            No schemes match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
