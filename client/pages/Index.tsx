import AnimatedBackground from "@/components/agri/AnimatedBackground";
import VoiceAssistant from "@/components/agri/VoiceAssistant";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DataGallery from "@/components/agri/DataGallery";
import MarketGraph from "@/components/agri/MarketGraph";
import { useT } from "@/components/agri/i18n";
import { Satellite, Sprout, Coins, Mic, ArrowRight } from "lucide-react";
import AddProject from "./AddProject";
import Dashboard from "./Dashboard";
import Market from "./Market";
import Support from "./Support";

export default function Index() {
  const t = useT();
  return (
    <div className="relative" id="top">
      <AnimatedBackground />
      <section className="relative container mx-auto px-4 pt-10 pb-8 sm:pt-16 sm:pb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> {t("hero.badge")}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {t("hero.tagline")}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              {t("hero.subline")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
                <Link to="/add-project">{t("cta.addProject")}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href="#learn">{t("cta.learnMore")}</a>
              </Button>
            </div>
            <div className="mt-6"><VoiceAssistant /></div>
          </div>
          <div className="relative">
            <div className="rounded-2xl border bg-white/60 backdrop-blur p-4 shadow-sm">
              <div className="grid grid-cols-3 gap-3 text-center">
                <MiniCard icon={<Satellite className="h-5 w-5 text-emerald-600" />} title="Satellite" desc={t("mini.satellite")} />
                <MiniCard icon={<Sprout className="h-5 w-5 text-green-600" />} title="Farms" desc={t("mini.farms")} />
                <MiniCard icon={<Coins className="h-5 w-5 text-lime-600" />} title="Income" desc={t("mini.income")} />
              </div>
              <div className="mt-4 relative h-56 rounded-xl bg-gradient-to-br from-emerald-100 to-green-50 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" fill="none">
                  <defs>
                    <linearGradient id="ln" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#22c55e"/><stop offset="100%" stopColor="#10b981"/></linearGradient>
                  </defs>
                  <circle cx="340" cy="30" r="14" stroke="url(#ln)" strokeWidth="3" fill="white" />
                  <circle cx="60" cy="120" r="6" fill="#16a34a" />
                  <circle cx="120" cy="160" r="6" fill="#16a34a" />
                  <circle cx="200" cy="110" r="6" fill="#16a34a" />
                  <path d="M340 30 C 300 60, 200 60, 60 120" stroke="url(#ln)" strokeWidth="2" strokeDasharray="4 6" />
                  <path d="M340 30 C 300 90, 240 120, 120 160" stroke="url(#ln)" strokeWidth="2" strokeDasharray="4 6" />
                  <path d="M340 30 C 310 60, 260 90, 200 110" stroke="url(#ln)" strokeWidth="2" strokeDasharray="4 6" />
                </svg>
                <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
                  <Badge>CO₂ calc: live</Badge>
                  <Badge>Credits: +12</Badge>
                  <Badge>₹: +9,600</Badge>
                </div>
              </div>
              <div className="mt-4">
                <MarketGraph />
              </div>
              <div className="mt-4">
                <DataGallery />
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              The system connects satellites to farmlands, computes carbon credits, and pays farmers in rupees.
            </div>
          </div>
        </div>
      </section>

      <section id="learn" className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-4">
          <Feature title={t("voice.idle")} desc="" icon={<Mic className="h-5 w-5" />} />
          <Feature title="GPS & Camera" desc="" icon={<ArrowRight className="h-5 w-5" />} />
          <Feature title="Blockchain Verified" desc="" icon={<ArrowRight className="h-5 w-5" />} />
        </div>
      </section>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] rounded-md bg-white/70 backdrop-blur border px-2 py-1 text-center font-medium">
      {children}
    </div>
  );
}

function MiniCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-lg border p-3 bg-white">
      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-emerald-50 mx-auto mb-2">{icon}</div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}

function Feature({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-4">
      <div className="flex items-center gap-2 text-emerald-700 font-semibold"><span className="h-6 w-6 inline-flex items-center justify-center rounded-md bg-emerald-50">{icon}</span> {title}</div>
      <div className="text-sm text-muted-foreground mt-1">{desc}</div>
    </div>
  );
}
