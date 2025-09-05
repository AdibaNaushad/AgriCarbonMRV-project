import { Link, NavLink } from "react-router-dom";
import { useLanguage, LANG_LABELS, LangCode } from "./Language";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

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

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-amber-50">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-inner" />
            <span className="font-extrabold tracking-tight text-lg">AgriCarbonMRV</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/market">Carbon Market</NavItem>
            <NavItem to="/support">Support</NavItem>
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
              <Link to="/add-project">Add Project</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-12 border-t bg-white/70">
        <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="font-bold mb-2">Team</h3>
            <p className="text-sm">Leader Naaz (Female), Adiba (Female), Noor (Female)</p>
            <p className="text-xs text-muted-foreground mt-2">Kolkata, West Bengal</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Links</h3>
            <ul className="text-sm space-y-1">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Get the App</h3>
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
