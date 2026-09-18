import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ModelShape } from "@/data/types";

type Props = {
  shape: ModelShape;
  accent: string;
  wireframe: boolean;
  autoRotate: boolean;
  speed: number;
};

function useMaterials(accent: string, wireframe: boolean) {
  return useMemo(() => {
    const color = new THREE.Color(accent);
    const body = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0d1526"),
      metalness: 0.85,
      roughness: 0.25,
      emissive: color.clone().multiplyScalar(0.18),
      wireframe,
    });
    const glow = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1.6,
      metalness: 0.2,
      roughness: 0.35,
      wireframe,
    });
    const frame = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const copper = new THREE.MeshStandardMaterial({
      color: "#b87333",
      emissive: new THREE.Color("#5c2e12"),
      emissiveIntensity: 0.35,
      metalness: 0.92,
      roughness: 0.2,
      transparent: !wireframe,
      opacity: wireframe ? 0.3 : 0.48,
      wireframe,
      depthWrite: false,
    });
    return { body, glow, frame, copper };
  }, [accent, wireframe]);
}

export function ProductModel({ shape, accent, wireframe, autoRotate, speed }: Props) {
  const group = useRef<THREE.Group>(null);
  const { body, glow, frame, copper } = useMaterials(accent, wireframe);

  useFrame((_, delta) => {
    if (group.current && autoRotate) group.current.rotation.y += delta * speed;
  });

  return (
    <group ref={group}>
      {shape === "core" && (
        <>
          <mesh material={glow}>
            <icosahedronGeometry args={[0.85, 1]} />
          </mesh>
          <mesh material={body}>
            <icosahedronGeometry args={[1.45, 1]} />
          </mesh>
          <mesh material={frame}>
            <icosahedronGeometry args={[2.05, 1]} />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              material={body}
              rotation={[Math.PI / 2 + i * 0.7, i * 0.9, i * 0.4]}
            >
              <torusGeometry args={[1.85, 0.035, 12, 96]} />
            </mesh>
          ))}
        </>
      )}

      {shape === "lattice" && (
        <>
          {Array.from({ length: 27 }).map((_, i) => {
            const x = (i % 3) - 1;
            const y = (Math.floor(i / 3) % 3) - 1;
            const z = Math.floor(i / 9) - 1;
            const edge = Math.abs(x) + Math.abs(y) + Math.abs(z);
            if (edge === 0) return null;
            return (
              <mesh key={i} position={[x * 1.1, y * 1.1, z * 1.1]} material={edge > 2 ? glow : body}>
                <boxGeometry args={[0.34, 0.34, 0.34]} />
              </mesh>
            );
          })}
          <mesh material={frame}>
            <boxGeometry args={[2.6, 2.6, 2.6]} />
          </mesh>
          <mesh material={glow} scale={0.55}>
            <octahedronGeometry args={[0.8, 0]} />
          </mesh>
        </>
      )}

      {shape === "shield" && (
        <>
          <mesh material={body} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 0.22, 6]} />
          </mesh>
          <mesh material={glow} position={[0, 0.2, 0]} rotation={[0, Math.PI / 6, 0]}>
            <cylinderGeometry args={[1.05, 1.05, 0.2, 6]} />
          </mesh>
          <mesh material={body} position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.2, 6]} />
          </mesh>
          <mesh material={frame} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.95, 0.03, 10, 6]} />
          </mesh>
          <mesh material={frame} scale={1.15}>
            <sphereGeometry args={[1.6, 18, 12]} />
          </mesh>
        </>
      )}

      {shape === "orbital" && (
        <>
          <mesh material={glow}>
            <sphereGeometry args={[0.72, 32, 24]} />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <group key={i} rotation={[i * 0.65, i * 1.2, i * 0.35]}>
              <mesh material={body}>
                <torusGeometry args={[1.35 + i * 0.22, 0.028, 10, 96]} />
              </mesh>
              <mesh material={glow} position={[1.35 + i * 0.22, 0, 0]} scale={0.16}>
                <sphereGeometry args={[1, 16, 12]} />
              </mesh>
            </group>
          ))}
          <mesh material={frame}>
            <sphereGeometry args={[2.1, 22, 14]} />
          </mesh>
        </>
      )}

      {shape === "stack" && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              material={i === 1 ? glow : body}
              position={[0, -0.9 + i * 0.62, 0]}
              rotation={[0, i * 0.12, 0]}
            >
              <boxGeometry args={[2.1 - i * 0.16, 0.42, 1.5 - i * 0.12]} />
            </mesh>
          ))}
          <mesh material={frame} position={[0, 0.05, 0]}>
            <boxGeometry args={[2.5, 2.7, 1.9]} />
          </mesh>
        </>
      )}

      {shape === "prism" && (
        <>
          <mesh material={body} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[1.25, 2.1, 4]} />
          </mesh>
          <mesh material={glow} position={[0, 1.1, 0]}>
            <coneGeometry args={[0.85, 1.2, 4]} />
          </mesh>
          <mesh material={frame} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}>
            <torusGeometry args={[1.5, 0.03, 8, 4]} />
          </mesh>
          <mesh material={frame} scale={1.2}>
            <octahedronGeometry args={[1.6, 0]} />
          </mesh>
        </>
      )}

      {shape === "wire" && (
        <>
          <mesh material={copper} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[1.45, 1.45, 3.7, 64, 1, true]} />
          </mesh>
          <mesh material={glow}>
            <cylinderGeometry args={[0.24, 0.24, 3.45, 32]} />
          </mesh>
          <mesh material={frame}>
            <cylinderGeometry args={[1.52, 1.52, 3.82, 64, 1, true]} />
          </mesh>
          <mesh material={copper} position={[0, 1.86, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.45, 0.08, 12, 64]} />
          </mesh>
          <mesh material={copper} position={[0, -1.86, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.45, 0.08, 12, 64]} />
          </mesh>
          <mesh material={glow} position={[0, 0, 0.28]}>
            <torusGeometry args={[0.24, 0.045, 12, 32]} />
          </mesh>
        </>
      )}
    </group>
  );
}
