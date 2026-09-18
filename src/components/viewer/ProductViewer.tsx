import { Suspense, lazy, useEffect, useState } from "react";
import {
  Box,
  Boxes,
  Expand,
  Grid3x3,
  Pause,
  Play,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import type { Model3DConfig } from "@/data/types";
import type { PresetKey } from "./Scene";

const Scene = lazy(() => import("./Scene"));

const PRESETS: Array<{ key: PresetKey; label: string }> = [
  { key: "front", label: "Front" },
  { key: "back", label: "Back" },
  { key: "left", label: "Left" },
  { key: "right", label: "Right" },
  { key: "top", label: "Top" },
  { key: "isometric", label: "Isometric" },
];

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function ProductViewer({
  config,
  productName,
}: {
  config: Model3DConfig;
  productName: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [preset, setPreset] = useState<PresetKey>("isometric");
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(config.autoRotate);
  const [active, setActive] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);

  useEffect(() => {
    setMounted(true);
    setWebgl(hasWebGL());
  }, []);

  const hotspot = config.hotspots.find((h) => h.id === active) ?? null;

  const requestFullscreen = () => {
    const el = document.getElementById("ft-viewer-shell");
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.().catch(() => undefined);
  };

  return (
    <div id="ft-viewer-shell" className="glass clip-corner relative flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="eyebrow text-primary">Interactive 3D · {productName}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoRotate((v) => !v)}
            aria-pressed={autoRotate}
            className="flex h-11 min-w-11 items-center gap-2 rounded-sm border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="hidden sm:inline">Auto-rotate</span>
          </button>
          <button
            type="button"
            onClick={() => setWireframe((v) => !v)}
            aria-pressed={wireframe}
            className="flex h-11 min-w-11 items-center gap-2 rounded-sm border border-border px-3 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            {wireframe ? <Grid3x3 className="h-4 w-4" /> : <Box className="h-4 w-4" />}
            <span className="hidden sm:inline">{wireframe ? "Wireframe" : "Shaded"}</span>
          </button>
          <button
            type="button"
            onClick={() => setResetSignal((n) => n + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            aria-label="Reset view"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={requestFullscreen}
            className="flex h-11 w-11 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            aria-label="Fullscreen viewer"
          >
            <Expand className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="viewer-stage relative min-h-[560px] flex-1">
        {!mounted && (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
            <span className="eyebrow animate-pulse text-primary">Initialising viewer…</span>
          </div>
        )}
        {mounted && !webgl && (
          <div className="absolute inset-0 grid place-items-center px-8 text-center">
            <div>
              <TriangleAlert className="mx-auto h-8 w-8 text-accent" />
              <p className="mt-3 text-sm text-foreground">3D is unavailable on this display</p>
              <p className="mt-1 text-xs text-muted-foreground">
                WebGL could not start. All product information below remains available.
              </p>
              <button
                type="button"
                onClick={() => setWebgl(hasWebGL())}
                className="mt-4 h-11 rounded-sm border border-border-strong px-4 text-xs text-primary"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        {mounted && webgl && (
          <Suspense
            fallback={
              <div className="absolute inset-0 grid place-items-center">
                <span className="eyebrow animate-pulse text-primary">Loading model…</span>
              </div>
            }
          >
            <Scene
              config={config}
              preset={preset}
              wireframe={wireframe}
              autoRotate={autoRotate}
              activeHotspot={active}
              onHotspot={setActive}
              resetSignal={resetSignal}
            />
          </Suspense>
        )}

        {hotspot && (
          <div className="glass-strong absolute bottom-4 left-4 right-4 max-w-md rounded-sm p-4 md:right-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-primary">Callout</p>
                <h4 className="mt-1 text-base font-semibold">{hotspot.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {hotspot.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
                aria-label="Close callout"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3">
        <Boxes className="mr-1 h-4 w-4 text-primary" />
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPreset(p.key)}
            aria-pressed={preset === p.key}
            className={`h-11 rounded-sm border px-3 text-xs transition-colors ${
              preset === p.key
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
