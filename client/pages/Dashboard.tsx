import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useT } from "@/components/agri/i18n";

interface ProjectRecord {
  id: string;
  ts: number;
  est: { co2Tons: number; credits: number; incomeINR: number; waterSavedKL: number; envScore: number; communityImpact: number };
  payload: { crop: string; projectType: string; lat?: number; lon?: number; areaHa: number };
  images: string[];
  description: string;
  hash: string;
}

function loadProjects(): ProjectRecord[] {
  try {
    return JSON.parse(localStorage.getItem("agrimrv.projects") || "[]");
  } catch {
    return [];
  }
}

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString();
}

export default function Dashboard() {
  const [items, setItems] = useState<ProjectRecord[]>([]);
  useEffect(() => {
    setItems(loadProjects());
  }, []);

  const totals = useMemo(() => {
    return items.reduce(
      (acc, r) => {
        acc.credits += r.est.credits;
        acc.income += r.est.incomeINR;
        acc.co2 += r.est.co2Tons;
        acc.water += r.est.waterSavedKL;
        return acc;
      },
      { credits: 0, income: 0, co2: 0, water: 0 },
    );
  }, [items]);

  const chartData = useMemo(() => {
    const map = new Map<string, { date: string; credits: number; income: number }>();
    for (const r of items) {
      const key = formatDate(r.ts);
      const cur = map.get(key) || { date: key, credits: 0, income: 0 };
      cur.credits += r.est.credits;
      cur.income += r.est.incomeINR;
      map.set(key, cur);
    }
    return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [items]);

  const t = useT();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t("dash.title")}</h1>
      <p className="text-sm text-muted-foreground">{t("dash.subtitle")}</p>

      <div className="grid sm:grid-cols-4 gap-4 mt-6">
        <Stat title={t("dash.projects")} value={items.length.toString()} />
        <Stat title={t("stats.credits")} value={totals.credits.toFixed(2)} />
        <Stat title={t("stats.income")} value={`₹${Math.round(totals.income).toLocaleString()}`} />
        <Stat title="CO₂ (t)" value={totals.co2.toFixed(2)} />
      </div>

      <div className="mt-6 rounded-xl border bg-white/70 backdrop-blur p-4">
        <h2 className="font-semibold mb-2">Credits & Income</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="gr1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area yAxisId="left" type="monotone" dataKey="credits" stroke="#059669" fill="url(#gr1)" name="Credits" />
              <Area yAxisId="right" type="monotone" dataKey="income" stroke="#84cc16" fillOpacity={0.15} fill="#84cc16" name="Income (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2 className="mt-8 font-semibold">{t("dash.projects")}</h2>
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        {items.map((r) => (
          <div key={r.id} className="rounded-xl border bg-white/70 backdrop-blur p-4 flex gap-3">
            {r.images?.[0] ? (
              <img src={r.images[0]} alt="project" className="h-20 w-28 object-cover rounded-md border" />
            ) : (
              <div className="h-20 w-28 rounded-md bg-emerald-100 border" />
            )}
            <div className="flex-1">
              <div className="text-sm font-semibold">{r.payload.projectType} – {r.payload.crop}</div>
              <div className="text-xs text-muted-foreground">{formatDate(r.ts)} • {r.payload.areaHa} ha • {r.payload.lat ? `${r.payload.lat.toFixed(3)}, ${r.payload.lon?.toFixed(3)}` : "No GPS"}</div>
              <div className="text-sm mt-1">Credits: <b>{r.est.credits}</b> • Income: <b>₹{r.est.incomeINR.toLocaleString()}</b></div>
              <div className="text-[11px] text-muted-foreground break-all">Hash: {r.hash.slice(0, 24)}…</div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground">{t("dash.noProjects")}</div>
        )}
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
