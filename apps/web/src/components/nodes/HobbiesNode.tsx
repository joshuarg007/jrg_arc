// apps/web/src/components/nodes/HobbiesNode.tsx
// Hobbies exhibit - simplified chess pieces and poker suits around a dumbbell
// REFINED: Simple polygons, tighter cluster, smaller items, lowered position
import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BaseNode } from './BaseNode';
import type { ProjectNode } from '@core/types/project';

interface HobbiesNodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

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

// Vibrant color palette
const rainbowColors = [
  '#ff0066', '#ff3366', '#ff6633', '#ffcc00',
  '#99ff00', '#00ff66', '#00ffcc', '#00ccff',
  '#6666ff', '#9933ff', '#ff33cc', '#ff0099',
];

// Suit colors (no club - too complex)
const suitColors = {
  heart: '#ff1a4d',
  diamond: '#ff6b1a',
  spade: '#8c4dff',
};

// Particle counts - OPTIMIZED (reduced further on mobile)
const PARTICLE_COUNT_DESKTOP = 40;
const PARTICLE_COUNT_MOBILE = 15;
const SPARKLE_COUNT_DESKTOP = 12;
const SPARKLE_COUNT_MOBILE = 5;

// No Y_OFFSET - position is controlled in projects.ts

// Scale multiplier for tighter clustering
const CLUSTER_SCALE = 0.65;

// Simple orbit item
interface OrbitItem {
  type: 'chess' | 'suit' | 'card';
  geometryType: 'cone' | 'cylinder' | 'box' | 'sphere' | 'octahedron';
  color: string;
  glowColor: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  heightOffset: number;
  rotationSpeed: number;
  scale: [number, number, number];
  pulseSpeed: number;
  pulsePhase: number;
}

export function HobbiesNode({ project, isActive, isHovered, onClick, onHover }: HobbiesNodeProps) {
  const dumbbellRef = useRef<THREE.Group>(null);
  const itemRefs = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points>(null);
  const sparklesRef = useRef<THREE.Points>(null);

  // Mobile detection for performance optimization
  const isMobile = useIsMobile();
  const particleCount = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
  const sparkleCount = isMobile ? SPARKLE_COUNT_MOBILE : SPARKLE_COUNT_DESKTOP;
  const geometrySegments = isMobile ? 8 : 12;

  // Simple geometries - LARGER & more visible (reduced segments on mobile)
  const geometries = useMemo(() => ({
    cone: new THREE.ConeGeometry(0.08, 0.22, geometrySegments),
    cylinder: new THREE.CylinderGeometry(0.06, 0.075, 0.18, geometrySegments),
    box: new THREE.BoxGeometry(0.1, 0.14, 0.02),
    sphere: new THREE.SphereGeometry(0.075, geometrySegments, geometrySegments),
    octahedron: new THREE.OctahedronGeometry(0.1),
    // Dumbbell parts
    bar: new THREE.CylinderGeometry(0.02, 0.02, 0.38, geometrySegments),
    weight: new THREE.CylinderGeometry(0.09, 0.09, 0.05, isMobile ? 12 : 16),
  }), [geometrySegments, isMobile]);

  // Particle data - tighter radius (mobile-optimized count)
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (0.2 + Math.random() * 0.55) * CLUSTER_SCALE;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.35;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const color = new THREE.Color(rainbowColors[Math.floor(Math.random() * rainbowColors.length)]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      speeds[i] = 0.25 + Math.random() * 0.4;
      phases[i] = Math.random() * Math.PI * 2;
      radii[i] = radius;
    }
    return { positions, colors, speeds, phases, radii };
  }, [particleCount]);

  // Sparkle data - tighter (mobile-optimized count)
  const sparkleData = useMemo(() => {
    const positions = new Float32Array(sparkleCount * 3);
    const colors = new Float32Array(sparkleCount * 3);
    const basePos = new Float32Array(sparkleCount * 3);

    const suitColorArr = [suitColors.heart, suitColors.diamond, suitColors.spade];
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i / sparkleCount) * Math.PI * 2;
      const radius = (0.25 + Math.random() * 0.45) * CLUSTER_SCALE;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 0.3;
      const z = Math.sin(angle) * radius;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      basePos[i * 3] = x;
      basePos[i * 3 + 1] = y;
      basePos[i * 3 + 2] = z;

      const color = new THREE.Color(suitColorArr[i % 3]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors, basePos };
  }, [sparkleCount]);

  // Orbit items - BIGGER & more visible
  const orbitItems = useMemo<OrbitItem[]>(() => {
    const items: OrbitItem[] = [];
    const s = 1.1; // scale factor for items - LARGER

    // Chess pieces - inner orbit (tighter)
    items.push({
      type: 'chess', geometryType: 'cone',
      color: '#f0f0f0', glowColor: '#ffffff',
      orbitRadius: 0.28, orbitSpeed: 0.4, orbitOffset: 0,
      heightOffset: 0, rotationSpeed: 0.6, scale: [0.9 * s, 1.1 * s, 0.9 * s],
      pulseSpeed: 1.5, pulsePhase: 0,
    });
    items.push({
      type: 'chess', geometryType: 'sphere',
      color: '#1a1a1a', glowColor: '#6666ff',
      orbitRadius: 0.32, orbitSpeed: 0.36, orbitOffset: Math.PI / 3,
      heightOffset: 0.03, rotationSpeed: 0.5, scale: [1 * s, 1 * s, 1 * s],
      pulseSpeed: 1.6, pulsePhase: 1,
    });
    items.push({
      type: 'chess', geometryType: 'cylinder',
      color: '#e8e8e8', glowColor: '#ffffff',
      orbitRadius: 0.28, orbitSpeed: 0.42, orbitOffset: Math.PI * 2 / 3,
      heightOffset: -0.01, rotationSpeed: 0.4, scale: [0.8 * s, 0.95 * s, 0.8 * s],
      pulseSpeed: 1.4, pulsePhase: 2,
    });
    items.push({
      type: 'chess', geometryType: 'octahedron',
      color: '#2a2a2a', glowColor: '#8844ff',
      orbitRadius: 0.32, orbitSpeed: 0.38, orbitOffset: Math.PI,
      heightOffset: 0.02, rotationSpeed: 0.7, scale: [0.65 * s, 0.8 * s, 0.65 * s],
      pulseSpeed: 1.7, pulsePhase: 3,
    });
    items.push({
      type: 'chess', geometryType: 'cone',
      color: '#f5f5f5', glowColor: '#ffffff',
      orbitRadius: 0.28, orbitSpeed: 0.37, orbitOffset: Math.PI * 4 / 3,
      heightOffset: 0, rotationSpeed: 0.55, scale: [0.65 * s, 1.05 * s, 0.65 * s],
      pulseSpeed: 1.5, pulsePhase: 4,
    });
    items.push({
      type: 'chess', geometryType: 'sphere',
      color: '#333333', glowColor: '#6666ff',
      orbitRadius: 0.32, orbitSpeed: 0.44, orbitOffset: Math.PI * 5 / 3,
      heightOffset: -0.02, rotationSpeed: 0.5, scale: [0.55 * s, 0.55 * s, 0.55 * s],
      pulseSpeed: 1.8, pulsePhase: 5,
    });

    // Poker suits - middle orbit (tighter)
    items.push({
      type: 'suit', geometryType: 'octahedron',
      color: suitColors.heart, glowColor: suitColors.heart,
      orbitRadius: 0.48, orbitSpeed: -0.5, orbitOffset: 0,
      heightOffset: 0.05, rotationSpeed: -0.5, scale: [0.85 * s, 1 * s, 0.45 * s],
      pulseSpeed: 2, pulsePhase: 0,
    });
    items.push({
      type: 'suit', geometryType: 'octahedron',
      color: suitColors.diamond, glowColor: suitColors.diamond,
      orbitRadius: 0.52, orbitSpeed: -0.46, orbitOffset: Math.PI * 2 / 3,
      heightOffset: -0.03, rotationSpeed: -0.6, scale: [0.6 * s, 1.1 * s, 0.6 * s],
      pulseSpeed: 2.1, pulsePhase: 1.5,
    });
    items.push({
      type: 'suit', geometryType: 'cone',
      color: suitColors.spade, glowColor: suitColors.spade,
      orbitRadius: 0.48, orbitSpeed: -0.52, orbitOffset: Math.PI * 4 / 3,
      heightOffset: 0, rotationSpeed: -0.4, scale: [0.75 * s, -0.95 * s, 0.75 * s],
      pulseSpeed: 1.9, pulsePhase: 3,
    });

    // Cards - outer orbit (tighter)
    const cardColors = ['#ff4444', '#222222', '#ff8800', '#0088ff', '#ff00ff'];
    for (let i = 0; i < 5; i++) {
      const cardColor = cardColors[i] ?? '#ff4444';
      items.push({
        type: 'card', geometryType: 'box',
        color: cardColor, glowColor: cardColor,
        orbitRadius: 0.62 + (i % 2) * 0.05,
        orbitSpeed: 0.55 + i * 0.04,
        orbitOffset: (i / 5) * Math.PI * 2,
        heightOffset: (i % 3 - 1) * 0.06,
        rotationSpeed: 0.8, scale: [0.75 * s, 0.75 * s, 0.75 * s],
        pulseSpeed: 1.8 + i * 0.1, pulsePhase: i,
      });
    }

    return items;
  }, []);

  // Animation - OPTIMIZED (no mouse tracking, simplified calculations)
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Dumbbell rotation
    if (dumbbellRef.current) {
      dumbbellRef.current.rotation.z = Math.sin(t * 0.5) * 0.15;
      dumbbellRef.current.rotation.y = t * 0.25;
    }

    // Orbit items - simplified
    itemRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const item = orbitItems[i];
      if (!item) return;

      const angle = t * item.orbitSpeed + item.orbitOffset;
      mesh.position.x = Math.cos(angle) * item.orbitRadius;
      mesh.position.z = Math.sin(angle) * item.orbitRadius;
      mesh.position.y = item.heightOffset + Math.sin(t * 2 + i) * 0.02;
      mesh.rotation.y += delta * item.rotationSpeed;
    });

    // Particles - just rotate the group
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.15;
    }

    // Sparkles - just rotate
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y = -t * 0.1;
    }
  });

  const intensity = isHovered ? 1.3 : isActive ? 1.6 : 1;

  return (
    <BaseNode project={project} isActive={isActive} isHovered={isHovered} onClick={onClick} onHover={onHover}>
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={particleData.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={particleCount} array={particleData.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.012} vertexColors transparent opacity={0.7 * intensity} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>

      {/* Sparkles */}
      <points ref={sparklesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={sparkleCount} array={sparkleData.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={sparkleCount} array={sparkleData.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.022} vertexColors transparent opacity={0.55} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>

      {/* Dumbbell */}
      <group ref={dumbbellRef}>
        <mesh geometry={geometries.bar} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#777777" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh geometry={geometries.weight} position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={0.35 * intensity} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.18, 0, 0]}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshBasicMaterial color={project.color} transparent opacity={0.1 * intensity} />
        </mesh>
        <mesh geometry={geometries.weight} position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={0.35 * intensity} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.18, 0, 0]}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshBasicMaterial color={project.color} transparent opacity={0.1 * intensity} />
        </mesh>
      </group>

      {/* Orbiting items - MORE VISIBLE */}
      {orbitItems.map((item, i) => (
        <group key={i}>
          <mesh ref={(el: THREE.Mesh | null) => { if (el) itemRefs.current[i] = el; }} geometry={geometries[item.geometryType]} scale={item.scale}>
            <meshStandardMaterial
              color={item.color}
              emissive={item.glowColor}
              emissiveIntensity={0.6 * intensity}
              metalness={item.type === 'chess' ? 0.4 : 0.6}
              roughness={item.type === 'chess' ? 0.4 : 0.3}
            />
          </mesh>
          {/* Glow halo around each shape */}
          <mesh position={itemRefs.current[i]?.position || [0, 0, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial
              color={item.glowColor}
              transparent
              opacity={0.15 * intensity}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}

      {/* Multiple orbit rings for visual depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.32, 0.34, 32]} />
        <meshBasicMaterial color={suitColors.heart} transparent opacity={0.2 * intensity} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.50, 0.52, 32]} />
        <meshBasicMaterial color={suitColors.diamond} transparent opacity={0.18 * intensity} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.68, 0.70, 32]} />
        <meshBasicMaterial color={suitColors.spade} transparent opacity={0.15 * intensity} side={THREE.DoubleSide} />
      </mesh>

      {/* Central glow - LARGER */}
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color={project.glowColor ?? project.color} transparent opacity={0.15 * intensity} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Removed diamond sparkles for performance */}
    </BaseNode>
  );
}

export default HobbiesNode;
