import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEcosystem } from "./ecosystem-store";
import { flagshipProducts } from "@/data/ecosystem";

type KioskConfig = {
  attractorAfterMs: number;
  resetAfterMs: number;
  demoStepMs: number;
};

const DEFAULT_CONFIG: KioskConfig = {
  attractorAfterMs: 30_000,
  resetAfterMs: 60_000,
  demoStepMs: 7_000,
};

type Ctx = {
  kiosk: boolean;
  setKiosk: (v: boolean) => void;
  demo: boolean;
  startDemo: () => void;
  stopDemo: () => void;
  attractor: boolean;
  dismissAttractor: () => void;
  config: KioskConfig;
  setConfig: (c: Partial<KioskConfig>) => void;
  fullscreen: boolean;
  toggleFullscreen: () => void;
};

const KioskContext = createContext<Ctx | null>(null);

export function KioskProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { data } = useEcosystem();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [kiosk, setKioskState] = useState(false);
  const [demo, setDemo] = useState(false);
  const [attractor, setAttractor] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [config, setConfigState] = useState(DEFAULT_CONFIG);
  const lastActivity = useRef(Date.now());
  const demoRef = useRef(demo);
  demoRef.current = demo;

  const stopDemo = useCallback(() => setDemo(false), []);
  const startDemo = useCallback(() => {
    lastActivity.current = Date.now();
    setAttractor(false);
    setDemo(true);
  }, []);

  // Activity tracking
  useEffect(() => {
    const mark = () => {
      lastActivity.current = Date.now();
      setAttractor(false);
      if (demoRef.current) setDemo(false);
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, mark, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, mark));
  }, []);

  // Inactivity timers
  useEffect(() => {
    if (!kiosk) {
      setAttractor(false);
      return;
    }
    const t = window.setInterval(() => {
      if (demoRef.current) return;
      const idle = Date.now() - lastActivity.current;
      if (idle > config.resetAfterMs) {
        lastActivity.current = Date.now();
        setAttractor(true);
        navigate({ to: "/" });
      } else if (idle > config.attractorAfterMs) {
        setAttractor(true);
      }
    }, 1000);
    return () => window.clearInterval(t);
  }, [kiosk, config, navigate]);

  // Auto-demo tour
  const tour = useMemo(() => {
    const steps: Array<string> = ["/", "/ecosystem"];
    const flags = flagshipProducts(data);
    for (const company of data.companies) {
      steps.push(`/company/${company.id}`);
      const cat = company.categories[0];
      if (cat) steps.push(`/company/${company.id}/category/${cat.id}`);
      const flag = flags.find((f) => f.company.id === company.id) ?? {
        product: cat?.products[0],
      };
      if (flag.product) steps.push(`/product/${flag.product.id}`);
    }
    steps.push("/map");
    return steps;
  }, [data]);

  useEffect(() => {
    if (!demo) return;
    let i = Math.max(0, tour.indexOf(pathname));
    const t = window.setInterval(() => {
      i = (i + 1) % tour.length;
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate({ to: tour[i] as never });
    }, config.demoStepMs);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo, tour, config.demoStepMs, navigate]);

  // Fullscreen
  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => undefined);
  }, []);

  const setKiosk = useCallback((v: boolean) => {
    setKioskState(v);
    lastActivity.current = Date.now();
    document.documentElement.classList.toggle("kiosk", v);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      kiosk,
      setKiosk,
      demo,
      startDemo,
      stopDemo,
      attractor,
      dismissAttractor: () => {
        lastActivity.current = Date.now();
        setAttractor(false);
      },
      config,
      setConfig: (c) => setConfigState((prev) => ({ ...prev, ...c })),
      fullscreen,
      toggleFullscreen,
    }),
    [kiosk, setKiosk, demo, startDemo, stopDemo, attractor, config, fullscreen, toggleFullscreen],
  );

  return <KioskContext.Provider value={value}>{children}</KioskContext.Provider>;
}

export function useKiosk() {
  const ctx = useContext(KioskContext);
  if (!ctx) throw new Error("useKiosk must be used inside KioskProvider");
  return ctx;
}
