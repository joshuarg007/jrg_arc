// apps/web/src/components/nodes/HydraNode.tsx
// Vesper Hydra - Two-headed AI pentesting serpent with matrix/terminal aesthetics
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

interface HydraNodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

// Matrix-style colors
const matrixColors = [
  '#00ff00', // Classic matrix green
  '#00ff88', // Teal green
  '#00ffaa', // Cyan green
  '#88ff00', // Yellow green
  '#00cc00', // Darker green
];

// Data stream particle
interface DataParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  color: string;
  active: boolean;
}

export function HydraNode({ project, isActive, isHovered, onClick, onHover }: HydraNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const head1Ref = useRef<THREE.Group>(null);
  const head2Ref = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Mesh>(null);

  const isMobile = useIsMobile();
  const particleCount = isMobile ? 20 : 40;
  const bodySegments = isMobile ? 8 : 12;

  // Particle pool
  const particles = useRef<DataParticle[]>([]);
  if (particles.current.length === 0) {
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 2,
        color: matrixColors[0] ?? '#00ff00',
        active: false,
      });
    }
  }

  // Generate body curve (serpentine S-shape)
  const bodyCurve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = Math.sin(t * Math.PI * 2) * 0.15;
      const y = -0.4 + t * 0.6;
      const z = Math.cos(t * Math.PI) * 0.1;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Body geometry (tube following curve)
  const bodyGeometry = useMemo(() => {
    return new THREE.TubeGeometry(bodyCurve, bodySegments, 0.08, 8, false);
  }, [bodyCurve, bodySegments]);

  // Hexagonal shield geometry for heads
  const shieldGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const sides = 6;
    const radius = 0.12;
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    return new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: false });
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Main group rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }

    // Head 1 - Hunt agent (left, aggressive scanning)
    if (head1Ref.current) {
      head1Ref.current.rotation.x = Math.sin(t * 2) * 0.15;
      head1Ref.current.rotation.z = Math.sin(t * 1.5) * 0.1 - 0.2;
      head1Ref.current.position.y = 0.35 + Math.sin(t * 3) * 0.02;
    }

    // Head 2 - Advise agent (right, analytical movement)
    if (head2Ref.current) {
      head2Ref.current.rotation.x = Math.sin(t * 2 + Math.PI) * 0.12;
      head2Ref.current.rotation.z = Math.sin(t * 1.5 + Math.PI / 2) * 0.1 + 0.2;
      head2Ref.current.position.y = 0.35 + Math.sin(t * 3 + Math.PI) * 0.02;
    }

    // Scan line animation
    if (scanLineRef.current) {
      scanLineRef.current.position.y = Math.sin(t * 4) * 0.3;
      (scanLineRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.3 + Math.sin(t * 8) * 0.2;
    }

    // Update particles (matrix rain effect around body)
    if (particlesRef.current && Math.random() < 0.3) {
      for (const particle of particles.current) {
        if (!particle.active) {
          // Spawn new particle
          const angle = Math.random() * Math.PI * 2;
          const radius = 0.2 + Math.random() * 0.1;
          particle.position.set(
            Math.cos(angle) * radius,
            0.3 + Math.random() * 0.2,
            Math.sin(angle) * radius
          );
          particle.velocity.set(
            (Math.random() - 0.5) * 0.1,
            -0.5 - Math.random() * 0.3,
            (Math.random() - 0.5) * 0.1
          );
          particle.life = 0;
          particle.maxLife = 1 + Math.random();
          particle.color = matrixColors[Math.floor(Math.random() * matrixColors.length)] ?? '#00ff00';
          particle.active = true;
          break;
        }
      }
    }

    // Update particle positions
    for (let i = 0; i < particles.current.length; i++) {
      const particle = particles.current[i];
      if (!particle) continue;
      if (particle.active) {
        particle.life += delta;
        if (particle.life >= particle.maxLife) {
          particle.active = false;
        } else {
          particle.position.add(particle.velocity.clone().multiplyScalar(delta));
        }
      }

      // Update mesh
      if (particlesRef.current && particlesRef.current.children[i]) {
        const mesh = particlesRef.current.children[i] as THREE.Mesh;
        mesh.visible = particle.active;
        if (particle.active) {
          mesh.position.copy(particle.position);
          const opacity = 1 - (particle.life / particle.maxLife);
          (mesh.material as THREE.MeshBasicMaterial).opacity = opacity * 0.8;
          (mesh.material as THREE.MeshBasicMaterial).color.set(particle.color);
        }
      }
    }
  });

  const intensity = isHovered ? 1.4 : isActive ? 1.7 : 1;
  const primaryColor = project.color || '#00ff00';
  const glowColor = project.glowColor || '#00ff88';

  return (
    <BaseNode
      project={project}
      isActive={isActive}
      isHovered={isHovered}
      onClick={onClick}
      onHover={onHover}
    >
      <group ref={groupRef}>
        {/* Central body - serpentine form with circuit patterns */}
        <mesh geometry={bodyGeometry}>
          <meshStandardMaterial
            color="#1a1a2e"
            emissive={primaryColor}
            emissiveIntensity={0.2 * intensity}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Body wireframe - circuit board effect */}
        <mesh geometry={bodyGeometry} scale={1.01}>
          <meshBasicMaterial
            color={primaryColor}
            wireframe
            transparent
            opacity={0.4 * intensity}
          />
        </mesh>

        {/* Body inner glow */}
        <mesh geometry={bodyGeometry} scale={0.95}>
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.15 * intensity}
          />
        </mesh>

        {/* HEAD 1 - Hunt Agent (Left) */}
        <group ref={head1Ref} position={[-0.12, 0.35, 0.1]}>
          {/* Serpent head shape */}
          <mesh>
            <coneGeometry args={[0.1, 0.18, 6]} />
            <meshStandardMaterial
              color="#1a1a2e"
              emissive="#ff0044"
              emissiveIntensity={0.3 * intensity}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Eye - scanning laser */}
          <mesh position={[0.04, 0.02, 0.08]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#ff0000" />
          </mesh>
          <mesh position={[0.04, 0.02, 0.08]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ff0000" transparent opacity={0.3 * intensity} />
          </mesh>

          {/* Hexagonal shield/visor */}
          <mesh geometry={shieldGeometry} position={[0, 0.05, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial
              color="#ff0044"
              transparent
              opacity={0.2 * intensity}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Hunt label ring */}
          <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.08, 0.008, 8, 16]} />
            <meshBasicMaterial color="#ff0044" transparent opacity={0.6 * intensity} />
          </mesh>
        </group>

        {/* HEAD 2 - Advise Agent (Right) */}
        <group ref={head2Ref} position={[0.12, 0.35, 0.1]}>
          {/* Serpent head shape */}
          <mesh>
            <coneGeometry args={[0.1, 0.18, 6]} />
            <meshStandardMaterial
              color="#1a1a2e"
              emissive="#00ffff"
              emissiveIntensity={0.3 * intensity}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Eye - analytical scanner */}
          <mesh position={[-0.04, 0.02, 0.08]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <mesh position={[-0.04, 0.02, 0.08]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.3 * intensity} />
          </mesh>

          {/* Hexagonal shield/visor */}
          <mesh geometry={shieldGeometry} position={[0, 0.05, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial
              color="#00ffff"
              transparent
              opacity={0.2 * intensity}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Advise label ring */}
          <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.08, 0.008, 8, 16]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.6 * intensity} />
          </mesh>
        </group>

        {/* Central scan line */}
        <mesh ref={scanLineRef} position={[0, 0, 0]}>
          <planeGeometry args={[0.5, 0.01]} />
          <meshBasicMaterial
            color={primaryColor}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Outer orbital ring - represents the attack surface */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.008, 8, 32]} />
          <meshBasicMaterial
            color={primaryColor}
            transparent
            opacity={0.4 * intensity}
          />
        </mesh>

        {/* Secondary ring - tilted */}
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[0.32, 0.006, 8, 32]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.25 * intensity}
          />
        </mesh>

        {/* Matrix rain particles */}
        <group ref={particlesRef}>
          {Array.from({ length: particleCount }).map((_, i) => (
            <mesh key={`particle-${i}`} visible={false}>
              <boxGeometry args={[0.008, 0.025, 0.008]} />
              <meshBasicMaterial color="#00ff00" transparent opacity={0.8} />
            </mesh>
          ))}
        </group>

        {/* Base platform - hexagonal terminal */}
        <mesh position={[0, -0.45, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.05, 6]} />
          <meshStandardMaterial
            color="#0a0a15"
            emissive={primaryColor}
            emissiveIntensity={0.1 * intensity}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>

        {/* Platform glow ring */}
        <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.01, 8, 6]} />
          <meshBasicMaterial
            color={primaryColor}
            transparent
            opacity={0.6 * intensity}
          />
        </mesh>

        {/* Outer glow sphere */}
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial
            color={primaryColor}
            transparent
            opacity={0.03 * intensity}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </BaseNode>
  );
}

export default HydraNode;
