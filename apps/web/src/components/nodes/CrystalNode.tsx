// apps/web/src/components/nodes/CrystalNode.tsx
// AxionDeep Labs - Volumetric alchemical laboratory in 3D space
import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BaseNode } from './BaseNode';
import type { ProjectNode } from '@core/types/project';

// Mobile detection for performance optimization
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

// Particle counts (desktop vs mobile)
const HELIX_PARTICLES_DESKTOP = 16;
const HELIX_PARTICLES_MOBILE = 8;
const DATA_PARTICLES_DESKTOP = 12;
const DATA_PARTICLES_MOBILE = 6;

interface CrystalNodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function CrystalNode({ project, isActive, isHovered, onClick, onHover }: CrystalNodeProps) {
  const labRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const helixRef = useRef<THREE.Group>(null);
  const helixParticlesRef = useRef<THREE.Group>(null);
  const helixConnectionsRef = useRef<THREE.Group>(null);
  const orbitalRingsRef = useRef<THREE.Group>(null);
  const energyBeamsRef = useRef<THREE.Group>(null);
  const floatingGemsRef = useRef<THREE.Group>(null);
  const dataStreamRef = useRef<THREE.Group>(null);
  const runeRingsRef = useRef<THREE.Group>(null);
  const particleFieldRef = useRef<THREE.Group>(null);

  // Mobile detection for performance optimization
  const isMobile = useIsMobile();
  const helixParticleCount = isMobile ? HELIX_PARTICLES_MOBILE : HELIX_PARTICLES_DESKTOP;
  const dataParticleCount = isMobile ? DATA_PARTICLES_MOBILE : DATA_PARTICLES_DESKTOP;

  // Double helix particles - OPTIMIZED (mobile-aware)
  const helixParticles = useMemo(() => {
    return Array.from({ length: helixParticleCount }, (_, i) => ({
      index: i,
      strand: i % 2,
      t: (i / helixParticleCount) * Math.PI * 4,
      size: 0.02 + Math.random() * 0.015,
    }));
  }, [helixParticleCount]);

  // Floating data particles - OPTIMIZED (mobile-aware)
  const dataParticles = useMemo(() => {
    return Array.from({ length: dataParticleCount }, () => ({
      x: (Math.random() - 0.5) * 1.2,
      y: (Math.random() - 0.5) * 1.2,
      z: (Math.random() - 0.5) * 1.2,
      speed: 0.5 + Math.random() * 0.5,
      size: 0.008 + Math.random() * 0.012,
      offset: Math.random() * Math.PI * 2,
    }));
  }, [dataParticleCount]);

  // Floating gemstones - OPTIMIZED
  const gems = useMemo(() => {
    return [
      { pos: [0.4, 0.3, 0.3], size: 0.08, type: 'octa', orbit: 0.6 },
      { pos: [-0.35, -0.2, 0.4], size: 0.06, type: 'tetra', orbit: 0.7 },
      { pos: [0.3, -0.35, -0.3], size: 0.07, type: 'octa', orbit: 0.5 },
    ];
  }, []);

  // Energy beam paths - OPTIMIZED
  const beamPaths = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      angle: (i / 3) * Math.PI * 2,
      length: 0.5,
      tilt: (Math.random() - 0.5) * 0.5,
    }));
  }, []);

  // Ambient particle field - OPTIMIZED (removed for performance)
  const ambientParticles: {x: number; y: number; z: number}[] = [];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = isHovered || isActive ? 1.8 : 1;

    // Entire lab gentle rotation
    if (labRef.current) {
      labRef.current.rotation.y += 0.002 * speed;
    }

    // Core pulsing and rotation
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.15;
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.rotation.x += 0.01 * speed;
      coreRef.current.rotation.y += 0.015 * speed;
    }

    // Inner core counter-rotation
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x -= 0.02 * speed;
      innerCoreRef.current.rotation.z += 0.025 * speed;
    }

    // Double helix rotation
    if (helixRef.current) {
      helixRef.current.rotation.y += 0.015 * speed;
    }
    // Animate helix particles separately
    if (helixParticlesRef.current) {
      helixParticlesRef.current.children.forEach((particle, i) => {
        if (i >= helixParticles.length) return;
        const hp = helixParticles[i];
        if (!hp) return;
        const angle = hp.t + t * 2;
        const radius = 0.15;
        const height = ((hp.index / 40) - 0.5) * 0.8;
        const strandOffset = hp.strand * Math.PI;
        particle.position.set(
          Math.cos(angle + strandOffset) * radius,
          height + Math.sin(t * 3 + hp.index * 0.2) * 0.02,
          Math.sin(angle + strandOffset) * radius
        );
      });
    }
    // Animate helix connections
    if (helixConnectionsRef.current) {
      helixConnectionsRef.current.children.forEach((conn, i) => {
        conn.rotation.y = t * 2 + i * 0.628;
      });
    }

    // Orbital rings at different angles
    if (orbitalRingsRef.current) {
      orbitalRingsRef.current.children.forEach((ring, i) => {
        ring.rotation.z += (0.005 + i * 0.002) * speed * (i % 2 ? 1 : -1);
        ring.rotation.x += 0.002 * speed;
      });
    }

    // Energy beams pulsing
    if (energyBeamsRef.current) {
      energyBeamsRef.current.rotation.y += 0.01 * speed;
      energyBeamsRef.current.children.forEach((beam, i) => {
        const scale = 0.8 + Math.sin(t * 4 + i * 0.5) * 0.3;
        beam.scale.set(1, scale, 1);
        ((beam as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity =
          (0.3 + Math.sin(t * 4 + i * 0.5) * 0.2) * (isHovered ? 1.3 : isActive ? 1.5 : 1);
      });
    }

    // Floating gems orbit and spin
    if (floatingGemsRef.current) {
      floatingGemsRef.current.children.forEach((gem, i) => {
        const g = gems[i];
        if (!g) return;
        const orbitAngle = t * g.orbit + i * 1.2;
        const basePos = g.pos as [number, number, number];
        gem.position.set(
          basePos[0] + Math.sin(orbitAngle) * 0.1,
          basePos[1] + Math.sin(t * 1.5 + i) * 0.08,
          basePos[2] + Math.cos(orbitAngle) * 0.1
        );
        gem.rotation.x += 0.02 * speed;
        gem.rotation.y += 0.03 * speed;
        gem.rotation.z += 0.01 * speed;
      });
    }

    // Data stream particles flowing
    if (dataStreamRef.current) {
      dataStreamRef.current.children.forEach((particle, i) => {
        const dp = dataParticles[i];
        if (!dp) return;
        const flow = (t * dp.speed + dp.offset) % 2 - 1;
        particle.position.set(
          dp.x + Math.sin(t + dp.offset) * 0.1,
          dp.y + flow * 0.5,
          dp.z + Math.cos(t + dp.offset) * 0.1
        );
        const distFromCenter = Math.sqrt(dp.x * dp.x + dp.z * dp.z);
        ((particle as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity =
          (0.6 - distFromCenter * 0.3) * (isHovered ? 1.3 : 1);
      });
    }

    // Rune rings rotation
    if (runeRingsRef.current) {
      runeRingsRef.current.children.forEach((ring, i) => {
        ring.rotation.z += (0.003 + i * 0.001) * speed * (i % 2 ? -1 : 1);
      });
    }

    // Particle field shimmer
    if (particleFieldRef.current) {
      particleFieldRef.current.children.forEach((p, i) => {
        const shimmer = Math.sin(t * 2 + i * 0.3) * 0.5 + 0.5;
        ((p as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = shimmer * 0.4;
      });
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
      <group ref={labRef}>
        {/* Central alchemical core - nested polyhedra */}
        <group position={[0, 0, 0]}>
          {/* Outer core shell */}
          <mesh ref={coreRef}>
            <icosahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial
              color={project.color}
              emissive={project.color}
              emissiveIntensity={0.6 * intensity}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.7}
              wireframe
            />
          </mesh>
          {/* Inner core - counter-rotating */}
          <mesh ref={innerCoreRef}>
            <octahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial
              color={project.glowColor ?? '#ffffff'}
              emissive={project.glowColor ?? project.color}
              emissiveIntensity={1.2 * intensity}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          {/* Core glow */}
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color={project.color} transparent opacity={0.15 * intensity} />
          </mesh>
        </group>

        {/* Double helix DNA-like structure */}
        <group ref={helixRef}>
          <group ref={helixParticlesRef}>
            {helixParticles.map((hp, i) => (
              <mesh key={i}>
                <sphereGeometry args={[hp.size, 8, 8]} />
                <meshBasicMaterial
                  color={hp.strand === 0 ? project.color : (project.glowColor ?? '#ffffff')}
                  transparent
                  opacity={0.8 * intensity}
                />
              </mesh>
            ))}
          </group>
          {/* Helix connections - OPTIMIZED */}
          <group ref={helixConnectionsRef}>
            {Array.from({ length: 4 }).map((_, i) => (
              <mesh key={i} position={[0, ((i / 4) - 0.5) * 0.8, 0]} rotation={[0, i * 1.57, Math.PI / 2]}>
                <cylinderGeometry args={[0.005, 0.005, 0.3, 4]} />
                <meshBasicMaterial color={project.color} transparent opacity={0.3 * intensity} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Orbital rings - OPTIMIZED (reduced count and segments) */}
        <group ref={orbitalRingsRef}>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.45, 0.008, 6, 32]} />
            <meshBasicMaterial color={project.color} transparent opacity={0.5 * intensity} />
          </mesh>
          <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
            <torusGeometry args={[0.52, 0.006, 6, 32]} />
            <meshBasicMaterial color={project.glowColor ?? project.color} transparent opacity={0.35 * intensity} />
          </mesh>
        </group>

        {/* Energy beams radiating outward in 3D */}
        <group ref={energyBeamsRef}>
          {beamPaths.map((beam, i) => (
            <mesh
              key={i}
              position={[
                Math.cos(beam.angle) * 0.25,
                beam.tilt * 0.3,
                Math.sin(beam.angle) * 0.25,
              ]}
              rotation={[beam.tilt, -beam.angle + Math.PI / 2, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.015, 0.003, beam.length, 6]} />
              <meshBasicMaterial color={project.color} transparent opacity={0.4 * intensity} />
            </mesh>
          ))}
        </group>

        {/* Floating gemstones at various depths */}
        <group ref={floatingGemsRef}>
          {gems.map((gem, i) => (
            <mesh key={i} position={gem.pos as [number, number, number]}>
              {gem.type === 'octa' && <octahedronGeometry args={[gem.size, 0]} />}
              {gem.type === 'tetra' && <tetrahedronGeometry args={[gem.size, 0]} />}
              {gem.type === 'dodeca' && <dodecahedronGeometry args={[gem.size, 0]} />}
              {gem.type === 'ico' && <icosahedronGeometry args={[gem.size, 0]} />}
              <meshStandardMaterial
                color={i % 2 === 0 ? project.color : (project.glowColor ?? '#ff6699')}
                emissive={i % 2 === 0 ? project.color : (project.glowColor ?? project.color)}
                emissiveIntensity={0.5 * intensity}
                metalness={0.7}
                roughness={0.3}
                transparent
                opacity={0.85}
              />
            </mesh>
          ))}
        </group>

        {/* Data stream particles filling 3D space */}
        <group ref={dataStreamRef}>
          {dataParticles.map((dp, i) => (
            <mesh key={i} position={[dp.x, dp.y, dp.z]}>
              <boxGeometry args={[dp.size, dp.size, dp.size]} />
              <meshBasicMaterial
                color={i % 3 === 0 ? project.color : i % 3 === 1 ? (project.glowColor ?? '#ffffff') : '#ffffff'}
                transparent
                opacity={0.5}
              />
            </mesh>
          ))}
        </group>

        {/* Rune ring - OPTIMIZED (single ring) */}
        <group ref={runeRingsRef}>
          <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.35, 0.37, 6]} />
            <meshBasicMaterial color={project.color} transparent opacity={0.3 * intensity} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Ambient particle field for depth */}
        <group ref={particleFieldRef}>
          {ambientParticles.map((p, i) => (
            <mesh key={i} position={[p.x, p.y, p.z]}>
              <sphereGeometry args={[0.006, 4, 4]} />
              <meshBasicMaterial color={project.color} transparent opacity={0.3} />
            </mesh>
          ))}
        </group>

        {/* Vertical energy column */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 8, 1, true]} />
          <meshBasicMaterial color={project.color} transparent opacity={0.15 * intensity} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.9, 8, 1, true]} />
          <meshBasicMaterial color={project.glowColor ?? project.color} transparent opacity={0.08 * intensity} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </BaseNode>
  );
}

export default CrystalNode;
