// apps/web/src/components/nodes/FunnelNode.tsx
// SLMS - Lead funnel with flowing particles and chain lightning effects
// PERFORMANCE OPTIMIZED: useRef instead of useState, pooled lightning, reduced allocations
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BaseNode } from './BaseNode';
import type { ProjectNode } from '@core/types/project';

interface FunnelNodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

// Electric color palette - vibrant and varied
const electricColors = [
  '#00ffff', // Cyan
  '#ff00ff', // Magenta
  '#ffff00', // Yellow
  '#00ff00', // Green
  '#ff6600', // Orange
  '#ff0066', // Hot pink
  '#6600ff', // Purple
  '#00ffcc', // Teal
  '#ff3399', // Pink
  '#99ff00', // Lime
  '#ffffff', // White
  '#66ffff', // Light cyan
  '#ff99ff', // Light magenta
  '#ffcc00', // Gold
];

// Simplified lightning bolt for performance (no recursion in render)
interface LightningBolt {
  points: Float32Array; // Pre-allocated array
  pointCount: number;
  opacity: number;
  color: string;
  thickness: number;
  active: boolean;
}

// Maximum bolts in pool
const MAX_BOLTS = 20;
const MAX_POINTS_PER_BOLT = 12;

// Reusable vectors to avoid allocations
const _tempStart = new THREE.Vector3();
const _tempEnd = new THREE.Vector3();
const _tempDir = new THREE.Vector3();
const _tempPerp1 = new THREE.Vector3();
const _tempPerp2 = new THREE.Vector3();
const _tempPoint = new THREE.Vector3();

// Generate lightning path directly into pre-allocated Float32Array
function generateLightningPathIntoArray(
  start: THREE.Vector3,
  end: THREE.Vector3,
  outArray: Float32Array,
  segments: number = 8,
  jitter: number = 0.15
): number {
  _tempDir.copy(end).sub(start);
  const length = _tempDir.length();
  _tempDir.normalize();

  // Create perpendicular vectors for jitter
  _tempPerp1.set(-_tempDir.y, _tempDir.x, _tempDir.z * 0.5).normalize();
  _tempPerp2.copy(_tempDir).cross(_tempPerp1).normalize();

  // Start point
  outArray[0] = start.x;
  outArray[1] = start.y;
  outArray[2] = start.z;

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const jitterAmount = jitter * Math.sin(t * Math.PI);
    const jx = (Math.random() - 0.5) * jitterAmount * 2;
    const jy = (Math.random() - 0.5) * jitterAmount * 2;

    const idx = i * 3;
    outArray[idx] = start.x + _tempDir.x * length * t + _tempPerp1.x * jx + _tempPerp2.x * jy;
    outArray[idx + 1] = start.y + _tempDir.y * length * t + _tempPerp1.y * jx + _tempPerp2.y * jy;
    outArray[idx + 2] = start.z + _tempDir.z * length * t + _tempPerp1.z * jx + _tempPerp2.z * jy;
  }

  // End point
  const endIdx = segments * 3;
  outArray[endIdx] = end.x;
  outArray[endIdx + 1] = end.y;
  outArray[endIdx + 2] = end.z;

  return segments + 1; // Return point count
}

// Create a new bolt in the pool
function activateBolt(
  bolt: LightningBolt,
  vertices: THREE.Vector3[]
): void {
  const startIdx = Math.floor(Math.random() * vertices.length);
  let endIdx = Math.floor(Math.random() * vertices.length);
  if (endIdx === startIdx) endIdx = (endIdx + 1) % vertices.length;

  const startVertex = vertices[startIdx];
  const endVertex = vertices[endIdx];
  if (!startVertex) return;

  _tempStart.copy(startVertex);

  // 70% chance to end at another vertex, 30% random point
  if (Math.random() > 0.3 && endVertex) {
    _tempEnd.copy(endVertex);
  } else {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.2 + Math.random() * 0.4;
    const height = (Math.random() - 0.5) * 1.2;
    _tempEnd.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
  }

  const segments = 6 + Math.floor(Math.random() * 4);
  bolt.pointCount = generateLightningPathIntoArray(_tempStart, _tempEnd, bolt.points, segments);
  bolt.opacity = 0.9;
  bolt.color = electricColors[Math.floor(Math.random() * electricColors.length)] ?? '#00ff88';
  bolt.thickness = 0.7 + Math.random() * 0.5;
  bolt.active = true;
}

export function FunnelNode({ project, isActive, isHovered, onClick, onHover }: FunnelNodeProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const lightningLinesRef = useRef<THREE.Group>(null);
  const frameCountRef = useRef(0);

  // Pre-allocated lightning bolt pool (no useState = no re-renders!)
  const lightningPool = useRef<LightningBolt[]>([]);
  if (lightningPool.current.length === 0) {
    for (let i = 0; i < MAX_BOLTS; i++) {
      lightningPool.current.push({
        points: new Float32Array(MAX_POINTS_PER_BOLT * 3),
        pointCount: 0,
        opacity: 0,
        color: '#ffffff',
        thickness: 1,
        active: false,
      });
    }
  }

  // Create funnel shape using lathe geometry
  const funnelGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      const radius = 0.1 + (1 - t) * 0.5;
      const y = t * 1.2 - 0.6;
      points.push(new THREE.Vector2(radius, y));
    }
    return new THREE.LatheGeometry(points, 32);
  }, []);

  // Get vertices from the funnel for lightning anchor points
  const funnelVertices = useMemo(() => {
    const vertices: THREE.Vector3[] = [];
    const positions = funnelGeometry.attributes.position;
    if (!positions) return vertices;
    // Sample vertices more densely
    for (let i = 0; i < positions.count; i += 2) {
      vertices.push(new THREE.Vector3(
        positions.getX(i),
        positions.getY(i),
        positions.getZ(i)
      ));
    }
    return vertices;
  }, [funnelGeometry]);

  // Particle system for flowing leads
  const particleCount = 50;
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const t = Math.random();
      const radius = 0.1 + (1 - t) * 0.4;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = t * 1.2 - 0.6;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      speeds[i] = 0.3 + Math.random() * 0.5;
    }

    return { positions, speeds };
  }, []);

  // Lightning timing
  const lastLightningTime = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    frameCountRef.current++;

    // Particle animation
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      if (posAttr) {
        const positions = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const currentY = positions[i * 3 + 1] ?? 0;
          positions[i * 3 + 1] = currentY - delta * (particleData.speeds[i] ?? 0.5);

          if ((positions[i * 3 + 1] ?? 0) < -0.6) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.4 + Math.random() * 0.1;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = 0.6;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
          }
        }

        posAttr.needsUpdate = true;
      }
    }

    // Lightning generation and update (every ~0.1s spawn new bolts)
    if (t - lastLightningTime.current > 0.1) {
      lastLightningTime.current = t;

      // Spawn 2-4 new bolts
      const numToSpawn = 2 + Math.floor(Math.random() * 3);
      let spawned = 0;

      for (const bolt of lightningPool.current) {
        if (!bolt.active && spawned < numToSpawn) {
          activateBolt(bolt, funnelVertices);
          spawned++;
        }
      }
    }

    // Fade and update all bolts
    const fadeSpeed = delta * 4;
    for (const bolt of lightningPool.current) {
      if (bolt.active) {
        bolt.opacity -= fadeSpeed;
        if (bolt.opacity <= 0) {
          bolt.active = false;
          bolt.opacity = 0;
        }
      }
    }

    // Update line geometries directly
    if (lightningLinesRef.current) {
      const children = lightningLinesRef.current.children;
      for (let i = 0; i < MAX_BOLTS; i++) {
        const bolt = lightningPool.current[i];
        if (!bolt) continue;
        const lineGroup = children[i] as THREE.Group;
        if (lineGroup) {
          lineGroup.visible = bolt.active;
          if (bolt.active) {
            // Update main line
            const mainLine = lineGroup.children[0] as THREE.Line;
            if (mainLine?.geometry) {
              const posAttr = mainLine.geometry.attributes.position as THREE.BufferAttribute;
              posAttr.set(bolt.points.subarray(0, bolt.pointCount * 3));
              posAttr.needsUpdate = true;
              (mainLine.material as THREE.LineBasicMaterial).opacity = bolt.opacity;
              (mainLine.material as THREE.LineBasicMaterial).color.set(bolt.color);
            }
            // Update glow line
            const glowLine = lineGroup.children[1] as THREE.Line;
            if (glowLine?.geometry) {
              const posAttr = glowLine.geometry.attributes.position as THREE.BufferAttribute;
              posAttr.set(bolt.points.subarray(0, bolt.pointCount * 3));
              posAttr.needsUpdate = true;
              (glowLine.material as THREE.LineBasicMaterial).opacity = bolt.opacity * 0.4;
              (glowLine.material as THREE.LineBasicMaterial).color.set(bolt.color);
            }
          }
        }
      }
    }
  });

  const intensity = isHovered ? 1.2 : isActive ? 1.5 : 1;

  return (
    <BaseNode
      project={project}
      isActive={isActive}
      isHovered={isHovered}
      onClick={onClick}
      onHover={onHover}
    >
      {/* Funnel mesh */}
      <mesh geometry={funnelGeometry}>
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={0.2 * intensity}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={funnelGeometry}>
        <meshBasicMaterial
          color={project.glowColor ?? project.color}
          wireframe
          transparent
          opacity={0.25 * intensity}
        />
      </mesh>

      {/* Pre-allocated Lightning bolt pool */}
      <group ref={lightningLinesRef}>
        {Array.from({ length: MAX_BOLTS }).map((_, i) => (
          <group key={`bolt-${i}`} visible={false}>
            {/* Main line */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={MAX_POINTS_PER_BOLT}
                  array={new Float32Array(MAX_POINTS_PER_BOLT * 3)}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffffff" transparent opacity={0} />
            </line>
            {/* Glow line */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={MAX_POINTS_PER_BOLT}
                  array={new Float32Array(MAX_POINTS_PER_BOLT * 3)}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffffff" transparent opacity={0} />
            </line>
          </group>
        ))}
      </group>

      {/* Ambient electric sparks around funnel - multiple rings */}
      {[0.55, 0.35, 0.2].map((yPos, ringIdx) => (
        Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2 + ringIdx * 0.3;
          const radius = 0.55 - ringIdx * 0.15;
          const color = electricColors[(i + ringIdx * 4) % electricColors.length];
          return (
            <mesh
              key={`spark-${ringIdx}-${i}`}
              position={[
                Math.cos(angle) * radius,
                yPos,
                Math.sin(angle) * radius,
              ]}
            >
              <sphereGeometry args={[0.01, 6, 6]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.7 * intensity}
              />
            </mesh>
          );
        })
      ))}

      {/* Flowing particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particleData.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={project.glowColor ?? project.color}
          size={0.04}
          transparent
          opacity={0.8 * intensity}
          sizeAttenuation
        />
      </points>

      {/* Bottom glow - pulsing */}
      <mesh position={[0, -0.7, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color={project.glowColor ?? project.color}
          transparent
          opacity={0.7 * intensity}
        />
      </mesh>

      {/* Electric aura rings at multiple heights */}
      {[0.6, 0.3, 0, -0.3].map((y, i) => (
        <mesh key={`ring-${i}`} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5 - i * 0.1, 0.55 - i * 0.1, 32]} />
          <meshBasicMaterial
            color={electricColors[i * 3]}
            transparent
            opacity={0.15 * intensity}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </BaseNode>
  );
}

export default FunnelNode;
