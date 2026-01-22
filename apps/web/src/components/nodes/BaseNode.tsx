// apps/web/src/components/nodes/BaseNode.tsx
import { useRef, ReactNode } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ProjectNode } from '@core/types/project';

interface BaseNodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
  children: ReactNode;
}

export function BaseNode({
  project,
  isActive,
  isHovered,
  onClick,
  onHover,
  children,
}: BaseNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetScale = useRef(1);

  // Animate rotation and hover effects
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Rotation
    const rotSpeed = project.rotationSpeed ?? 0.5;
    groupRef.current.rotation.y += delta * rotSpeed;

    // Scale animation on hover/active
    targetScale.current = isHovered ? 1.15 : isActive ? 1.2 : 1;
    const currentScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, delta * 5);
    groupRef.current.scale.setScalar(newScale);

    // Subtle floating animation
    const time = state.clock.getElapsedTime();
    const floatOffset = Math.sin(time * 0.5 + project.position[0]) * 0.05;
    groupRef.current.position.y = project.position[1] + floatOffset;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(true);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(false);
  };

  return (
    <group
      ref={groupRef}
      position={project.position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {children}

      {/* Floating label */}
      <Html
        position={[0, 1, 0]}
        center
        distanceFactor={8}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'opacity 0.3s',
          opacity: isHovered || isActive ? 1 : 0.6,
        }}
      >
        <div
          style={{
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: isHovered || isActive ? '#fff' : 'rgba(255,255,255,0.8)',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              marginBottom: 2,
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              fontSize: 10,
              color: project.color,
              opacity: isHovered || isActive ? 1 : 0.7,
              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            }}
          >
            {project.subtitle}
          </div>
        </div>
      </Html>

      {/* Glow effect */}
      <pointLight
        color={project.glowColor ?? project.color}
        intensity={isHovered ? 2 : isActive ? 2.5 : 0.8}
        distance={3}
        decay={2}
      />
    </group>
  );
}

export default BaseNode;
