import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Expand,
  Hexagon,
  Map,
  Monitor,
  Moon,
  Network,
  PlayCircle,
  Search,
  Settings2,
  StopCircle,
  Sun,
} from "lucide-react";
import { ParticleField } from "./ParticleField";
import { SearchModal } from "./SearchModal";
import { useKiosk } from "@/lib/kiosk";
import { useEcosystem } from "@/lib/ecosystem-store";

function NavLink({ to, label, icon: Icon }: { to: string; label: string; icon: React.ElementType }) {
  const navItem =
    "group relative flex items-center gap-2 rounded-sm border border-transparent px-3 py-2 text-xs text-muted-foreground transition-all hover:border-border hover:bg-surface-2 hover:text-foreground";
  return (
    <Link
      to={to as never}
      activeOptions={{ exact: true }}
      className={navItem}
      activeProps={{
        className: `${navItem} border-primary/35 bg-primary/10 text-primary before:absolute before:bottom-1 before:left-0 before:top-1 before:w-0.5 before:bg-primary before:shadow-[0_0_12px_var(--primary)]`,
      }}
    >
      <span className="grid h-5 w-5 place-items-center border border-current/30 bg-background/30 transition-all group-hover:border-current/60">
        <Icon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
      </span>
      {label}
    </Link>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { data } = useEcosystem();
  const kioskCtx = useKiosk();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("futuretech.theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    window.localStorage.setItem("futuretech.theme", theme);
    window.dispatchEvent(new CustomEvent("futuretech-theme-change", { detail: theme }));
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const iconBtn =
    "flex h-11 items-center justify-center gap-2 rounded-sm border border-border px-3 text-muted-foreground transition-colors hover:border-border-strong hover:text-primary";

  return (
    <div className="relative min-h-screen">
      <ParticleField />

      <header className="shell-header sticky top-0 z-40 border-b border-border bg-background/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center gap-3 px-5 py-3 2xl:px-10">
          <Link to="/" className="group flex min-w-0 items-center gap-3 rounded-sm pr-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center border border-primary/40 bg-primary/10">
              <Hexagon className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" strokeWidth={1.4} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-semibold tracking-tight">{data.name}</span>
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground xl:block">Digital ecosystem</span>
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="shell-nav order-3 flex w-full items-center gap-1 overflow-x-auto border border-border bg-surface/45 p-1 pt-1 md:order-none md:ml-2 md:w-auto"
          >
            <NavLink to="/ecosystem" label="Ecosystem" icon={Network} />
            <NavLink to="/map" label="Map" icon={Map} />
            <NavLink to="/admin" label="Admin" icon={Settings2} />
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="glass flex h-11 items-center gap-3 rounded-sm px-3 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search ecosystem</span>
              <kbd className="hidden rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] lg:block">
                ⌘K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
              className={`${iconBtn} w-11 xl:w-auto`}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden text-[11px] xl:inline">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
            <button
              type="button"
              onClick={kioskCtx.demo ? kioskCtx.stopDemo : kioskCtx.startDemo}
              aria-pressed={kioskCtx.demo}
              className={`${iconBtn} w-11 xl:w-auto ${kioskCtx.demo ? "border-primary text-primary" : ""}`}
              aria-label={kioskCtx.demo ? "Stop auto-demo tour" : "Start auto-demo tour"}
              title="Auto-demo tour"
            >
              {kioskCtx.demo ? (
                <StopCircle className="h-4 w-4" />
              ) : (
                <PlayCircle className="h-4 w-4" />
              )}
              <span className="hidden text-[11px] xl:inline">{kioskCtx.demo ? "Stop" : "Play"}</span>
            </button>
            <button
              type="button"
              onClick={() => kioskCtx.setKiosk(!kioskCtx.kiosk)}
              aria-pressed={kioskCtx.kiosk}
              className={`${iconBtn} w-11 xl:w-auto ${kioskCtx.kiosk ? "border-primary text-primary" : ""}`}
              aria-label="Toggle kiosk mode"
              title="Kiosk / presentation mode"
            >
              <Monitor className="h-4 w-4" />
              <span className="hidden text-[11px] xl:inline">Kiosk</span>
            </button>
            <button
              type="button"
              onClick={kioskCtx.toggleFullscreen}
              className={`${iconBtn} w-11 xl:w-auto`}
              aria-label="Toggle fullscreen"
              title="Fullscreen"
            >
              <Expand className="h-4 w-4" />
              <span className="hidden text-[11px] xl:inline">Full screen</span>
            </button>
            <Link to="/admin" className={`${iconBtn} w-11 md:hidden`} aria-label="Admin">
              <Settings2 className="h-4 w-4" />
            </Link>
          </div>
        </div>
        {kioskCtx.kiosk && (
          <div className="border-t border-primary/20 bg-primary/10 px-5 py-2 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            Presentation mode · auto reset after {Math.round(kioskCtx.config.resetAfterMs / 1000)}s idle
          </div>
        )}
      </header>

      <main key={pathname} className="ft-rise mx-auto max-w-[1800px] px-5 py-8 2xl:px-10">
        {children}
      </main>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {kioskCtx.kiosk && kioskCtx.attractor && !kioskCtx.demo && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/92 backdrop-blur-md">
          <div className="text-center">
            <p className="eyebrow text-primary">{data.name}</p>
            <h2 className="mt-5 font-display text-5xl font-semibold text-glow md:text-7xl">
              Explore Our Digital Ecosystem
            </h2>
            <button
              type="button"
              onClick={kioskCtx.dismissAttractor}
              className="mt-10 h-16 rounded-sm border border-primary bg-primary/15 px-12 text-sm uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary/25"
            >
              Start Experience
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
