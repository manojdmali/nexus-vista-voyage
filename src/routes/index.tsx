import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Hexagon, PlayCircle } from "lucide-react";
import { EcosystemMap } from "@/components/EcosystemMap";
import { ProductIconGrid } from "@/components/ProductIconGrid";
import { useKiosk } from "@/lib/kiosk";
import { useEcosystem } from "@/lib/ecosystem-store";
import { countProducts, flagshipProducts } from "@/data/ecosystem";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FutureTech Group — Interactive Corporate Ecosystem" },
      {
        name: "description",
        content:
          "Explore the FutureTech Group ecosystem: four specialist technology companies, their product categories and interactive 3D product showcases.",
      },
      { property: "og:title", content: "FutureTech Group — Interactive Corporate Ecosystem" },
      {
        property: "og:description",
        content:
          "A cinematic portal through AI, sovereign cloud, cybersecurity and quantum systems, with interactive 3D product exploration.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { data } = useEcosystem();
  const { startDemo, demo } = useKiosk();
  const products = data.companies.reduce((n, c) => n + countProducts(c), 0);
  const iconProducts = data.companies
    .map((company) => {
      const companyProducts = company.categories.flatMap((category) => category.products);
      const wireProduct = companyProducts.find((product) => product.model3D.shape === "wire");
      const flagship = flagshipProducts(data).find((trail) => trail.company.id === company.id);
      const product = wireProduct ?? flagship?.product ?? company.categories[0]?.products[0];
      return product ? { product, companyName: company.short, accent: company.accent } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="space-y-16 pb-12">
      <section className="grid min-h-[70vh] items-center gap-10 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="relative max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="relative grid h-16 w-16 place-items-center border border-primary/50 bg-primary/10 text-primary">
              <Hexagon className="h-10 w-10" strokeWidth={0.8} />
              <span className="ft-pulse-ring absolute inset-0 rounded-full border border-primary/40" />
            </div>
            <div>
              <p className="eyebrow text-primary">Corporate Technology Ecosystem</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Live architecture / 2026</p>
            </div>
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[0.95] text-glow md:text-7xl 2xl:text-8xl">
            {data.name}
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl">{data.tagline}</p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground/80">{data.description}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startDemo}
              aria-pressed={demo}
              className="group inline-flex h-14 items-center gap-3 rounded-sm border border-primary bg-primary/15 px-7 text-xs uppercase tracking-[0.24em] text-primary transition-colors hover:bg-primary/25"
            >
              <PlayCircle className="h-5 w-5" />
              {demo ? "Tour running" : "Play guided tour"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              to="/ecosystem"
              className="inline-flex h-14 items-center gap-3 rounded-sm border border-border px-7 text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              Enter ecosystem
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="glass clip-corner relative overflow-hidden border-primary/25 p-2">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--primary)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--primary)_8%,transparent)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="relative border border-border bg-background/35 p-3 sm:p-5">
            <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
              <span className="eyebrow text-primary">Flagship product matrix</span>
              <span className="font-mono text-[10px] text-muted-foreground">LIVE / 3D</span>
            </div>
            <ProductIconGrid products={iconProducts} />
          </div>
        </div>
      </section>

      <dl className="grid w-full grid-cols-3 gap-px border border-border bg-border">
        {[
          ["Companies", data.companies.length],
          ["Categories", data.companies.reduce((n, c) => n + c.categories.length, 0)],
          ["Products", products],
        ].map(([label, value]) => (
          <div key={label as string} className="bg-surface px-4 py-6">
            <dt className="eyebrow text-muted-foreground">{label}</dt>
            <dd className="mt-2 font-display text-4xl text-primary">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-primary">System architecture</p>
            <h2 className="mt-3 font-display text-3xl font-semibold md:text-5xl">One parent. Many frontiers.</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <ChevronDown className="h-4 w-4 text-primary" />
            Select a node to explore
          </div>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Follow every product from its category and child company back to the FutureTech Group parent company.
        </p>
        <EcosystemMap />
      </section>
    </div>
  );
}
