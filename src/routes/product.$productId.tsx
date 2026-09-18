import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductViewer } from "@/components/viewer/ProductViewer";
import { useEcosystem } from "@/lib/ecosystem-store";
import { findProduct } from "@/data/ecosystem";

export const Route = createFileRoute("/product/$productId")({
  head: () => ({
    meta: [
      { title: "Product — FutureTech Group" },
      {
        name: "description",
        content:
          "Interactive 3D product detail with specifications, hotspot callouts and camera presets.",
      },
      { property: "og:title", content: "Product — FutureTech Group" },
      {
        property: "og:description",
        content:
          "Interactive 3D product detail with specifications, hotspot callouts and camera presets.",
      },
    ],
  }),
  component: ProductPage,
});

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="glass clip-corner p-6">
      <h3 className="eyebrow text-primary">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductPage() {
  const { productId } = Route.useParams();
  const { data } = useEcosystem();
  const trail = findProduct(data, productId);

  if (!trail) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        <p className="text-sm text-muted-foreground">That product is no longer available.</p>
        <Link to="/ecosystem" className="text-sm text-primary">
          Back to the ecosystem
        </Link>
      </div>
    );
  }

  const { company, category, product } = trail;

  return (
    <div className="space-y-8">
      <Breadcrumbs companyId={company.id} categoryId={category.id} productId={product.id} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.72fr)]">
        <div className="space-y-6">
          <header>
            <p className="eyebrow" style={{ color: company.accent }}>
              {company.name} · {category.name}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">{product.name}</h1>
            <p className="mt-2 text-lg" style={{ color: company.accent }}>
              {product.tagline}
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </header>

          <div className="glass clip-corner p-6">
            <h3 className="eyebrow text-primary">Specifications</h3>
            <dl className="mt-4 divide-y divide-border">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-2.5 text-sm">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-mono text-xs text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <List title="Key Features" items={product.features} />
            <List title="Benefits" items={product.benefits} />
            <List title="Use Cases" items={product.useCases} />
            <div className="glass clip-corner p-6">
              <h3 className="eyebrow text-primary">Technologies</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border border-border px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:sticky xl:top-28 xl:h-[calc(100vh-9rem)] xl:min-h-[680px]">
          <ProductViewer config={product.model3D} productName={product.name} />
        </div>
      </div>
    </div>
  );
}
