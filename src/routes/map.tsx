import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EcosystemMap } from "@/components/EcosystemMap";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Ecosystem Map — FutureTech Group" },
      {
        name: "description",
        content:
          "A visual traceability map linking FutureTech Group to every company, category and product.",
      },
      { property: "og:title", content: "Ecosystem Map — FutureTech Group" },
      {
        property: "og:description",
        content: "See how every FutureTech product traces back to its parent company.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  return (
    <div className="space-y-8">
      <Breadcrumbs />
      <header className="max-w-3xl">
        <p className="eyebrow text-primary">Traceability</p>
        <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">Ecosystem Map</h1>
        <p className="mt-3 text-muted-foreground">
          Every node is live — hover to isolate a company branch, tap any node to jump straight to
          that part of the ecosystem.
        </p>
      </header>
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-border py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span><strong className="text-foreground">Parent</strong> · group</span>
        <span><strong className="text-foreground">Companies</strong> · divisions</span>
        <span><strong className="text-foreground">Categories</strong> · domains</span>
        <span><strong className="text-foreground">Products</strong> · clickable nodes</span>
      </div>
      <EcosystemMap />
    </div>
  );
}
