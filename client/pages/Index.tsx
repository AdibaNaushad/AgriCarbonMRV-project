import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { estimate, ProjectType } from "@/components/agri/Estimator";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sprout, Coins, Leaf, MapPin, Sparkles } from "lucide-react";

interface ProjectRecord {
  id: string;
  ts: number;
  est: { co2Tons: number; credits: number; incomeINR: number; waterSavedKL: number; envScore: number; communityImpact: number };
  payload: { crop: string; projectType: ProjectType; areaHa: number; lat?: number; lon?: number };
  images: string[];
  description: string;
  hash: string;
}

function loadProjects(): ProjectRecord[] {
  try { return JSON.parse(localStorage.getItem("agrimrv.projects") || "[]"); } catch { return []; }
}

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString();
}

export default function Index() {
  const [items, setItems] = useState<ProjectRecord[]>([]);
  useEffect(() => { setItems(loadProjects()); }, []);

  const totals = useMemo(() => items.reduce((a, r) => ({
    co2: a.co2 + r.est.co2Tons,
    credits: a.credits + r.est.credits,
    income: a.income + r.est.incomeINR,
    water: a.water + r.est.waterSavedKL,
    env: Math.min(100, Math.round((a.env + r.est.envScore) / (a.count + 1))),
    community: Math.min(100, Math.round((a.community + r.est.communityImpact) / (a.count + 1))),
    count: a.count + 1,
  }), { co2: 0, credits: 0, income: 0, water: 0, env: 60, community: 60, count: 0 }), [items]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Your Carbon Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your carbon credits, income and projects</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600"><Link to="/add-project"><Sparkles className="mr-2 h-4 w-4"/>Add Project</Link></Button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        {/* Left column (stats + projects) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard title="tCO₂e" value={totals.co2.toFixed(1)} sub="Captured" color="leaf" icon={<Leaf className="h-4 w-4"/>} />
            <StatCard title="Credits" value={totals.credits.toFixed(0)} sub="Generated" color="sun" icon={<Coins className="h-4 w-4"/>} />
            <StatCard title="Income" value={`₹${Math.round(totals.income).toLocaleString()}`} sub="Estimated" color="soil" icon={<Sprout className="h-4 w-4"/>} />
          </div>

          <section>
            <h2 className="font-semibold mb-2">Your Projects</h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {items.slice(0,6).map((r) => (
                <div key={r.id} className="rounded-xl border bg-white/70 backdrop-blur p-4">
                  <div className="flex gap-3">
                    {r.images?.[0] ? <img src={r.images[0]} alt="project" className="h-16 w-24 object-cover rounded-md border"/> : <div className="h-16 w-24 rounded-md bg-emerald-100 border"/>}
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{r.payload.projectType} – {r.payload.crop}</div>
                      <div className="text-[11px] text-muted-foreground">{formatDate(r.ts)} • {r.payload.areaHa} ha</div>
                      <div className="text-sm mt-1">Credits: <b>{r.est.credits}</b></div>
                    </div>
                  </div>
                  {r.payload.lat && (
                    <div className="mt-2 text-[11px] text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/> {r.payload.lat.toFixed(3)}, {r.payload.lon?.toFixed(3)}</div>
                  )}
                </div>
              ))}
              {items.length === 0 && (
                <div className="rounded-xl border bg-white/70 backdrop-blur p-6 text-sm text-muted-foreground">No projects yet. Add one to see results.</div>
              )}
            </div>
          </section>
        </div>

        {/* Right column (calculator + benefits + activity + cta) */}
        <div className="lg:col-span-4 space-y-4">
          <CalculatorCard/>
          <BenefitsCard water={totals.water} env={totals.env} community={totals.community} />
          <ActivityCard items={items.slice(0,4)} />
          <div className="rounded-xl border bg-gradient-to-br from-emerald-600 to-green-600 text-white p-4">
            <div className="font-semibold">Create your next green project</div>
            <p className="text-sm text-white/90">Use GPS, Camera and Voice to onboard in minutes.</p>
            <Button asChild variant="secondary" className="mt-3 bg-white text-emerald-700 hover:bg-white/90"><Link to="/add-project">Add Project</Link></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon }: { title: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
      <div className="text-xs text-muted-foreground flex items-center gap-2">{icon}<span>{title}</span></div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function CalculatorCard() {
  const [type, setType] = useState<ProjectType>("Agroforestry");
  const [area, setArea] = useState<string>("1.0");
  const res = estimate({ projectType: type, areaHa: parseFloat(area) || 0, crop: "Mixed" });
  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
      <div className="font-semibold mb-2">Carbon Credit Calculator</div>
      <div className="grid grid-cols-2 gap-2">
        <select className="h-9 border rounded-md px-2 bg-white" value={type} onChange={(e)=>setType(e.target.value as ProjectType)}>
          <option>Agroforestry</option>
          <option>Rice</option>
          <option>Mixed</option>
        </select>
        <input className="h-9 border rounded-md px-2" type="number" min={0} step="0.1" value={area} onChange={(e)=>setArea(e.target.value)} placeholder="Area (ha)"/>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <CalcBadge label="CO₂" value={`${res.co2Tons}t`} />
        <CalcBadge label="Credits" value={`${res.credits}`} />
        <CalcBadge label="₹" value={`${res.incomeINR.toLocaleString()}`} />
      </div>
    </div>
  );
}
function CalcBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-white px-2 py-1">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function BenefitsCard({ water, env, community }: { water: number; env: number; community: number }) {
  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
      <div className="font-semibold mb-2">Carbon Credits Benefits</div>
      <ul className="text-sm space-y-2">
        <Benefit text={`Water saved: ~${Math.round(water)} KL`} />
        <Benefit text={`Environment protected: ${env}%`} />
        <Benefit text={`Community impacted: ${community}%`} />
      </ul>
    </div>
  );
}
function Benefit({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600"/>{text}</li>
  );
}

function ActivityCard({ items }: { items: ProjectRecord[] }) {
  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
      <div className="font-semibold mb-2">Recent Activity</div>
      <div className="space-y-2">
        {items.map((r) => (
          <div key={r.id} className="text-sm flex items-center justify-between">
            <span>{r.payload.projectType} – {r.payload.crop}</span>
            <span className="text-muted-foreground text-xs">+{r.est.credits} cr • {formatDate(r.ts)}</span>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground">No recent activity.</div>
        )}
      </div>
    </div>
  );
}
