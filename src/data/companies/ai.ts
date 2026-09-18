import { cat, model } from "../build";
import type { ChildCompany } from "../types";

const ACCENT = "#00F0FF";

export const futuretechAI: ChildCompany = {
  id: "ft-ai",
  parentCompanyId: "futuretech-group",
  name: "FutureTech AI",
  short: "AI",
  accent: ACCENT,
  tagline: "Applied intelligence for the autonomous enterprise",
  description:
    "FutureTech AI designs foundation-model infrastructure, decision engines and perception systems that let large organisations move from dashboards to autonomous operations.",
  industry: "Artificial Intelligence",
  displayOrder: 1,
  categories: [
    cat(
      "ft-ai",
      "ft-ai-platforms",
      "Intelligence Platforms",
      "brain",
      "Model training, serving and governance infrastructure for enterprise-scale AI programmes.",
      1,
      [
        {
          name: "Cortex Foundry",
          tagline: "Enterprise foundation-model training fabric",
          flagship: true,
          description:
            "A managed training fabric that fine-tunes and distils foundation models on private corporate data without ever leaving the customer's security perimeter.",
          features: [
            "Distributed training across 4,096 accelerators",
            "Parameter-efficient fine-tuning and distillation pipelines",
            "Automatic dataset lineage and consent tracking",
            "One-click rollback to any prior model checkpoint",
          ],
          benefits: [
            "Cuts time-to-production for a tuned model from months to days",
            "Keeps regulated data inside the customer's own boundary",
            "Reduces inference cost by distilling to task-sized models",
          ],
          useCases: [
            "Domain-specific copilots for field engineers",
            "Regulated document understanding in banking",
            "Multilingual customer-support model families",
          ],
          technologies: ["PyTorch", "Ray", "NVIDIA NCCL", "Kubernetes"],
          specifications: {
            "Max cluster size": "4,096 accelerators",
            "Training throughput": "1.4 EFLOPs sustained",
            "Supported formats": "Safetensors, GGUF, ONNX",
            Deployment: "Private cloud, on-prem, air-gapped",
            Compliance: "ISO 27001, SOC 2 Type II, EU AI Act ready",
          },
          model3D: model("core", ACCENT, [
            [
              "hs-core",
              "Tensor Core Array",
              "Liquid-cooled accelerator array delivering 1.4 EFLOPs of sustained mixed-precision throughput.",
              [0, 0.9, 0.9],
            ],
            [
              "hs-mesh",
              "Interconnect Mesh",
              "Non-blocking 800Gb optical fabric linking every training node with sub-microsecond latency.",
              [1.3, -0.2, 0.4],
            ],
            [
              "hs-gov",
              "Governance Layer",
              "Immutable lineage ledger recording every dataset, checkpoint and evaluation run.",
              [-1.1, -0.7, 0.6],
            ],
          ]),
        },
        {
          name: "Synapse Serve",
          tagline: "Low-latency inference mesh",
          description:
            "A globally distributed inference mesh that routes each request to the cheapest accelerator able to meet its latency budget.",
          features: [
            "Latency-aware request routing across regions",
            "Speculative decoding and continuous batching",
            "Per-tenant token budgets and quotas",
            "Shadow deployments for model A/B testing",
          ],
          benefits: [
            "Holds p99 latency under 90 ms at global scale",
            "Lowers inference spend by up to 58%",
            "Ships new model versions with zero downtime",
          ],
          useCases: [
            "Real-time conversational assistants",
            "In-transaction fraud scoring",
            "High-volume content moderation",
          ],
          technologies: ["vLLM", "Triton", "Envoy", "eBPF"],
          specifications: {
            "p99 latency": "< 90 ms",
            Throughput: "240k tokens/sec per region",
            Regions: "26 edge locations",
            Autoscaling: "Sub-second cold start",
            SLA: "99.99% availability",
          },
          model3D: model("orbital", ACCENT, [
            [
              "hs-router",
              "Adaptive Router",
              "Scores every request against latency, cost and residency constraints before dispatch.",
              [0, 1.2, 0],
            ],
            [
              "hs-cache",
              "KV Cache Tier",
              "Shared prefix cache that removes repeated prompt computation across tenants.",
              [1.4, 0, 0.5],
            ],
            [
              "hs-edge",
              "Edge Replicas",
              "26 regional replicas kept warm through predictive traffic modelling.",
              [-1.2, -0.6, 0.8],
            ],
          ]),
        },
        {
          name: "Aegis Model Guard",
          tagline: "Continuous model assurance",
          description:
            "Runtime assurance for deployed models: evaluation harnesses, drift detection, red-teaming and regulator-ready evidence packs.",
          features: [
            "Automated adversarial red-team suites",
            "Drift and bias monitoring on live traffic",
            "Policy guardrails with deterministic overrides",
            "Exportable audit evidence packs",
          ],
          benefits: [
            "Detects behavioural drift before customers do",
            "Turns AI-Act obligations into a scheduled job",
            "Gives risk teams a single source of model truth",
          ],
          useCases: [
            "Regulated model approval workflows",
            "Public-sector AI transparency reporting",
            "Third-party model due diligence",
          ],
          technologies: ["OpenTelemetry", "Rust", "DuckDB", "Sigstore"],
          specifications: {
            "Eval suites": "180+ built-in, unlimited custom",
            "Drift window": "Rolling 1 min to 90 days",
            Integrations: "Any OpenAI-compatible endpoint",
            Retention: "7 years signed evidence",
            Deployment: "SaaS or self-hosted",
          },
          model3D: model("shield", ACCENT, [
            [
              "hs-probe",
              "Red-Team Probes",
              "Continuously replays adversarial prompt families against every live model version.",
              [0.9, 0.9, 0.4],
            ],
            [
              "hs-drift",
              "Drift Sensor",
              "Statistical monitors comparing live output distributions with approved baselines.",
              [-1.0, 0.2, 0.7],
            ],
            [
              "hs-ledger",
              "Evidence Ledger",
              "Cryptographically signed record of every evaluation, incident and override.",
              [0, -1.2, 0.5],
            ],
          ]),
        },
      ],
    ),
    cat(
      "ft-ai",
      "ft-ai-vision",
      "Perception & Vision",
      "eye",
      "Industrial perception systems for factories, logistics hubs and autonomous fleets.",
      2,
      [
        {
          name: "Optic Field",
          tagline: "Industrial vision inspection",
          description:
            "Multi-camera inspection that finds surface, dimensional and assembly defects on fast-moving production lines.",
          features: [
            "Sub-millimetre defect detection at 400 parts/min",
            "Few-shot training from 20 reference images",
            "Line-side edge appliance with no cloud dependency",
            "Automatic reject actuation and traceability",
          ],
          benefits: [
            "Reduces escape rate to under 40 ppm",
            "Commissions a new part family in under a day",
            "Keeps production data on the factory floor",
          ],
          useCases: [
            "Automotive body-in-white inspection",
            "Pharmaceutical blister-pack verification",
            "Electronics solder-joint grading",
          ],
          technologies: ["TensorRT", "GigE Vision", "Rust", "OPC UA"],
          specifications: {
            Resolution: "0.2 mm at 1.5 m",
            "Line speed": "400 parts/min",
            Cameras: "Up to 16 per appliance",
            Latency: "12 ms per inspection",
            "Operating temp": "0–50 °C",
          },
          model3D: model("prism", ACCENT, [
            [
              "hs-lens",
              "Optical Head",
              "Telecentric lens stack with coaxial strobe illumination for glare-free capture.",
              [0, 1.1, 0.6],
            ],
            [
              "hs-edge",
              "Edge Inference Unit",
              "Fanless appliance running quantised detection models at 12 ms per frame.",
              [1.2, -0.4, 0.4],
            ],
            [
              "hs-io",
              "Line I/O",
              "Hard-wired reject actuation and OPC UA link into the plant control system.",
              [-1.2, -0.5, 0.5],
            ],
          ]),
        },
        {
          name: "Copper Cortex",
          tagline: "Copper-sleeved neural signal conductor",
          description:
            "A transparent copper cortex wrapped around a thin, high-speed neural conductor for resilient signal paths in intelligent machines and edge systems.",
          features: [
            "Layered copper shielding around a low-loss inner wire",
            "Visible core geometry for rapid service inspection",
            "Flexible signal routing for robotics and edge hardware",
            "Continuous thermal and continuity monitoring",
          ],
          benefits: [
            "Protects sensitive signals from electromagnetic noise",
            "Makes conductor health easy to diagnose",
            "Combines physical resilience with a compact footprint",
          ],
          useCases: [
            "Robotic actuator and sensor harnesses",
            "Edge AI and industrial control systems",
            "High-reliability laboratory instrumentation",
          ],
          technologies: ["Copper core", "Signal shielding", "Thermal sensing", "Flexible polymer"],
          specifications: {
            "Core diameter": "0.48 mm",
            "Cortex thickness": "0.62 mm copper sleeve",
            "Signal loss": "< 0.8 dB per metre",
            "Bend radius": "18 mm minimum",
            "Operating range": "-40 to 105 °C",
          },
          model3D: model("wire", "#C87533", [
            [
              "hs-cortex",
              "Copper Cortex",
              "Semi-transparent copper shielding protects the inner conductor from interference and mechanical stress.",
              [1.2, 1.1, 0.2],
            ],
            [
              "hs-core",
              "Neural Core Wire",
              "The thin central conductor carries power and high-speed signal through the protected sleeve.",
              [0, 0.2, 0.3],
            ],
            [
              "hs-thermal",
              "Thermal Ring",
              "Copper end rings provide a visual inspection point for continuity and thermal monitoring.",
              [-1.1, -1.25, 0.4],
            ],
          ]),
        },
        {
          name: "Sentinel Drive",
          tagline: "Autonomous fleet perception stack",
          description:
            "A certified perception and prediction stack for autonomous yard vehicles and industrial mobile robots.",
          features: [
            "Camera, LiDAR and radar sensor fusion",
            "Functional-safety-rated obstacle classification",
            "Intent prediction for pedestrians and forklifts",
            "Remote assistance handover channel",
          ],
          benefits: [
            "Shortens safety certification cycles",
            "Operates through dust, rain and low light",
            "Runs mixed human and robot traffic safely",
          ],
          useCases: [
            "Autonomous yard trucks",
            "Mine-site haulage",
            "Warehouse tugger fleets",
          ],
          technologies: ["ISO 26262", "CUDA", "ROS 2", "DDS"],
          specifications: {
            "Detection range": "180 m",
            "Safety rating": "ASIL-D capable",
            "Compute draw": "85 W typical",
            "Sensor inputs": "12 camera, 4 LiDAR, 6 radar",
            "Cycle time": "20 ms",
          },
          model3D: model("stack", ACCENT, [
            [
              "hs-fusion",
              "Fusion Core",
              "Time-synchronised fusion of camera, LiDAR and radar into one world model.",
              [0, 1.0, 0.6],
            ],
            [
              "hs-pred",
              "Intent Predictor",
              "Forecasts the next six seconds of motion for every tracked agent.",
              [1.25, -0.1, 0.4],
            ],
            [
              "hs-safe",
              "Safety Monitor",
              "Independent watchdog able to trigger a controlled stop within 200 ms.",
              [-1.2, -0.8, 0.4],
            ],
          ]),
        },
      ],
    ),
    cat(
      "ft-ai",
      "ft-ai-agents",
      "Autonomous Agents",
      "bot",
      "Governed agent frameworks that execute real business processes end to end.",
      3,
      [
        {
          name: "Orchestrate One",
          tagline: "Governed multi-agent process engine",
          description:
            "Runs long-lived agent workflows against enterprise systems with approvals, compensation steps and full replay.",
          features: [
            "Durable workflow execution with replay",
            "Human approval gates at any step",
            "Typed tool registry with scoped credentials",
            "Automatic compensation on failure",
          ],
          benefits: [
            "Makes agent behaviour auditable end to end",
            "Recovers cleanly from partial failures",
            "Lets process owners keep final control",
          ],
          useCases: [
            "Order-to-cash exception handling",
            "Supplier onboarding",
            "IT service-request fulfilment",
          ],
          technologies: ["Temporal", "gRPC", "Postgres", "OPA"],
          specifications: {
            "Concurrent workflows": "250,000",
            "Max run duration": "12 months",
            "Tool connectors": "140 prebuilt",
            Replay: "Deterministic, full history",
            Authorisation: "OPA policy per tool call",
          },
          model3D: model("lattice", ACCENT, [
            [
              "hs-plan",
              "Planner",
              "Decomposes an objective into a typed, resumable task graph.",
              [0, 1.15, 0.4],
            ],
            [
              "hs-tools",
              "Tool Registry",
              "Every callable system, wrapped with schema validation and scoped credentials.",
              [1.3, -0.2, 0.4],
            ],
            [
              "hs-gate",
              "Approval Gate",
              "Pauses execution and routes to a named human owner for irreversible actions.",
              [-1.25, -0.5, 0.5],
            ],
          ]),
        },
        {
          name: "Copilot Frame",
          tagline: "Embedded assistant toolkit",
          description:
            "A component toolkit for embedding grounded assistants directly inside existing enterprise applications.",
          features: [
            "Drop-in UI components for web and desktop",
            "Retrieval grounded in existing permissions",
            "Inline citations on every generated claim",
            "Offline transcript export",
          ],
          benefits: [
            "Ships an assistant in weeks, not quarters",
            "Never shows a user data they cannot already see",
            "Builds trust through visible sourcing",
          ],
          useCases: [
            "Claims-handling assistants",
            "Field-service knowledge lookup",
            "Internal policy question answering",
          ],
          technologies: ["React", "WebSockets", "pgvector", "OpenTelemetry"],
          specifications: {
            "Bundle size": "64 kB gzipped",
            Grounding: "Permission-aware retrieval",
            Languages: "34 supported",
            Latency: "First token < 400 ms",
            Theming: "Full design-token override",
          },
          model3D: model("prism", ACCENT, [
            [
              "hs-ui",
              "Surface Layer",
              "Framework-agnostic components that inherit the host application's design tokens.",
              [0, 1.1, 0.5],
            ],
            [
              "hs-ground",
              "Grounding Engine",
              "Resolves every answer against sources the current user is entitled to read.",
              [1.2, -0.3, 0.5],
            ],
            [
              "hs-cite",
              "Citation Trace",
              "Links each sentence back to its supporting passage for one-click verification.",
              [-1.2, -0.6, 0.4],
            ],
          ]),
        },
        {
          name: "Signal Reasoner",
          tagline: "Operational decision intelligence",
          description:
            "Continuously reads operational telemetry, forms hypotheses about anomalies and recommends ranked interventions.",
          features: [
            "Causal graph learning over operational metrics",
            "Ranked intervention recommendations",
            "Counterfactual what-if simulation",
            "Narrative incident summaries",
          ],
          benefits: [
            "Cuts mean time to diagnosis by 62%",
            "Explains why, not just what changed",
            "Turns telemetry into a decision, not a chart",
          ],
          useCases: [
            "Manufacturing yield investigation",
            "Network incident triage",
            "Energy-grid load anomaly response",
          ],
          technologies: ["DoWhy", "Polars", "ClickHouse", "Arrow"],
          specifications: {
            "Series capacity": "4 million concurrent",
            "Diagnosis latency": "< 9 seconds",
            "Causal depth": "6 hops",
            Simulation: "10k counterfactuals/run",
            Export: "Markdown, PDF, API",
          },
          model3D: model("core", ACCENT, [
            [
              "hs-graph",
              "Causal Graph",
              "Learned dependency structure across millions of operational signals.",
              [0, 1.2, 0.3],
            ],
            [
              "hs-sim",
              "Counterfactual Engine",
              "Simulates candidate interventions before anyone touches production.",
              [1.3, 0, 0.4],
            ],
            [
              "hs-story",
              "Narrative Layer",
              "Writes the incident explanation an operations lead can act on immediately.",
              [-1.2, -0.7, 0.4],
            ],
          ]),
        },
      ],
    ),
  ],
};
