import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { useEcosystem } from "@/lib/ecosystem-store";

type Node = {
  id: string;
  label: string;
  kind: "parent" | "company" | "category" | "product";
  x: number;
  y: number;
  accent: string;
  to: string;
  companyId?: string;
};

const W = 1600;
const LEVELS = [
  { y: 90, label: "PARENT" },
  { y: 320, label: "COMPANIES" },
  { y: 590, label: "CATEGORIES" },
  { y: 870, label: "PRODUCTS" },
] as const;

function labelLines(label: string, maxCharacters: number) {
  const lines: string[] = [];
  let current = "";
  for (const word of label.split(" ")) {
    if (current && `${current} ${word}`.length > maxCharacters) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function nodeLabelLines(node: Node) {
  if (node.kind === "product") return labelLines(node.label, 14);
  if (node.kind === "category") return labelLines(node.label, 12);
  if (node.kind === "company") return labelLines(node.label, 16);
  return [node.label];
}

function NodeIcon({ node, radius }: { node: Node; radius: number }): ReactNode {
  const color = node.kind === "parent" ? "var(--primary)" : node.accent;
  if (node.kind === "parent") {
    return <path d={`M ${node.x} ${node.y - radius * 0.55} l ${radius * 0.5} ${radius * 0.3} v ${radius * 0.55} l-${radius * 0.5} ${radius * 0.3} l-${radius * 0.5}-${radius * 0.3} v-${radius * 0.55} z`} fill="none" stroke={color} strokeWidth="2" />;
  }
  if (node.kind === "company") {
    return (
      <g stroke={color} strokeWidth="1.8" fill="none">
        <rect x={node.x - 6} y={node.y - 6} width="12" height="12" rx="1" />
        <path d={`M ${node.x - 3} ${node.y} h 6 M ${node.x} ${node.y - 3} v 6`} />
      </g>
    );
  }
  if (node.kind === "category") {
    return (
      <g fill={color}>
        <rect x={node.x - 5} y={node.y - 5} width="4" height="4" rx="0.5" />
        <rect x={node.x + 1} y={node.y - 5} width="4" height="4" rx="0.5" />
        <rect x={node.x - 5} y={node.y + 1} width="4" height="4" rx="0.5" />
        <rect x={node.x + 1} y={node.y + 1} width="4" height="4" rx="0.5" />
      </g>
    );
  }
  return <path d={`M ${node.x} ${node.y - 5} l 5 5 l -5 5 l -5 -5 z`} fill={color} />;
}

export function EcosystemMap({ focusCompanyId }: { focusCompanyId?: string }) {
  const { data } = useEcosystem();
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<string | null>(focusCompanyId ?? null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const maxProductsInCategory = Math.max(
    1,
    ...data.companies.flatMap((company) => company.categories.map((category) => category.products.length)),
  );
  const mapHeight = 1040 + (maxProductsInCategory - 1) * 72;

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Array<{ from: string; to: string; accent: string }> = [];
    const parent: Node = {
      id: data.id,
      label: data.name,
      kind: "parent",
      x: W / 2,
      y: LEVELS[0].y,
      accent: "#00F0FF",
      to: "/ecosystem",
    };
    nodes.push(parent);

    const n = data.companies.length || 1;
    data.companies.forEach((company, ci) => {
      const companyWidth = W / n;
      const companyStart = ci * companyWidth;
      const cx = companyStart + companyWidth / 2;
      const companyNode: Node = {
        id: company.id,
        label: company.name,
        kind: "company",
        x: cx,
        y: LEVELS[1].y,
        accent: company.accent,
        to: `/company/${company.id}`,
        companyId: company.id,
      };
      nodes.push(companyNode);
      edges.push({ from: parent.id, to: company.id, accent: company.accent });

      const m = company.categories.length || 1;
      const categoryGap = Math.max(150, Math.min(230, (companyWidth - 80) / m));
      company.categories.forEach((cat, gi) => {
        const gx = cx + (gi - (m - 1) / 2) * categoryGap;
        nodes.push({
          id: cat.id,
          label: cat.name,
          kind: "category",
          x: gx,
          y: LEVELS[2].y,
          accent: company.accent,
          to: `/company/${company.id}/category/${cat.id}`,
          companyId: company.id,
        });
        edges.push({ from: company.id, to: cat.id, accent: company.accent });

        cat.products.forEach((p, pi) => {
          nodes.push({
            id: p.id,
            label: p.name,
            kind: "product",
            x: gx,
            y: LEVELS[3].y + pi * 72,
            accent: company.accent,
            to: `/product/${p.id}`,
            companyId: company.id,
          });
          edges.push({ from: cat.id, to: p.id, accent: company.accent });
        });
      });
    });
    return { nodes, edges };
  }, [data]);

  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const dim = (node?: Node) =>
    Boolean(selected) && node?.kind !== "parent" && node?.companyId !== selected;

  return (
    <div className="glass clip-corner relative overflow-hidden">
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2.2, z + 0.2))}
          className="flex h-11 w-11 items-center justify-center rounded-sm border border-border text-muted-foreground hover:text-primary"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
          className="flex h-11 w-11 items-center justify-center rounded-sm border border-border text-muted-foreground hover:text-primary"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            setSelected(null);
          }}
          className="flex h-11 w-11 items-center justify-center rounded-sm border border-border text-muted-foreground hover:text-primary"
          aria-label="Reset map view"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-auto">
        <svg
          viewBox={`0 0 ${W} ${mapHeight}`}
          role="img"
          aria-label="Ecosystem map of companies, categories and products"
          style={{ width: `${zoom * 100}%`, minWidth: "100%" }}
          className="block transition-[width] duration-500"
        >
          {LEVELS.map((level) => (
            <g key={level.label} aria-hidden="true" className="fill-muted-foreground opacity-60">
              <line x1="42" x2={W - 42} y1={level.y} y2={level.y} stroke="currentColor" strokeDasharray="3 14" opacity="0.22" />
              <text x="48" y={level.y - 16} className="font-mono" fontSize="11" letterSpacing="2">
                {level.label}
              </text>
            </g>
          ))}

          {edges.map((e) => {
            const a = byId[e.from];
            const b = byId[e.to];
            if (!a || !b) return null;
            const faded = dim(b);
            const edgeId = `${e.from}-${e.to}`;
            const edgeHovered = hoveredEdge === edgeId;
            const branchHovered = hoveredNode === e.from || hoveredNode === e.to;
            return (
              <path
                key={edgeId}
                className="ft-tree-edge"
                style={{
                  animationDelay: `${Math.min(1.2, a.y / 1200)}s`,
                  filter: edgeHovered || branchHovered ? "drop-shadow(0 0 5px currentColor)" : undefined,
                }}
                d={`M ${a.x} ${a.y} C ${a.x} ${(a.y + b.y) / 2}, ${b.x} ${(a.y + b.y) / 2}, ${b.x} ${b.y}`}
                fill="none"
                stroke={e.accent}
                strokeWidth={faded ? 0.8 : edgeHovered ? 3.2 : branchHovered ? 2.5 : 1.8}
                opacity={faded ? 0.2 : edgeHovered ? 1 : branchHovered ? 0.92 : 0.72}
                strokeLinecap="round"
                onMouseEnter={() => setHoveredEdge(edgeId)}
                onMouseLeave={() => setHoveredEdge(null)}
              />
            );
          })}

          {nodes.map((n) => {
            const faded = dim(n);
            const r = n.kind === "parent" ? 26 : n.kind === "company" ? 20 : n.kind === "category" ? 12 : 6;
            return (
              <g
                key={n.id}
                className="ft-tree-node cursor-pointer"
                style={{ animationDelay: `${Math.min(0.9, n.y / 1100)}s` }}
                opacity={faded ? 0.25 : 1}
                onMouseEnter={() => {
                  setHoveredNode(n.id);
                  if (n.companyId) setSelected(n.companyId);
                }}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <Link to={n.to as never}>
                  <circle cx={n.x} cy={n.y} r={r + 10} fill="transparent" />
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={r}
                    fill={`${n.accent}22`}
                    stroke={n.accent}
                    strokeWidth={1.5}
                  />
                  <NodeIcon node={n} radius={r} />
                  <text
                    x={n.x}
                    y={n.y + r + (n.kind === "product" ? 17 : 20)}
                    textAnchor="middle"
                    fill={n.kind === "parent" ? "var(--primary)" : n.accent}
                    className="font-mono"
                    fontSize={n.kind === "parent" ? 20 : n.kind === "company" ? 15 : n.kind === "category" ? 11 : 11}
                    fontWeight={n.kind === "parent" || n.kind === "company" ? 600 : 500}
                    paintOrder="stroke"
                    stroke="var(--background)"
                    strokeWidth={n.kind === "product" ? 6 : 8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {nodeLabelLines(n).map((line, index) => (
                      <tspan key={`${n.id}-${line}`} x={n.x} dy={index === 0 ? 0 : 14}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                  <title>{n.label}</title>
                </Link>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
