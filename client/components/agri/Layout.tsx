import { Link, NavLink } from "react-router-dom";
import { useLanguage, LANG_LABELS, LangCode } from "./Language";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useT } from "./i18n";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/20 ${isActive ? "text-primary" : "text-foreground/80"}`
      }
    >
      {children}
    </NavLink>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, autoDetect } = useLanguage();
  const t = useT();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (import.meta.env.DEV) {
      // In dev, ensure no SW interferes with HMR
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
      return;
    }
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", () => {
            if (nw.state === "installed" && navigator.serviceWorker.controller) {
              window.location.reload();
            }
          });
        });
      })
      .catch(() => {});
  }, []);

  const [showContact, setShowContact] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-amber-50">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-inner" />
            <span className="font-extrabold tracking-tight text-lg">{t("brand.name")}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <a href="#top" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/20 text-foreground/80">{t("nav.home")}</a>
            <a href="#dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/20 text-foreground/80">{t("nav.dashboard")}</a>
            <a href="#market" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/20 text-foreground/80">{t("nav.market")}</a>
            <a href="#support" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/20 text-foreground/80">{t("nav.support")}</a>
          </nav>
          <div className="flex items-center gap-2">
            <select
              aria-label="Language"
              className="h-9 px-2 rounded-md border bg-white text-sm"
              value={lang}
              onChange={(e) => setLang(e.target.value as LangCode)}
            >
              {Object.entries(LANG_LABELS).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <Button asChild className="hidden sm:inline-flex bg-gradient-to-r from-green-600 to-emerald-600">
              <a href="#add-project">{t("cta.addProject")}</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-12 border-t bg-white/70">
        <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="font-bold mb-2">{t("footer.team")}</h3>
            <p className="text-sm font-semibold text-emerald-700">{t("footer.team.name")}</p>
            <p className="text-sm">Leader Naaz (Female), Adiba (Female), Noor (Female)</p>
            <p className="text-xs text-muted-foreground mt-2">{t("footer.location")}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">{t("footer.links")}</h3>
            <ul className="text-sm space-y-1">
              <li><a href="https://agricoop.gov.in/en/about-us">{t("footer.about")}</a></li>
              <li><button className="underline" onClick={() => setShowContact((v) => !v)}>{t("footer.contact")}</button></li>
              <li><a href="https://farmer.gov.in/Content/privacy-policy.aspx">{t("footer.privacy")}</a></li>
              <li><a href="https://farmer.gov.in/Content/terms-conditions.aspx">{t("footer.terms")}</a></li>
            </ul>
            {showContact && (
              <div className="mt-3 text-xs rounded-md border bg-white p-3">
                <div>{t("footer.helpline")}: <a className="text-emerald-700 underline" href="tel:18002702222">1800-270-2222</a></div>
                <div>{t("footer.portal")}: <a className="text-emerald-700 underline" href="https://farmer.gov.in/">https://farmer.gov.in/</a></div>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold mb-2">{t("footer.getapp")}</h3>
            <div className="flex gap-3">
              <a className="h-10 px-4 rounded-md bg-black text-white text-sm inline-flex items-center" href="#" aria-label="Play Store">Play Store</a>
              <a className="h-10 px-4 rounded-md bg-black text-white text-sm inline-flex items-center" href="#" aria-label="App Store">App Store</a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground pb-6">© {new Date().getFullYear()} AgriCarbonMRV</div>
      </footer>
    </div>
  );
}
