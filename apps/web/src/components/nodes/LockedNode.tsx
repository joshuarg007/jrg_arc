// apps/web/src/components/nodes/LockedNode.tsx
// Coming Soon - Locked/encrypted cube
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BaseNode } from './BaseNode';
import type { ProjectNode } from '@core/types/project';

interface LockedNodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function LockedNode({ project, isActive, isHovered, onClick, onHover }: LockedNodeProps) {
  const cubeRef = useRef<THREE.Mesh>(null);
  const lockRef = useRef<THREE.Group>(null);
  const glitchRef = useRef(0);

  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.2;
      cubeRef.current.rotation.y += delta * 0.15;

      // Occasional glitch
      glitchRef.current -= delta;
      if (glitchRef.current <= 0 && Math.random() > 0.99) {
        glitchRef.current = 0.1;
        cubeRef.current.position.x = (Math.random() - 0.5) * 0.05;
        cubeRef.current.position.y = (Math.random() - 0.5) * 0.05;
      } else if (glitchRef.current <= 0) {
        cubeRef.current.position.x *= 0.9;
        cubeRef.current.position.y *= 0.9;
      }
    }

    if (lockRef.current) {
      lockRef.current.rotation.y += delta * 0.3;
    }
  });

  const intensity = isHovered ? 1.3 : isActive ? 1.5 : 1;

  return (
    <BaseNode
      project={project}
      isActive={isActive}
      isHovered={isHovered}
      onClick={onClick}
      onHover={onHover}
    >
      {/* Main cube */}
      <mesh ref={cubeRef}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#222222"
          emissive={project.color}
          emissiveIntensity={0.1 * intensity}
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh>
        <boxGeometry args={[0.52, 0.52, 0.52]} />
        <meshBasicMaterial
          color={project.glowColor ?? project.color}
          wireframe
          transparent
          opacity={0.3 * intensity}
        />
      </mesh>

      {/* Lock icon */}
      <group ref={lockRef} position={[0, 0, 0.27]}>
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[0.12, 0.1, 0.02]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={0.3 * intensity}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <torusGeometry args={[0.04, 0.015, 8, 16, Math.PI]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={0.3 * intensity}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Mystery particles */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 0.45;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.15,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial
              color={project.glowColor ?? project.color}
              transparent
              opacity={0.4 * intensity}
            />
          </mesh>
        );
      })}

      {/* Corner brackets */}
      {[
        { x: -1, y: -1 },
        { x: -1, y: 1 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
      ].map((pos, i) => (
        <group key={i} position={[pos.x * 0.28, pos.y * 0.28, 0]}>
          <mesh position={[pos.x * 0.03, 0, 0]}>
            <boxGeometry args={[0.06, 0.01, 0.01]} />
            <meshBasicMaterial color={project.color} transparent opacity={0.5 * intensity} />
          </mesh>
          <mesh position={[0, pos.y * 0.03, 0]}>
            <boxGeometry args={[0.01, 0.06, 0.01]} />
            <meshBasicMaterial color={project.color} transparent opacity={0.5 * intensity} />
          </mesh>
        </group>
      ))}
    </BaseNode>
  );
}

export default LockedNode;
