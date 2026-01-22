// apps/web/src/components/nodes/HeadsetNode.tsx
// VR/AR - Futuristic VR headset with advanced holographic effects
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BaseNode } from './BaseNode';
import type { ProjectNode } from '@core/types/project';

interface HeadsetNodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function HeadsetNode({ project, isActive, isHovered, onClick, onHover }: HeadsetNodeProps) {
  const headsetRef = useRef<THREE.Group>(null);
  const holoRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Mesh>(null);
  const lensLeftRef = useRef<THREE.Mesh>(null);
  const lensRightRef = useRef<THREE.Mesh>(null);
  const dataParticlesRef = useRef<THREE.Group>(null);
  const energyBeamRef = useRef<THREE.Group>(null);
  const pulseRef = useRef(0);

  // Data particles for holographic effect
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      radius: 0.45 + Math.random() * 0.15,
      y: (Math.random() - 0.5) * 0.4,
      speed: 0.3 + Math.random() * 0.4,
      size: 0.012 + Math.random() * 0.01,
    }));
  }, []);

  // Holographic UI panel positions
  const panels = useMemo(() => {
    return [0, 1, 2, 3, 4].map((i) => ({
      angle: (i / 5) * Math.PI * 2,
      radius: 0.55,
      height: 0.05 + (i % 2) * 0.12,
      width: 0.15 + (i % 3) * 0.05,
      depth: 0.08 + (i % 2) * 0.04,
    }));
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const speed = isHovered || isActive ? 1.5 : 1;

    // Headset floating & subtle rotation
    if (headsetRef.current) {
      headsetRef.current.position.y = Math.sin(t * 0.8 * speed) * 0.04;
      headsetRef.current.rotation.y = Math.sin(t * 0.3) * 0.15;
      headsetRef.current.rotation.x = Math.sin(t * 0.5) * 0.03;
    }

    // Holographic UI rotation
    if (holoRef.current) {
      holoRef.current.rotation.y += delta * 0.4 * speed;
    }

    // Multi-ring orbital system
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x += delta * 0.2 * (i % 2 === 0 ? 1 : -1);
        ring.rotation.z += delta * 0.15 * (i % 2 === 0 ? -1 : 1);
      });
    }

    // Scan line animation on visor
    if (scanLineRef.current) {
      const scanY = Math.sin(t * 2) * 0.08;
      scanLineRef.current.position.y = scanY;
    }

    // Pulsing lens effect
    pulseRef.current += delta * 3;
    const lensPulse = 0.7 + Math.sin(pulseRef.current) * 0.3;
    if (lensLeftRef.current) {
      (lensLeftRef.current.material as THREE.MeshBasicMaterial).opacity = lensPulse * (isHovered ? 0.8 : 0.5);
    }
    if (lensRightRef.current) {
      (lensRightRef.current.material as THREE.MeshBasicMaterial).opacity = lensPulse * (isHovered ? 0.8 : 0.5);
    }

    // Animate data particles
    if (dataParticlesRef.current) {
      dataParticlesRef.current.children.forEach((child, i) => {
        const p = particles[i];
        if (!p) return;
        p.angle += delta * p.speed * speed;
        child.position.x = Math.cos(p.angle) * p.radius;
        child.position.z = Math.sin(p.angle) * p.radius;
        child.position.y = p.y + Math.sin(t * 2 + i) * 0.05;
      });
    }

    // Energy beam rotation
    if (energyBeamRef.current) {
      energyBeamRef.current.rotation.y -= delta * 1.5;
    }
  });

  const intensity = isHovered ? 1.4 : isActive ? 1.6 : 1;

  return (
    <BaseNode
      project={project}
      isActive={isActive}
      isHovered={isHovered}
      onClick={onClick}
      onHover={onHover}
    >
      <group ref={headsetRef}>
        {/* Main headset body - sleeker design */}
        <mesh>
          <boxGeometry args={[0.52, 0.24, 0.28]} />
          <meshStandardMaterial
            color="#0a0a0f"
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>

        {/* Body accent edges */}
        <mesh position={[0, 0.125, 0]}>
          <boxGeometry args={[0.54, 0.015, 0.30]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={0.5 * intensity}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, -0.125, 0]}>
          <boxGeometry args={[0.54, 0.015, 0.30]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={0.5 * intensity}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Front visor - curved effect with gradient */}
        <mesh position={[0, 0, 0.15]}>
          <boxGeometry args={[0.50, 0.20, 0.02]} />
          <meshStandardMaterial
            color="#050510"
            emissive={project.color}
            emissiveIntensity={0.3 * intensity}
            metalness={0.95}
            roughness={0.05}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Visor glow frame */}
        <mesh position={[0, 0, 0.16]}>
          <boxGeometry args={[0.52, 0.22, 0.005]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.15 * intensity}
          />
        </mesh>

        {/* Animated scan line */}
        <mesh ref={scanLineRef} position={[0, 0, 0.165]}>
          <planeGeometry args={[0.48, 0.008]} />
          <meshBasicMaterial
            color={project.glowColor ?? project.color}
            transparent
            opacity={0.7 * intensity}
          />
        </mesh>

        {/* Lens circles - left */}
        <mesh position={[-0.12, 0, 0.17]}>
          <ringGeometry args={[0.05, 0.065, 24]} />
          <meshBasicMaterial
            color={project.glowColor ?? project.color}
            transparent
            opacity={0.6 * intensity}
          />
        </mesh>
        <mesh ref={lensLeftRef} position={[-0.12, 0, 0.17]}>
          <circleGeometry args={[0.05, 24]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.5}
          />
        </mesh>
        {/* Inner lens glow */}
        <mesh position={[-0.12, 0, 0.168]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3 * intensity}
          />
        </mesh>

        {/* Lens circles - right */}
        <mesh position={[0.12, 0, 0.17]}>
          <ringGeometry args={[0.05, 0.065, 24]} />
          <meshBasicMaterial
            color={project.glowColor ?? project.color}
            transparent
            opacity={0.6 * intensity}
          />
        </mesh>
        <mesh ref={lensRightRef} position={[0.12, 0, 0.17]}>
          <circleGeometry args={[0.05, 24]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.5}
          />
        </mesh>
        {/* Inner lens glow */}
        <mesh position={[0.12, 0, 0.168]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3 * intensity}
          />
        </mesh>

        {/* Side panels with LED accents */}
        <mesh position={[0.27, 0, 0]}>
          <boxGeometry args={[0.02, 0.18, 0.24]} />
          <meshStandardMaterial
            color="#151520"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Side LED strip - right */}
        <mesh position={[0.285, 0, 0]}>
          <boxGeometry args={[0.005, 0.12, 0.18]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.5 * intensity}
          />
        </mesh>

        <mesh position={[-0.27, 0, 0]}>
          <boxGeometry args={[0.02, 0.18, 0.24]} />
          <meshStandardMaterial
            color="#151520"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Side LED strip - left */}
        <mesh position={[-0.285, 0, 0]}>
          <boxGeometry args={[0.005, 0.12, 0.18]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.5 * intensity}
          />
        </mesh>

        {/* Head strap - more detailed */}
        <mesh position={[0, 0.08, -0.18]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.35, 0.05, 0.12]} />
          <meshStandardMaterial
            color="#1a1a25"
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
        {/* Strap accent */}
        <mesh position={[0, 0.105, -0.17]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.25, 0.01, 0.10]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.3 * intensity}
          />
        </mesh>

        {/* Front sensors/cameras */}
        {[-0.18, 0, 0.18].map((x, i) => (
          <mesh key={i} position={[x, 0.10, 0.14]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial
              color={i === 1 ? project.color : '#333340'}
            />
          </mesh>
        ))}
      </group>

      {/* Holographic UI panels */}
      <group ref={holoRef}>
        {panels.map((panel, i) => (
          <group key={i}>
            <mesh
              position={[
                Math.cos(panel.angle) * panel.radius,
                panel.height,
                Math.sin(panel.angle) * panel.radius,
              ]}
              rotation={[0, -panel.angle + Math.PI, 0]}
            >
              <planeGeometry args={[panel.width, panel.depth]} />
              <meshBasicMaterial
                color={project.glowColor ?? project.color}
                transparent
                opacity={0.25 * intensity}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Panel border glow */}
            <mesh
              position={[
                Math.cos(panel.angle) * panel.radius,
                panel.height,
                Math.sin(panel.angle) * panel.radius,
              ]}
              rotation={[0, -panel.angle + Math.PI, 0]}
            >
              <planeGeometry args={[panel.width + 0.02, panel.depth + 0.02]} />
              <meshBasicMaterial
                color={project.color}
                transparent
                opacity={0.1 * intensity}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Multi-ring orbital system */}
      <group ref={ringsRef}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.48, 0.008, 6, 32]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.4 * intensity}
          />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[0.42, 0.006, 6, 32]} />
          <meshBasicMaterial
            color={project.glowColor ?? project.color}
            transparent
            opacity={0.3 * intensity}
          />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2.5, -Math.PI / 3, 0]}>
          <torusGeometry args={[0.52, 0.005, 6, 32]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.25 * intensity}
          />
        </mesh>
      </group>

      {/* Data particles */}
      <group ref={dataParticlesRef}>
        {particles.map((p, i) => (
          <mesh key={i} position={[Math.cos(p.angle) * p.radius, p.y, Math.sin(p.angle) * p.radius]}>
            <octahedronGeometry args={[p.size, 0]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? project.color : (project.glowColor ?? project.color)}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* Energy beams from headset */}
      <group ref={energyBeamRef}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[0, -0.15, 0]}
            rotation={[0, (i / 3) * Math.PI * 2, Math.PI / 2]}
          >
            <torusGeometry args={[0.35, 0.003, 4, 16, Math.PI * 0.4]} />
            <meshBasicMaterial
              color={project.color}
              transparent
              opacity={0.4 * intensity}
            />
          </mesh>
        ))}
      </group>

      {/* Bottom glow effect */}
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 24]} />
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={0.15 * intensity}
        />
      </mesh>
    </BaseNode>
  );
}

export default HeadsetNode;
