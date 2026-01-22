// apps/web/src/components/nodes/NeuralNode.tsx
// AI/ML - Brain-shaped neural network with synaptic impulses
// PERFORMANCE OPTIMIZED: useRef instead of useState, pooled impulses, reduced allocations
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

interface NeuralNodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

// Neural impulse colors - brain activity spectrum
const impulseColors = [
  '#00ffff', // Cyan - fast signals
  '#ff00ff', // Magenta - emotional processing
  '#ffff00', // Yellow - memory recall
  '#00ff88', // Green - learning
  '#ff6600', // Orange - motor signals
  '#ff0066', // Pink - sensory input
  '#8800ff', // Purple - deep thought
  '#ffffff', // White - peak activity
  '#00ccff', // Light blue - calm processing
  '#ff3399', // Hot pink - creativity
];

interface Neuron {
  position: THREE.Vector3;
  connections: number[];
  activity: number;
  type: 'cortex' | 'deep' | 'stem';
}

interface SynapticImpulse {
  fromNeuron: number;
  toNeuron: number;
  progress: number;
  speed: number;
  color: string;
  strength: number;
  active: boolean;
}

// Pool size for impulses - OPTIMIZED (reduced on mobile)
const MAX_IMPULSES_DESKTOP = 15;
const MAX_IMPULSES_MOBILE = 8;
const CORTEX_NEURONS_DESKTOP = 25;
const CORTEX_NEURONS_MOBILE = 12;
const DEEP_NEURONS_DESKTOP = 10;
const DEEP_NEURONS_MOBILE = 5;
const STEM_NEURONS_DESKTOP = 5;
const STEM_NEURONS_MOBILE = 3;

// Generate point inside brain shape
function getBrainPoint(u: number, v: number, hemisphere: 'left' | 'right'): THREE.Vector3 {
  // Brain-like parametric shape
  const theta = u * Math.PI;
  const phi = v * Math.PI * 2;

  // Base ellipsoid
  let x = 0.35 * Math.sin(theta) * Math.cos(phi);
  let y = 0.28 * Math.sin(theta) * Math.sin(phi);
  let z = 0.4 * Math.cos(theta);

  // Add brain-like bulges and folds
  const bulgeFactor = 0.08 * Math.sin(theta * 3) * Math.cos(phi * 2);
  x += bulgeFactor;
  y += bulgeFactor * 0.5;

  // Hemisphere offset
  if (hemisphere === 'left') {
    x -= 0.08;
  } else {
    x += 0.08;
  }

  // Frontal lobe bulge
  if (z > 0.1) {
    const frontalBulge = 0.05 * Math.pow(Math.cos(theta), 2);
    z += frontalBulge;
  }

  return new THREE.Vector3(x, y, z);
}

// Check if point is inside brain volume
function isInsideBrain(point: THREE.Vector3): boolean {
  const x = point.x;
  const y = point.y;
  const z = point.z;

  // Ellipsoid check with brain proportions
  const normalized = (x * x) / (0.45 * 0.45) + (y * y) / (0.35 * 0.35) + (z * z) / (0.45 * 0.45);
  return normalized < 1;
}

export function NeuralNode({ project, isActive, isHovered, onClick, onHover }: NeuralNodeProps) {
  const brainRef = useRef<THREE.Group>(null);
  const impulsesGroupRef = useRef<THREE.Group>(null);
  const lastImpulseTime = useRef(0);
  const neuronActivityRef = useRef<Float32Array | null>(null);

  // Mobile detection for performance optimization
  const isMobile = useIsMobile();
  const maxImpulses = isMobile ? MAX_IMPULSES_MOBILE : MAX_IMPULSES_DESKTOP;
  const cortexNeuronCount = isMobile ? CORTEX_NEURONS_MOBILE : CORTEX_NEURONS_DESKTOP;
  const deepNeuronCount = isMobile ? DEEP_NEURONS_MOBILE : DEEP_NEURONS_DESKTOP;
  const stemNeuronCount = isMobile ? STEM_NEURONS_MOBILE : STEM_NEURONS_DESKTOP;
  const brainSegments = isMobile ? 16 : 24;
  const brainRings = isMobile ? 12 : 18;

  // Pre-allocated impulse pool (no useState = no re-renders!)
  const impulsePool = useRef<SynapticImpulse[]>([]);
  if (impulsePool.current.length === 0) {
    for (let i = 0; i < MAX_IMPULSES_DESKTOP; i++) {
      impulsePool.current.push({
        fromNeuron: 0,
        toNeuron: 0,
        progress: 0,
        speed: 1,
        color: '#ffffff',
        strength: 1,
        active: false,
      });
    }
  }

  // Generate neurons distributed in brain shape (mobile-optimized counts)
  const neurons = useMemo(() => {
    const nodes: Neuron[] = [];

    // Cortex neurons (outer layer) - OPTIMIZED
    for (let i = 0; i < cortexNeuronCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const hemisphere = Math.random() > 0.5 ? 'left' : 'right';
      const surfacePoint = getBrainPoint(u, v, hemisphere);

      // Slightly inside the surface
      const depth = 0.85 + Math.random() * 0.15;
      const pos = surfacePoint.multiplyScalar(depth);

      nodes.push({
        position: pos,
        connections: [],
        activity: Math.random(),
        type: 'cortex',
      });
    }

    // Deep brain neurons (inner structures) - OPTIMIZED
    for (let i = 0; i < deepNeuronCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.5
      );

      if (isInsideBrain(pos)) {
        nodes.push({
          position: pos.multiplyScalar(0.6),
          connections: [],
          activity: Math.random(),
          type: 'deep',
        });
      }
    }

    // Brain stem neurons - OPTIMIZED
    for (let i = 0; i < stemNeuronCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.05 + Math.random() * 0.08;
      const pos = new THREE.Vector3(
        Math.cos(angle) * radius,
        -0.35 - Math.random() * 0.15,
        Math.sin(angle) * radius
      );

      nodes.push({
        position: pos,
        connections: [],
        activity: Math.random(),
        type: 'stem',
      });
    }

    // Create connections between nearby neurons
    nodes.forEach((neuron, i) => {
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dist = neuron.position.distanceTo(other.position);
          // Connect if close enough (synaptic range)
          if (dist < 0.25 && neuron.connections.length < 6) {
            neuron.connections.push(j);
          }
        }
      });
    });

    return nodes;
  }, [cortexNeuronCount, deepNeuronCount, stemNeuronCount]);

  // Initialize activity array
  if (!neuronActivityRef.current) {
    neuronActivityRef.current = new Float32Array(neurons.length);
    neurons.forEach((_, i) => {
      neuronActivityRef.current![i] = Math.random();
    });
  }

  // Brain surface geometry - OPTIMIZED (reduced segments on mobile)
  const brainGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(0.5, brainSegments, brainRings);
    const positions = geometry.attributes.position;
    if (!positions) return geometry;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      // Base brain proportions (wider than tall, elongated front-back)
      let newX = x * 0.85;
      let newY = y * 0.65;
      let newZ = z * 1.0;

      // Deep central longitudinal fissure (separates hemispheres)
      const fissureDepth = 0.12 * Math.exp(-Math.pow(x / 0.08, 2)) * (y > -0.1 ? 1 : 0.3);
      newY -= fissureDepth;

      // Gyri and sulci (brain wrinkles) - multiple frequencies for realism
      const fold1 = 0.025 * Math.sin(y * 12 + x * 8) * Math.cos(z * 10);
      const fold2 = 0.015 * Math.sin(y * 18 + z * 15) * Math.cos(x * 12);
      const fold3 = 0.01 * Math.sin(x * 25) * Math.sin(z * 20);
      const foldTotal = fold1 + fold2 + fold3;

      // Apply folds radially
      const dist = Math.sqrt(newX * newX + newY * newY + newZ * newZ);
      if (dist > 0) {
        newX += (newX / dist) * foldTotal;
        newY += (newY / dist) * foldTotal * 0.5;
        newZ += (newZ / dist) * foldTotal;
      }

      // Frontal lobe (bulges forward)
      if (z > 0.15) {
        newZ += 0.08 * Math.pow(Math.cos((z - 0.15) * 2), 2);
        newY += 0.02 * (z - 0.15);
      }

      // Occipital lobe (back of brain, slightly pointed)
      if (z < -0.25) {
        newZ -= 0.05;
        newY -= 0.03 * Math.abs(z + 0.25);
      }

      // Temporal lobes (bulge out at sides, lower)
      if (Math.abs(x) > 0.25 && y < 0) {
        const temporalBulge = 0.08 * Math.exp(-Math.pow((y + 0.2) / 0.15, 2));
        newX += Math.sign(x) * temporalBulge;
        newY -= 0.03;
      }

      // Parietal region (top back, slightly raised)
      if (y > 0.2 && z < 0) {
        newY += 0.04;
      }

      // Lateral sulcus (Sylvian fissure) - diagonal groove on sides
      const sylvianX = Math.abs(x);
      const sylvianZ = z * 0.5 - y * 0.3;
      if (sylvianX > 0.2 && sylvianX < 0.4 && Math.abs(sylvianZ) < 0.15) {
        const groove = 0.02 * Math.exp(-Math.pow((sylvianX - 0.3) / 0.05, 2));
        newY -= groove;
      }

      positions.setXYZ(i, newX, newY, newZ);
    }

    geometry.computeVertexNormals();
    return geometry;
  }, [brainSegments, brainRings]);

  // Cerebellum geometry - OPTIMIZED (mobile-aware)
  const cerebellumSegments = isMobile ? 8 : 12;
  const cerebellumGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(0.18, cerebellumSegments, cerebellumSegments - 2);
    const positions = geometry.attributes.position;
    if (!positions) return geometry;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      // Flatten and widen
      let newX = x * 1.3;
      let newY = y * 0.6;
      let newZ = z * 0.9;

      // Cerebellum has fine parallel folds (folia)
      const folia = 0.015 * Math.sin(x * 30) * Math.cos(z * 5);
      newY += folia;

      // Central vermis (ridge down middle)
      if (Math.abs(x) < 0.05) {
        newY += 0.02;
      }

      positions.setXYZ(i, newX, newY, newZ);
    }

    geometry.computeVertexNormals();
    return geometry;
  }, [cerebellumSegments]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Gentle brain rotation
    if (brainRef.current) {
      brainRef.current.rotation.y += delta * 0.1;
      brainRef.current.position.y = Math.sin(t * 0.5) * 0.02;
    }

    // Update neuron activity (random fluctuations)
    if (neuronActivityRef.current) {
      for (let i = 0; i < neurons.length; i++) {
        const current = neuronActivityRef.current[i] ?? 0.5;
        neuronActivityRef.current[i] = Math.max(0, Math.min(1, current + (Math.random() - 0.5) * delta * 2));
      }
    }

    // Fire new impulses randomly (every ~0.15s) - OPTIMIZED
    if (t - lastImpulseTime.current > 0.15) {
      lastImpulseTime.current = t;

      // Fire 1-2 new impulses - OPTIMIZED
      const numFires = 1 + Math.floor(Math.random() * 2);
      let fired = 0;

      for (const impulse of impulsePool.current) {
        if (!impulse.active && fired < numFires) {
          // Pick random neuron to fire
          const fromIdx = Math.floor(Math.random() * neurons.length);
          const fromNeuron = neurons[fromIdx];
          if (!fromNeuron) continue;

          if (fromNeuron.connections.length > 0) {
            const toIdx = fromNeuron.connections[Math.floor(Math.random() * fromNeuron.connections.length)];
            impulse.fromNeuron = fromIdx;
            impulse.toNeuron = toIdx ?? 0;
            impulse.progress = 0;
            impulse.speed = 1.5 + Math.random() * 2;
            impulse.color = impulseColors[Math.floor(Math.random() * impulseColors.length)] ?? '#00ffff';
            impulse.strength = 0.5 + Math.random() * 0.5;
            impulse.active = true;
            fired++;
          }
        }
      }
    }

    // Update all impulses and the visual elements
    if (impulsesGroupRef.current) {
      const children = impulsesGroupRef.current.children;
      for (let i = 0; i < maxImpulses; i++) {
        const impulse = impulsePool.current[i];
        if (!impulse) continue;
        const group = children[i] as THREE.Group;

        if (impulse.active) {
          impulse.progress += delta * impulse.speed;
          if (impulse.progress >= 1) {
            impulse.active = false;
          }
        }

        if (group) {
          group.visible = impulse.active;
          if (impulse.active) {
            const fromNeuron = neurons[impulse.fromNeuron];
            const toNeuron = neurons[impulse.toNeuron];
            if (!fromNeuron || !toNeuron) continue;
            const from = fromNeuron.position;
            const to = toNeuron.position;
            const progress = impulse.progress;

            // Interpolate position
            const x = from.x + (to.x - from.x) * progress;
            const y = from.y + (to.y - from.y) * progress;
            const z = from.z + (to.z - from.z) * progress;

            // Update main sphere
            const mainMesh = group.children[0] as THREE.Mesh;
            const glowMesh = group.children[1] as THREE.Mesh;

            if (mainMesh) {
              mainMesh.position.set(x, y, z);
              (mainMesh.material as THREE.MeshBasicMaterial).color.set(impulse.color);
            }
            if (glowMesh) {
              glowMesh.position.set(x, y, z);
              (glowMesh.material as THREE.MeshBasicMaterial).color.set(impulse.color);
            }
          }
        }
      }
    }
  });

  const intensity = isHovered ? 1.4 : isActive ? 1.7 : 1;

  return (
    <BaseNode
      project={project}
      isActive={isActive}
      isHovered={isHovered}
      onClick={onClick}
      onHover={onHover}
    >
      <group ref={brainRef}>
        {/* Main brain - outer surface (pinkish gray matter) */}
        <mesh geometry={brainGeometry}>
          <meshStandardMaterial
            color="#e8b4b8"
            emissive="#ff6688"
            emissiveIntensity={0.08 * intensity}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Brain wrinkle highlights (wireframe for texture) */}
        <mesh geometry={brainGeometry} scale={1.001}>
          <meshBasicMaterial
            color="#cc8899"
            wireframe
            transparent
            opacity={0.15 * intensity}
          />
        </mesh>

        {/* Inner brain glow (white matter) */}
        <mesh geometry={brainGeometry} scale={0.85}>
          <meshBasicMaterial
            color="#ffdddd"
            transparent
            opacity={0.12 * intensity}
          />
        </mesh>

        {/* Brain surface glow */}
        <mesh geometry={brainGeometry} scale={1.03}>
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.06 * intensity}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Cerebellum (little brain at back-bottom) */}
        <group position={[0, -0.28, -0.32]}>
          <mesh geometry={cerebellumGeometry}>
            <meshStandardMaterial
              color="#d4a0a8"
              emissive="#ff5577"
              emissiveIntensity={0.1 * intensity}
              transparent
              opacity={0.4}
              roughness={0.85}
            />
          </mesh>
          {/* Cerebellum folia texture */}
          <mesh geometry={cerebellumGeometry} scale={1.01}>
            <meshBasicMaterial
              color="#bb7788"
              wireframe
              transparent
              opacity={0.2 * intensity}
            />
          </mesh>
        </group>

        {/* Neurons */}
        {neurons.map((neuron, i) => {
          const activity = neuronActivityRef.current ? (neuronActivityRef.current[i] ?? 0.5) : 0.5;
          const size = neuron.type === 'cortex' ? 0.012 : neuron.type === 'deep' ? 0.015 : 0.01;
          const baseColor = neuron.type === 'cortex' ? project.color :
                           neuron.type === 'deep' ? '#ff6688' : '#88ff88';

          return (
            <group key={`neuron-${i}`}>
              {/* Neuron body */}
              <mesh position={neuron.position}>
                <sphereGeometry args={[size * (0.8 + activity * 0.4), 8, 8]} />
                <meshStandardMaterial
                  color={baseColor}
                  emissive={baseColor}
                  emissiveIntensity={(0.3 + activity * 0.7) * intensity}
                  metalness={0.3}
                  roughness={0.5}
                />
              </mesh>
              {/* Neuron glow when active */}
              {activity > 0.6 && (
                <mesh position={neuron.position}>
                  <sphereGeometry args={[size * 2.5, 6, 6]} />
                  <meshBasicMaterial
                    color={baseColor}
                    transparent
                    opacity={activity * 0.3 * intensity}
                  />
                </mesh>
              )}
            </group>
          );
        })}

        {/* Synaptic connections removed for performance */}

        {/* Pre-allocated Synaptic impulse pool */}
        <group ref={impulsesGroupRef}>
          {Array.from({ length: maxImpulses }).map((_, i) => (
            <group key={`impulse-${i}`} visible={false}>
              {/* Main impulse */}
              <mesh>
                <sphereGeometry args={[0.012, 6, 6]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
              </mesh>
              {/* Impulse glow */}
              <mesh>
                <sphereGeometry args={[0.025, 6, 6]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Central longitudinal fissure highlight */}
        <mesh position={[0, 0.12, 0.05]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.008, 0.02, 0.5]} />
          <meshBasicMaterial
            color="#aa4466"
            transparent
            opacity={0.3 * intensity}
          />
        </mesh>

        {/* Brain stem (medulla, pons, midbrain) */}
        <group position={[0, -0.35, -0.15]}>
          {/* Midbrain */}
          <mesh position={[0, 0.08, 0.05]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial
              color="#d0a0a0"
              emissive="#ff6666"
              emissiveIntensity={0.1 * intensity}
              transparent
              opacity={0.5}
            />
          </mesh>
          {/* Pons (bulge) */}
          <mesh position={[0, -0.02, 0.03]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial
              color="#c89898"
              emissive="#ff5555"
              emissiveIntensity={0.08 * intensity}
              transparent
              opacity={0.45}
            />
          </mesh>
          {/* Medulla oblongata */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.04, 0.03, 0.12, 12]} />
            <meshStandardMaterial
              color="#c09090"
              emissive={project.color}
              emissiveIntensity={0.1 * intensity}
              transparent
              opacity={0.4}
            />
          </mesh>
          {/* Spinal cord start */}
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.025, 0.02, 0.1, 8]} />
            <meshStandardMaterial
              color="#b88888"
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>

        {/* Blood vessels and ambient particles removed for performance */}
      </group>
    </BaseNode>
  );
}

export default NeuralNode;
