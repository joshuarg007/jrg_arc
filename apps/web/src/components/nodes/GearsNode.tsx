// apps/web/src/components/nodes/GearsNode.tsx
// Automation - Advanced holographic gear mechanism
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BaseNode } from './BaseNode';
import type { ProjectNode } from '@core/types/project';

interface GearsNodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

// Create gear shape with teeth
function createGearGeometry(innerRadius: number, outerRadius: number, teeth: number, thickness: number) {
  const shape = new THREE.Shape();
  const toothDepth = (outerRadius - innerRadius) * 0.6;

  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2;
    const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
    const midAngle = (angle + nextAngle) / 2;
    const toothWidth = (nextAngle - angle) * 0.3;

    // Base of tooth
    const x1 = Math.cos(angle) * innerRadius;
    const y1 = Math.sin(angle) * innerRadius;
    // Tooth tip start
    const x2 = Math.cos(midAngle - toothWidth) * outerRadius;
    const y2 = Math.sin(midAngle - toothWidth) * outerRadius;
    // Tooth tip end
    const x3 = Math.cos(midAngle + toothWidth) * outerRadius;
    const y3 = Math.sin(midAngle + toothWidth) * outerRadius;
    // Next base
    const x4 = Math.cos(nextAngle) * innerRadius;
    const y4 = Math.sin(nextAngle) * innerRadius;

    if (i === 0) {
      shape.moveTo(x1, y1);
    }
    shape.lineTo(x2, y2);
    shape.lineTo(x3, y3);
    shape.lineTo(x4, y4);
  }

  const extrudeSettings = { depth: thickness, bevelEnabled: false };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

export function GearsNode({ project, isActive, isHovered, onClick, onHover }: GearsNodeProps) {
  const mainGearRef = useRef<THREE.Group>(null);
  const secondGearRef = useRef<THREE.Group>(null);
  const thirdGearRef = useRef<THREE.Group>(null);
  const orbitRingRef = useRef<THREE.Mesh>(null);
  const energyCoreRef = useRef<THREE.Mesh>(null);
  const dataParticlesRef = useRef<THREE.Group>(null);
  const arcRef = useRef<THREE.Group>(null);
  const pulseRef = useRef(0);

  // Create gear geometries
  const gearGeo1 = useMemo(() => createGearGeometry(0.15, 0.32, 12, 0.06), []);
  const gearGeo2 = useMemo(() => createGearGeometry(0.1, 0.22, 10, 0.05), []);
  const gearGeo3 = useMemo(() => createGearGeometry(0.06, 0.14, 8, 0.04), []);

  // Data particles - OPTIMIZED
  const particles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      radius: 0.4 + Math.random() * 0.15,
      speed: 0.5 + Math.random() * 0.5,
      y: (Math.random() - 0.5) * 0.3,
      size: 0.015 + Math.random() * 0.015,
    }));
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const speed = isHovered || isActive ? 2.5 : 1;

    // Rotate gears (interlocking - opposite directions)
    if (mainGearRef.current) mainGearRef.current.rotation.z += delta * 0.8 * speed;
    if (secondGearRef.current) secondGearRef.current.rotation.z -= delta * 1.1 * speed;
    if (thirdGearRef.current) thirdGearRef.current.rotation.z += delta * 1.5 * speed;

    // Orbit ring rotation
    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.1;
      orbitRingRef.current.rotation.z += delta * 0.3;
    }

    // Energy core pulse
    pulseRef.current += delta * 3;
    if (energyCoreRef.current) {
      const pulse = 0.8 + Math.sin(pulseRef.current) * 0.2;
      energyCoreRef.current.scale.setScalar(pulse);
    }

    // Animate data particles
    if (dataParticlesRef.current) {
      dataParticlesRef.current.children.forEach((child, i) => {
        const p = particles[i];
        if (!p) return;
        p.angle += delta * p.speed * speed;
        child.position.x = Math.cos(p.angle) * p.radius;
        child.position.z = Math.sin(p.angle) * p.radius;
        child.position.y = p.y + Math.sin(time * 2 + i) * 0.05;
      });
    }

    // Energy arcs rotation
    if (arcRef.current) {
      arcRef.current.rotation.y += delta * 2;
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
      {/* Central energy core */}
      <mesh ref={energyCoreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.3} />
      </mesh>

      {/* Main gear - front */}
      <group ref={mainGearRef} position={[0, 0, 0.1]} rotation={[0, 0, 0]}>
        <mesh geometry={gearGeo1} position={[0, 0, -0.03]}>
          <meshStandardMaterial
            color="#1a1a2e"
            emissive={project.color}
            emissiveIntensity={0.4 * intensity}
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Gear wireframe overlay */}
        <mesh geometry={gearGeo1} position={[0, 0, -0.03]}>
          <meshBasicMaterial color={project.color} wireframe transparent opacity={0.5 * intensity} />
        </mesh>
      </group>

      {/* Second gear - offset */}
      <group ref={secondGearRef} position={[0.28, 0.12, 0]} rotation={[0, 0, 0]}>
        <mesh geometry={gearGeo2} position={[0, 0, -0.025]}>
          <meshStandardMaterial
            color="#1a1a2e"
            emissive={project.glowColor ?? project.color}
            emissiveIntensity={0.5 * intensity}
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh geometry={gearGeo2} position={[0, 0, -0.025]}>
          <meshBasicMaterial color={project.glowColor ?? project.color} wireframe transparent opacity={0.6 * intensity} />
        </mesh>
      </group>

      {/* Third gear - smaller, faster */}
      <group ref={thirdGearRef} position={[-0.22, -0.18, 0.05]} rotation={[0, 0, 0]}>
        <mesh geometry={gearGeo3} position={[0, 0, -0.02]}>
          <meshStandardMaterial
            color="#1a1a2e"
            emissive={project.color}
            emissiveIntensity={0.6 * intensity}
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={0.75}
          />
        </mesh>
        <mesh geometry={gearGeo3} position={[0, 0, -0.02]}>
          <meshBasicMaterial color={project.color} wireframe transparent opacity={0.7 * intensity} />
        </mesh>
      </group>

      {/* Orbital ring - OPTIMIZED */}
      <mesh ref={orbitRingRef} position={[0, 0, 0]}>
        <torusGeometry args={[0.45, 0.008, 6, 32]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.4 * intensity} />
      </mesh>

      {/* Data particles orbiting */}
      <group ref={dataParticlesRef}>
        {particles.map((p, i) => (
          <mesh key={i} position={[Math.cos(p.angle) * p.radius, p.y, Math.sin(p.angle) * p.radius]}>
            <boxGeometry args={[p.size, p.size, p.size]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? project.color : (project.glowColor ?? project.color)}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Energy arcs */}
      <group ref={arcRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, (i / 3) * Math.PI * 2, Math.PI / 2]}>
            <torusGeometry args={[0.25, 0.003, 4, 16, Math.PI * 0.3]} />
            <meshBasicMaterial color={project.color} transparent opacity={0.5 * intensity} />
          </mesh>
        ))}
      </group>

      {/* Connection lines between gears */}
      <mesh position={[0.14, 0.06, 0.05]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.18, 0.008, 0.008]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.4 * intensity} />
      </mesh>
      <mesh position={[-0.11, -0.09, 0.025]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.15, 0.006, 0.006]} />
        <meshBasicMaterial color={project.color} transparent opacity={0.4 * intensity} />
      </mesh>
    </BaseNode>
  );
}

export default GearsNode;
