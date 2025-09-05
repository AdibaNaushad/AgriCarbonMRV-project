import { Building2, ShieldCheck, Leaf, Globe, Sparkles, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectRecord {
  id: string;
  ts: number;
  est: { credits: number; incomeINR: number };
  payload: { projectType: string; crop: string; areaHa: number };
  images: string[];
  hash: string;
}

function loadProjects(): ProjectRecord[] {
  try { return JSON.parse(localStorage.getItem("agrimrv.projects") || "[]"); } catch { return []; }
}

export default function Market() {
  const items = loadProjects();
  const totalCredits = items.reduce((a, r) => a + (r.est?.credits || 0), 0);

  return (
    <div className="container mx-auto px-4 py-10">
      <section className="rounded-2xl border bg-white/70 backdrop-blur p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs mb-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Verified, Farmer-First Supply
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">Buy High-Impact Carbon Credits</h1>
            <p className="text-muted-foreground mt-2">Direct from smallholder farmers. Transparent MRV with blockchain proof and satellite-backed estimates.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600"><ShoppingCart className="mr-2 h-4 w-4" /> Get Credits</Button>
              <a href="/support" className="inline-flex h-10 px-4 items-center rounded-md border text-sm">Talk to us</a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <KPI label="Available Credits" value={totalCredits.toFixed(0)} />
            <KPI label="Projects" value={items.length.toString()} />
            <KPI label="Countries" value="1+" />
          </div>
        </div>
      </section>

      <section className="mt-8 grid md:grid-cols-3 gap-4">
        <Value icon={<Leaf className="h-5 w-5 text-green-700" />} title="Real Climate Impact" desc="Agroforestry, Rice and Mixed projects with tangible co-benefits: water saved, soil health, livelihoods." />
        <Value icon={<ShieldCheck className="h-5 w-5 text-emerald-700" />} title="Auditable & Tamper-Proof" desc="Each project gets a SHA-256 hash for verification. Clean, traceable provenance." />
        <Value icon={<Building2 className="h-5 w-5 text-lime-700" />} title="Corporate Ready" desc="Purchase at scale, receive receipts, export docs. Perfect for ESG and CSR reporting." />
      </section>

      <section className="mt-10">
        <h2 className="font-semibold mb-2">Featured Farmer Projects</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {items.slice(0, 6).map((r) => (
            <div key={r.id} className="rounded-xl border bg-white/70 backdrop-blur p-4 flex gap-3">
              {r.images?.[0] ? (
                <img src={r.images[0]} alt="project" className="h-20 w-28 object-cover rounded-md border" />
              ) : (
                <div className="h-20 w-28 rounded-md bg-emerald-100 border" />
              )}
              <div className="flex-1">
                <div className="text-sm font-semibold">{r.payload.projectType} – {r.payload.crop}</div>
                <div className="text-xs text-muted-foreground">Area: {r.payload.areaHa} ha • ID: {r.id}</div>
                <div className="text-sm mt-1">Credits: <b>{r.est.credits}</b></div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" className="bg-emerald-600">Buy</Button>
                  <a className="text-xs underline self-center" href="/support">Learn more</a>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="rounded-xl border bg-white/70 backdrop-blur p-6 text-sm text-muted-foreground">No listings yet. Ask farmers to add projects to populate supply.</div>
          )}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border bg-white/70 backdrop-blur p-6">
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <Badge icon={<Globe className="h-4 w-4" />} text="Global-standard MRV" />
          <Badge icon={<ShieldCheck className="h-4 w-4" />} text="Blockchain Verification" />
          <Badge icon={<Sparkles className="h-4 w-4" />} text="AI Insights" />
          <Badge icon={<Leaf className="h-4 w-4" />} text="Farmer-first & Green" />
        </div>
      </section>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-3 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function Value({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
      <div className="flex items-center gap-2 font-semibold">{icon} {title}</div>
      <div className="text-sm text-muted-foreground mt-1">{desc}</div>
    </div>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2">
      <span className="h-6 w-6 inline-flex items-center justify-center rounded-md bg-emerald-50">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
