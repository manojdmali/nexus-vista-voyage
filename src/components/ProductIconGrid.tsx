import { Canvas } from "@react-three/fiber";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ProductModel } from "./viewer/ProductModel";
import type { Product } from "@/data/types";

type ProductIcon = {
  product: Product;
  companyName: string;
  accent: string;
};

export function ProductIconGrid({ products }: { products: ProductIcon[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
      {products.map(({ product, companyName, accent }) => (
        <Link
          key={product.id}
          to="/product/$productId"
          params={{ productId: product.id }}
          className="group relative min-w-0 bg-background/70 p-3 transition-colors hover:bg-surface-2"
        >
          <div className="absolute left-3 top-3 z-10 font-mono text-[10px] text-muted-foreground">
            0{products.indexOf({ product, companyName, accent }) + 1}
          </div>
          <div className="h-36 sm:h-40">
            <Canvas
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 6], fov: 38 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.55} />
              <directionalLight position={[3, 4, 5]} intensity={2} color={accent} />
              <pointLight position={[-3, -2, 2]} intensity={1.5} color="#9D6BFF" />
              <ProductModel
                shape={product.model3D.shape}
                accent={accent}
                wireframe={false}
                autoRotate
                speed={product.model3D.rotationSpeed}
              />
            </Canvas>
          </div>
          <div className="border-t border-border pt-3">
            <div className="flex items-center gap-2">
              <p className="truncate font-display text-sm font-semibold">{product.name}</p>
              {product.model3D.shape === "wire" && (
                <span className="shrink-0 rounded-sm border border-[#C87533]/60 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[#C87533]">
                  Copper
                </span>
              )}
            </div>
            <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: accent }}>
              {companyName}
            </p>
          </div>
          <ArrowUpRight className="absolute bottom-3 right-3 h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>
      ))}
    </div>
  );
}