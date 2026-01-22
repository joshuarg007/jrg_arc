// apps/web/src/components/nodes/ExplodedNode.tsx
// SciVista - Exploded mechanical assembly
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BaseNode } from './BaseNode';
import type { ProjectNode } from '@core/types/project';

interface ExplodedNodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function ExplodedNode({ project, isActive, isHovered, onClick, onHover }: ExplodedNodeProps) {
  const partsRef = useRef<THREE.Group>(null);
  const explosionRef = useRef(0);

  useFrame((_, delta) => {
    const targetExplosion = isHovered || isActive ? 1 : 0;
    explosionRef.current = THREE.MathUtils.lerp(explosionRef.current, targetExplosion, delta * 3);

    if (partsRef.current) {
      partsRef.current.rotation.y += delta * 0.2;
    }
  });

  const intensity = isHovered ? 1.2 : isActive ? 1.5 : 1;
  const exp = explosionRef.current;

  return (
    <BaseNode
      project={project}
      isActive={isActive}
      isHovered={isHovered}
      onClick={onClick}
      onHover={onHover}
    >
      <group ref={partsRef}>
        {/* Central cylinder */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.4, 16]} />
          <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Top cover */}
        <mesh position={[0, 0.3 + exp * 0.3, 0]}>
          <boxGeometry args={[0.35, 0.08, 0.35]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={0.3 * intensity}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Side components */}
        <mesh position={[0.3 + exp * 0.3, 0, 0]}>
          <boxGeometry args={[0.12, 0.25, 0.15]} />
          <meshStandardMaterial color={project.color} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.3 - exp * 0.3, 0, 0]}>
          <boxGeometry args={[0.12, 0.25, 0.15]} />
          <meshStandardMaterial color={project.color} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Front/back cylinders */}
        <mesh position={[0, 0, 0.28 + exp * 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.15, 8]} />
          <meshStandardMaterial color="#999999" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, -0.28 - exp * 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.15, 8]} />
          <meshStandardMaterial color="#999999" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Bottom base */}
        <mesh position={[0, -0.3 - exp * 0.3, 0]}>
          <boxGeometry args={[0.4, 0.06, 0.4]} />
          <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Highlight spheres */}
        <mesh position={[0.15 + exp * 0.15, 0.15 + exp * 0.15, 0.15 + exp * 0.15]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial
            color={project.glowColor ?? project.color}
            emissive={project.glowColor ?? project.color}
            emissiveIntensity={0.5 * intensity}
          />
        </mesh>
        <mesh position={[-0.15 - exp * 0.15, 0.15 + exp * 0.15, -0.15 - exp * 0.15]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial
            color={project.glowColor ?? project.color}
            emissive={project.glowColor ?? project.color}
            emissiveIntensity={0.5 * intensity}
          />
        </mesh>
      </group>
    </BaseNode>
  );
}

export default ExplodedNode;
