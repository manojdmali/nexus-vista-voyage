export type CameraPreset = {
  position: [number, number, number];
  target?: [number, number, number];
};

export type Hotspot = {
  id: string;
  title: string;
  description: string;
  position: [number, number, number];
};

export type ModelShape = "core" | "lattice" | "shield" | "orbital" | "stack" | "prism" | "wire";

export type Model3DConfig = {
  shape: ModelShape;
  modelUrl?: string;
  autoRotate: boolean;
  rotationSpeed: number;
  accent: string;
  cameraAngles: {
    front: CameraPreset;
    back: CameraPreset;
    left: CameraPreset;
    right: CameraPreset;
    top: CameraPreset;
    isometric: CameraPreset;
  };
  hotspots: Hotspot[];
};

export type Product = {
  id: string;
  slug: string;
  categoryId: string;
  companyId: string;
  name: string;
  tagline: string;
  description: string;
  flagship?: boolean;
  features: string[];
  benefits: string[];
  useCases: string[];
  technologies: string[];
  specifications: Record<string, string>;
  model3D: Model3DConfig;
};

export type ProductCategory = {
  id: string;
  companyId: string;
  name: string;
  icon: string;
  description: string;
  displayOrder: number;
  products: Product[];
};

export type ChildCompany = {
  id: string;
  parentCompanyId: string;
  name: string;
  short: string;
  accent: string;
  tagline: string;
  description: string;
  industry: string;
  displayOrder: number;
  categories: ProductCategory[];
};

export type ParentCompany = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  companies: ChildCompany[];
};

export type Trail = {
  parent: ParentCompany;
  company: ChildCompany;
  category: ProductCategory;
  product: Product;
};
