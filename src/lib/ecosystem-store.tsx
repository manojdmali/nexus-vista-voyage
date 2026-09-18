import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ecosystem as baseEcosystem } from "@/data/ecosystem";
import type { ChildCompany, ParentCompany, Product, ProductCategory } from "@/data/types";

const STORAGE_KEY = "futuretech.ecosystem.v1";

type Ctx = {
  data: ParentCompany;
  updateParent: (patch: Partial<Omit<ParentCompany, "companies">>) => void;
  updateCompany: (companyId: string, patch: Partial<Omit<ChildCompany, "categories">>) => void;
  updateCategory: (
    categoryId: string,
    patch: Partial<Omit<ProductCategory, "products">>,
  ) => void;
  updateProduct: (productId: string, patch: Partial<Product>) => void;
  addCompany: (name: string) => void;
  addCategory: (companyId: string, name: string) => void;
  addProduct: (companyId: string, categoryId: string, name: string) => void;
  reset: () => void;
  isCustomised: boolean;
};

const EcosystemContext = createContext<Ctx | null>(null);

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "item";

function includeNewProducts(saved: ParentCompany) {
  const baseProducts = baseEcosystem.companies.flatMap((company) =>
    company.categories.flatMap((category) => category.products),
  );
  const savedProductIds = new Set(
    saved.companies.flatMap((company) => company.categories.flatMap((category) => category.products.map((product) => product.id))),
  );
  const missingProducts = baseProducts.filter((product) => !savedProductIds.has(product.id));
  if (missingProducts.length === 0) return saved;

  return {
    ...saved,
    companies: saved.companies.map((company) => ({
      ...company,
      categories: company.categories.map((category) => ({
        ...category,
        products: [
          ...category.products,
          ...missingProducts.filter(
            (product) => product.companyId === company.id && product.categoryId === category.id,
          ),
        ],
      })),
    })),
  };
}

export function EcosystemProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ParentCompany>(baseEcosystem);
  const [isCustomised, setCustomised] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData(includeNewProducts(JSON.parse(raw) as ParentCompany));
        setCustomised(true);
      }
    } catch {
      /* ignore corrupt local state */
    }
  }, []);

  const commit = useCallback((next: ParentCompany) => {
    setData(next);
    setCustomised(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep in-memory only */
    }
  }, []);

  const value = useMemo<Ctx>(() => {
    const mapCompanies = (fn: (c: ChildCompany) => ChildCompany) => ({
      ...data,
      companies: data.companies.map(fn),
    });

    return {
      data,
      isCustomised,
      updateParent: (patch) => commit({ ...data, ...patch }),
      updateCompany: (companyId, patch) =>
        commit(mapCompanies((c) => (c.id === companyId ? { ...c, ...patch } : c))),
      updateCategory: (categoryId, patch) =>
        commit(
          mapCompanies((c) => ({
            ...c,
            categories: c.categories.map((cat) =>
              cat.id === categoryId ? { ...cat, ...patch } : cat,
            ),
          })),
        ),
      updateProduct: (productId, patch) =>
        commit(
          mapCompanies((c) => ({
            ...c,
            categories: c.categories.map((cat) => ({
              ...cat,
              products: cat.products.map((p) => (p.id === productId ? { ...p, ...patch } : p)),
            })),
          })),
        ),
      addCompany: (name) => {
        const id = `ft-${slugify(name)}`;
        if (data.companies.some((c) => c.id === id)) return;
        commit({
          ...data,
          companies: [
            ...data.companies,
            {
              id,
              parentCompanyId: data.id,
              name,
              short: name.split(" ").slice(-1)[0] ?? name,
              accent: "#00F0FF",
              tagline: "New division",
              description: "Describe this company in the admin console.",
              industry: "Technology",
              displayOrder: data.companies.length + 1,
              categories: [],
            },
          ],
        });
      },
      addCategory: (companyId, name) =>
        commit(
          mapCompanies((c) =>
            c.id === companyId
              ? {
                  ...c,
                  categories: [
                    ...c.categories,
                    {
                      id: `${companyId}-${slugify(name)}`,
                      companyId,
                      name,
                      icon: "layers",
                      description: "Describe this category in the admin console.",
                      displayOrder: c.categories.length + 1,
                      products: [],
                    },
                  ],
                }
              : c,
          ),
        ),
      addProduct: (companyId, categoryId, name) =>
        commit(
          mapCompanies((c) =>
            c.id === companyId
              ? {
                  ...c,
                  categories: c.categories.map((cat) =>
                    cat.id === categoryId
                      ? {
                          ...cat,
                          products: [
                            ...cat.products,
                            {
                              id: `${categoryId}-${slugify(name)}`,
                              slug: slugify(name),
                              categoryId,
                              companyId,
                              name,
                              tagline: "New product",
                              description: "Describe this product in the admin console.",
                              features: [],
                              benefits: [],
                              useCases: [],
                              technologies: [],
                              specifications: {},
                              model3D: {
                                shape: "core",
                                autoRotate: true,
                                rotationSpeed: 0.45,
                                accent: c.accent,
                                cameraAngles: {
                                  front: { position: [0, 0, 6] },
                                  back: { position: [0, 0, -6] },
                                  left: { position: [-6, 0, 0] },
                                  right: { position: [6, 0, 0] },
                                  top: { position: [0, 6, 0.001] },
                                  isometric: { position: [4.2, 3.4, 4.2] },
                                },
                                hotspots: [],
                              },
                            },
                          ],
                        }
                      : cat,
                  ),
                }
              : c,
          ),
        ),
      reset: () => {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* noop */
        }
        setData(baseEcosystem);
        setCustomised(false);
      },
    };
  }, [data, commit, isCustomised]);

  return <EcosystemContext.Provider value={value}>{children}</EcosystemContext.Provider>;
}

export function useEcosystem() {
  const ctx = useContext(EcosystemContext);
  if (!ctx) throw new Error("useEcosystem must be used inside EcosystemProvider");
  return ctx;
}
