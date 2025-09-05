import { Link, NavLink } from "react-router-dom";
import { useLanguage, LANG_LABELS, LangCode } from "./Language";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useT } from "./i18n";
import { Leaf, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Apple, Play } from "lucide-react";

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
            <NavItem to="/">{t("nav.home")}</NavItem>
            <NavItem to="/dashboard">{t("nav.dashboard")}</NavItem>
            <NavItem to="/market">{t("nav.market")}</NavItem>
            <NavItem to="/support">{t("nav.support")}</NavItem>
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
              <Link to="/add-project">{t("cta.addProject")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Floating Hindi voice assistant */}
      <FloatingVoice />

      <footer className="mt-12 bg-gradient-to-b from-emerald-900 to-emerald-950 text-emerald-100">
        <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-lg bg-emerald-700/30 border border-emerald-600/40 inline-flex items-center justify-center">
                <Leaf className="h-5 w-5 text-emerald-300" />
              </span>
              <div>
                <div className="font-bold">Innovative Mind</div>
                <div className="text-xs text-emerald-200">Carbon Credit Solutions for Indian Farmers</div>
              </div>
            </div>
            <p className="text-sm mt-3 text-emerald-200/90">The most trusted and easy-to-use carbon credit platform for Indian farmers. Our mission is to connect smallholder farmers with carbon markets.</p>
            <div className="flex gap-3 mt-3">
              <a href="#" aria-label="Facebook" className="h-8 w-8 rounded-md bg-emerald-800/60 inline-flex items-center justify-center border border-emerald-700/60"><Facebook className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitter" className="h-8 w-8 rounded-md bg-emerald-800/60 inline-flex items-center justify-center border border-emerald-700/60"><Twitter className="h-4 w-4" /></a>
              <a href="#" aria-label="Instagram" className="h-8 w-8 rounded-md bg-emerald-800/60 inline-flex items-center justify-center border border-emerald-700/60"><Instagram className="h-4 w-4" /></a>
              <a href="#" aria-label="YouTube" className="h-8 w-8 rounded-md bg-emerald-800/60 inline-flex items-center justify-center border border-emerald-700/60"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <div className="font-bold mb-2">Quick Links</div>
            <ul className="text-sm space-y-1 text-emerald-100/90">
              <li><a href="https://agricoop.gov.in/en/about-us">About Us</a></li>
              <li><Link to="/support">Support</Link></li>
              <li><a href="https://farmer.gov.in/Content/privacy-policy.aspx">Privacy Policy</a></li>
              <li><a href="https://farmer.gov.in/Content/terms-conditions.aspx">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold mb-2">Support</div>
            <ul className="text-sm space-y-1 text-emerald-100/90">
              <li><Link to="/support">Support</Link></li>
              <li><Link to="/support">FAQ</Link></li>
              <li><Link to="/support">Help Center</Link></li>
              <li><Link to="/support">Tutorials</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold mb-2">Contact Info</div>
            <ul className="text-sm space-y-2 text-emerald-100/90">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 6246-789-012</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@innovativemind.in</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> New Delhi, India</li>
            </ul>
            <div className="mt-4">
              <div className="text-xs mb-2 text-emerald-200">Download Mobile App:</div>
              <div className="flex gap-2">
                <a href="#" className="h-10 px-3 rounded-md bg-black text-white text-xs inline-flex items-center gap-2"><Apple className="h-4 w-4" /> App Store</a>
                <a href="#" className="h-10 px-3 rounded-md bg-black text-white text-xs inline-flex items-center gap-2"><Play className="h-4 w-4" /> Google Play</a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-emerald-800/50">
          <div className="container mx-auto px-4 py-4 text-xs text-emerald-200">© {new Date().getFullYear()} Innovative Mind. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
