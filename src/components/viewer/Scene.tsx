import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { ProductModel } from "./ProductModel";
import type { Model3DConfig } from "@/data/types";

export type PresetKey = "front" | "back" | "left" | "right" | "top" | "isometric";

type Props = {
  config: Model3DConfig;
  preset: PresetKey;
  wireframe: boolean;
  autoRotate: boolean;
  activeHotspot: string | null;
  onHotspot: (id: string | null) => void;
  resetSignal: number;
};

function CameraRig({
  target,
  resetSignal,
  controls,
}: {
  target: [number, number, number];
  resetSignal: number;
  controls: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  const desired = useRef(new THREE.Vector3(...target));
  const animating = useRef(true);

  useEffect(() => {
    desired.current.set(...target);
    animating.current = true;
  }, [target, resetSignal]);

  useFrame(() => {
    if (!animating.current) return;
    camera.position.lerp(desired.current, 0.08);
    controls.current?.target.lerp(new THREE.Vector3(0, 0, 0), 0.12);
    controls.current?.update();
    if (camera.position.distanceTo(desired.current) < 0.02) animating.current = false;
  });

  return null;
}

export default function Scene({
  config,
  preset,
  wireframe,
  autoRotate,
  activeHotspot,
  onHotspot,
  resetSignal,
}: Props) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const position = config.cameraAngles[preset].position.map((value) => value * 0.82) as [
    number,
    number,
    number,
  ];

  useEffect(() => {
    const onThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<"dark" | "light">).detail;
      setTheme(nextTheme);
    };
    window.addEventListener("futuretech-theme-change", onThemeChange);
    return () => window.removeEventListener("futuretech-theme-change", onThemeChange);
  }, []);

  const lightMode = theme === "light";

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position, fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "none" }}
    >
      <color attach="background" args={[lightMode ? "#edf5f6" : "#070b14"]} />
      <fog attach="fog" args={[lightMode ? "#edf5f6" : "#070b14", 8, 22]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color={config.accent} />
      <pointLight position={[-5, -3, -4]} intensity={2.2} color={lightMode ? "#5c4bb7" : "#9D6BFF"} />
      <Environment preset="city" />

      <ProductModel
        shape={config.shape}
        accent={config.accent}
        wireframe={wireframe}
        autoRotate={autoRotate}
        speed={config.rotationSpeed}
      />

      {config.hotspots.map((h, i) => (
        <group key={h.id} position={h.position}>
          <mesh onClick={() => onHotspot(activeHotspot === h.id ? null : h.id)}>
            <sphereGeometry args={[0.1, 16, 12]} />
            <meshBasicMaterial color={activeHotspot === h.id ? "#ffffff" : config.accent} />
          </mesh>
          <Html center distanceFactor={9} zIndexRange={[20, 0]}>
            <button
              type="button"
              onClick={() => onHotspot(activeHotspot === h.id ? null : h.id)}
              aria-label={`Hotspot: ${h.title}`}
              className={`flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[11px] transition-colors ${
                activeHotspot === h.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary/60 bg-background/80 text-primary hover:bg-primary/20"
              }`}
            >
              {i + 1}
            </button>
          </Html>
        </group>
      ))}

      <gridHelper
        args={lightMode ? [16, 16, "#6d9aa6", "#c5d9dc"] : [16, 16, "#123049", "#0d1c2c"]}
        position={[0, -2.4, 0]}
      />

      <OrbitControls
        ref={controls}
        enablePan
        enableZoom
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={12}
        makeDefault
      />
      <CameraRig target={position} resetSignal={resetSignal} controls={controls} />
    </Canvas>
  );
}
