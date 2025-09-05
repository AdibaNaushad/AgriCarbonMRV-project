import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useT } from "@/components/agri/i18n";

interface ProjectRecord {
  id: string;
  ts: number;
  est: { credits: number };
}

function load(): ProjectRecord[] {
  try { return JSON.parse(localStorage.getItem("agrimrv.projects") || "[]"); } catch { return []; }
}

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString();
}

export default function MarketGraph() {
  const [items, setItems] = useState<ProjectRecord[]>([]);
  useEffect(() => {
    setItems(load());
  }, []);

  const data = useMemo(() => {
    const map = new Map<string, { date: string; credits: number }>();
    for (const r of items) {
      const key = formatDate(r.ts);
      const cur = map.get(key) || { date: key, credits: 0 };
      cur.credits += r.est?.credits || 0;
      map.set(key, cur);
    }
    const arr = Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return arr.length ? arr : [{ date: formatDate(Date.now()), credits: 0 }];
  }, [items]);

  const total = items.reduce((a, r) => a + (r.est?.credits || 0), 0);
  const t = useT();

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">{t("home.graph.title")}</div>
        <div className="text-xs text-muted-foreground">{t("home.graph.total")}: {total.toFixed(0)}</div>
      </div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="mk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} width={30} />
            <Tooltip />
            <Area type="monotone" dataKey="credits" stroke="#059669" fill="url(#mk)" name="Credits" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
