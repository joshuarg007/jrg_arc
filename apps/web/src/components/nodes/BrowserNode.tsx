// apps/web/src/components/nodes/BrowserNode.tsx
// Modern Web Development - Infinite Staircase / Connectivity visualization
// PERFORMANCE OPTIMIZED: Pre-computed quaternions, refs for dynamic state
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BaseNode } from './BaseNode';
import type { ProjectNode } from '@core/types/project';

// Pre-allocate reusable objects for calculations
const _tempVec = new THREE.Vector3();
const _tempVec2 = new THREE.Vector3();
const _tempQuat = new THREE.Quaternion();
const _upVec = new THREE.Vector3(0, 1, 0);

interface BrowserNodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

// Tech stack colors
const techColors = {
  react: '#61DAFB',
  typescript: '#3178C6',
  nextjs: '#ffffff',
  tailwind: '#06B6D4',
  vite: '#646CFF',
  node: '#339933',
  graphql: '#E10098',
};

// Modern framework colors
const frameworkColors = {
  react: '#61DAFB',
  vue: '#42B883',
  angular: '#DD0031',
  svelte: '#FF3E00',
  nextjs: '#ffffff',
  nuxt: '#00DC82',
  astro: '#FF5D01',
  remix: '#000000',
  solid: '#2C4F7C',
  qwik: '#18B6F6',
};

export function BrowserNode({ project, isActive, isHovered, onClick, onHover }: BrowserNodeProps) {
  // Core refs
  const mainGroupRef = useRef<THREE.Group>(null);
  const staircase1Ref = useRef<THREE.Group>(null);
  const staircase2Ref = useRef<THREE.Group>(null);
  const staircase3Ref = useRef<THREE.Group>(null);
  const dataFlowRef = useRef<THREE.Group>(null);
  const connectorsRef = useRef<THREE.Group>(null);
  const platformsRef = useRef<THREE.Group>(null);
  const frameworksRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Generate staircase steps (Penrose-style infinite loop)
  const staircaseSteps = useMemo(() => {
    const steps: Array<{ pos: [number, number, number]; rot: number; level: number }> = [];
    const stepsPerLoop = 16;
    const radius = 0.25;
    const heightPerStep = 0.04;

    for (let i = 0; i < stepsPerLoop; i++) {
      const angle = (i / stepsPerLoop) * Math.PI * 2;
      const height = (i / stepsPerLoop) * heightPerStep * stepsPerLoop * 0.5;
      // Create the illusion of infinite ascent
      const adjustedHeight = height - 0.16; // Center vertically
      steps.push({
        pos: [Math.cos(angle) * radius, adjustedHeight, Math.sin(angle) * radius],
        rot: angle,
        level: i,
      });
    }
    return steps;
  }, []);

  // Data packets flowing along staircases - OPTIMIZED (reduced from 30 to 15)
  const dataPacketsConfig = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      staircase: i % 3,
      speed: 0.15 + Math.random() * 0.2,
      size: 0.012 + Math.random() * 0.008,
      colorIndex: i % 7,
    }));
  }, []);

  // Dynamic state stored in ref (not memoized data)
  const dataPacketProgress = useRef<Float32Array>(new Float32Array(15));
  if (dataPacketProgress.current[0] === 0) {
    for (let i = 0; i < 15; i++) {
      dataPacketProgress.current[i] = Math.random();
    }
  }

  // Connector beams between staircases - OPTIMIZED (reduced from 24 to 12)
  const connectors = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle1 = (i / 12) * Math.PI * 2;
      const angle2 = angle1 + Math.PI / 3;
      const height = ((i % 4) / 4 - 0.5) * 0.5;

      const from = new THREE.Vector3(Math.cos(angle1) * 0.25, height, Math.sin(angle1) * 0.25);
      const to = new THREE.Vector3(Math.cos(angle2) * 0.35, height + 0.05, Math.sin(angle2) * 0.35);
      const mid = from.clone().add(to).multiplyScalar(0.5);
      const length = from.distanceTo(to);
      const direction = to.clone().sub(from).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(_upVec, direction);

      return { mid, length, quaternion };
    });
  }, []);

  // Dynamic connector pulse state
  const connectorPulse = useRef<Float32Array>(new Float32Array(12));
  if (connectorPulse.current[0] === 0) {
    for (let i = 0; i < 12; i++) {
      connectorPulse.current[i] = Math.random();
    }
  }

  // Floating platforms at connection points - pre-compute beam geometry
  const platforms = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 0.4 + (i % 2) * 0.1;
      const height = ((i % 4) / 4 - 0.5) * 0.4;
      const pos: [number, number, number] = [Math.cos(angle) * radius, height, Math.sin(angle) * radius];

      // Pre-compute beam to center
      const beamMid: [number, number, number] = [-pos[0] / 2, -pos[1] / 2, -pos[2] / 2];
      const beamDir = new THREE.Vector3(-pos[0], -pos[1], -pos[2]).normalize();
      const beamQuat = new THREE.Quaternion().setFromUnitVectors(_upVec, beamDir);
      const beamLength = Math.sqrt(pos[0] ** 2 + pos[1] ** 2 + pos[2] ** 2);

      return {
        pos,
        size: 0.04 + (i % 3) * 0.01,
        tech: Object.keys(techColors)[i % 7] as keyof typeof techColors,
        beamMid,
        beamQuat,
        beamLength,
      };
    });
  }, []);

  // Vertical data streams - OPTIMIZED (reduced from 20 to 10)
  const dataStreams = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * Math.PI * 2;
      const radius = 0.15 + Math.random() * 0.35;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        speed: 0.3 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
        size: 0.006 + Math.random() * 0.004,
      };
    });
  }, []);

  // Connection nodes on the infinite path - pre-compute connection geometry
  const pathNodes = useMemo(() => {
    // First pass: create nodes
    const nodes = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const radiusVariation = 0.28 + Math.sin(i * 1.5) * 0.05;
      const height = Math.sin((i / 12) * Math.PI * 2) * 0.15;
      return {
        pos: [Math.cos(angle) * radiusVariation, height, Math.sin(angle) * radiusVariation] as [number, number, number],
        connectionIndices: [(i + 1) % 12, (i + 4) % 12],
        connections: [] as Array<{ mid: THREE.Vector3; length: number; quaternion: THREE.Quaternion }>,
      };
    });

    // Second pass: compute connection geometry
    nodes.forEach((node, i) => {
      const from = new THREE.Vector3(...node.pos);
      node.connectionIndices.forEach((targetIdx) => {
        const target = nodes[targetIdx];
        if (!target) return;
        const to = new THREE.Vector3(...target.pos);
        const mid = from.clone().add(to).multiplyScalar(0.5);
        const length = from.distanceTo(to);
        const direction = to.clone().sub(from).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(_upVec, direction);
        node.connections.push({ mid, length, quaternion });
      });
    });

    return nodes;
  }, []);

  // Modern framework icons floating at mid-level
  const frameworkIcons = useMemo(() => {
    const frameworks = Object.keys(frameworkColors) as (keyof typeof frameworkColors)[];
    return frameworks.map((fw, i) => {
      const angle = (i / frameworks.length) * Math.PI * 2;
      const radius = 0.32 + (i % 3) * 0.05;
      const height = Math.sin(angle * 2) * 0.12;
      // Different shapes for variety
      const shapes = ['box', 'octa', 'tetra', 'ico', 'dodeca'] as const;
      return {
        name: fw,
        color: frameworkColors[fw],
        pos: [Math.cos(angle) * radius, height, Math.sin(angle) * radius] as [number, number, number],
        shape: shapes[i % shapes.length],
        size: 0.025 + (i % 4) * 0.005,
        orbitSpeed: 0.3 + Math.random() * 0.4,
        bobOffset: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = isHovered || isActive ? 1.5 : 1;

    // Main group gentle float
    if (mainGroupRef.current) {
      mainGroupRef.current.position.y = Math.sin(t * 0.5) * 0.015;
    }

    // Rotate staircases at different speeds (creates impossible geometry illusion)
    if (staircase1Ref.current) {
      staircase1Ref.current.rotation.y += 0.008 * speed;
    }
    if (staircase2Ref.current) {
      staircase2Ref.current.rotation.y += 0.006 * speed;
    }
    if (staircase3Ref.current) {
      staircase3Ref.current.rotation.y -= 0.005 * speed;
    }

    // Core pulse
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.15;
      coreRef.current.scale.setScalar(pulse);
    }

    // Animate data packets along staircase paths
    if (dataFlowRef.current) {
      dataFlowRef.current.children.forEach((packet, i) => {
        const dp = dataPacketsConfig[i];
        if (!dp) return;
        const currentProgress = dataPacketProgress.current[i] ?? 0;
        dataPacketProgress.current[i] = currentProgress + dp.speed * 0.015 * speed;
        if ((dataPacketProgress.current[i] ?? 0) > 1) dataPacketProgress.current[i] = 0;
        const progress = dataPacketProgress.current[i] ?? 0;

        // Calculate position along the staircase spiral
        const angle = progress * Math.PI * 2;
        const baseRadius = 0.25 + dp.staircase * 0.1;
        const height = (progress - 0.5) * 0.4;

        // Add some wave motion
        const waveOffset = Math.sin(t * 2 + i) * 0.02;

        packet.position.set(
          Math.cos(angle) * (baseRadius + waveOffset),
          height,
          Math.sin(angle) * (baseRadius + waveOffset)
        );

        // Pulse the packet
        const packetPulse = 0.8 + Math.sin(t * 5 + i * 0.5) * 0.3;
        packet.scale.setScalar(packetPulse);
      });
    }

    // Animate connector beams
    if (connectorsRef.current) {
      connectorsRef.current.children.forEach((conn, i) => {
        const currentPulse = connectorPulse.current[i] ?? 0;
        connectorPulse.current[i] = (currentPulse + 0.02 * speed) % 1;
        const opacity = 0.3 + Math.sin((connectorPulse.current[i] ?? 0) * Math.PI * 2) * 0.2;
        ((conn as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = opacity * (isHovered ? 1.3 : 1);
      });
    }

    // Float platforms
    if (platformsRef.current) {
      platformsRef.current.children.forEach((platform, i) => {
        const plat = platforms[i];
        if (!plat) return;
        const baseY = plat.pos[1];
        platform.position.y = baseY + Math.sin(t * 1.5 + i * 0.8) * 0.02;
        platform.rotation.y += 0.01 * speed;
      });
    }

    // Animate framework icons - orbit and bob
    if (frameworksRef.current) {
      frameworksRef.current.children.forEach((icon, i) => {
        const fw = frameworkIcons[i];
        if (!fw) return;
        // Orbit around center
        const orbitAngle = t * fw.orbitSpeed * speed;
        const baseAngle = (i / frameworkIcons.length) * Math.PI * 2;
        const currentAngle = baseAngle + orbitAngle;
        const radius = 0.32 + (i % 3) * 0.05;

        // Bob up and down
        const bobHeight = Math.sin(t * 2 + fw.bobOffset) * 0.03;
        const baseHeight = Math.sin(currentAngle * 2) * 0.1;

        icon.position.set(
          Math.cos(currentAngle) * radius,
          baseHeight + bobHeight,
          Math.sin(currentAngle) * radius
        );

        // Spin the icon
        icon.rotation.y += 0.02 * speed;
        icon.rotation.x = Math.sin(t + i) * 0.2;
      });
    }
  });

  const intensity = isHovered ? 1.4 : isActive ? 1.7 : 1;
  const colorArray = Object.values(techColors);

  return (
    <BaseNode
      project={project}
      isActive={isActive}
      isHovered={isHovered}
      onClick={onClick}
      onHover={onHover}
    >
      <group ref={mainGroupRef}>
        {/* ===== CENTRAL CORE ===== */}
        <group>
          <mesh ref={coreRef}>
            <octahedronGeometry args={[0.06, 0]} />
            <meshStandardMaterial
              color={techColors.react}
              emissive={techColors.react}
              emissiveIntensity={0.8 * intensity}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Core glow */}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color={techColors.react} transparent opacity={0.15 * intensity} />
          </mesh>
        </group>

        {/* ===== STAIRCASE 1 - Inner spiral ===== */}
        <group ref={staircase1Ref}>
          {staircaseSteps.map((step, i) => (
            <group key={`s1-${i}`} position={step.pos} rotation={[0, step.rot, 0]}>
              {/* Step platform */}
              <mesh>
                <boxGeometry args={[0.08, 0.012, 0.035]} />
                <meshStandardMaterial
                  color={project.color}
                  emissive={project.color}
                  emissiveIntensity={0.3 * intensity}
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
              {/* Step edge glow */}
              <mesh position={[0.04, 0, 0]}>
                <boxGeometry args={[0.008, 0.015, 0.035]} />
                <meshBasicMaterial color={techColors.react} transparent opacity={0.5 * intensity} />
              </mesh>
              {/* Vertical connector to next step */}
              {i < staircaseSteps.length - 1 && (
                <mesh position={[0.04, 0.02, 0]}>
                  <cylinderGeometry args={[0.003, 0.003, 0.025, 4]} />
                  <meshBasicMaterial color={techColors.react} transparent opacity={0.4 * intensity} />
                </mesh>
              )}
            </group>
          ))}
          {/* Staircase rail - inner - OPTIMIZED (reduced segments) */}
          <mesh>
            <torusGeometry args={[0.25, 0.004, 6, 32]} />
            <meshBasicMaterial color={techColors.react} transparent opacity={0.4 * intensity} />
          </mesh>
        </group>

        {/* ===== STAIRCASE 2 - Middle spiral (offset) - OPTIMIZED (every other step) ===== */}
        <group ref={staircase2Ref} rotation={[0, Math.PI / 3, 0]}>
          {staircaseSteps.filter((_, i) => i % 2 === 0).map((step, i) => {
            const outerPos: [number, number, number] = [step.pos[0] * 1.4, step.pos[1] * 1.2, step.pos[2] * 1.4];
            return (
              <group key={`s2-${i}`} position={outerPos} rotation={[0, step.rot, 0]}>
                <mesh>
                  <boxGeometry args={[0.07, 0.01, 0.03]} />
                  <meshStandardMaterial
                    color={techColors.typescript}
                    emissive={techColors.typescript}
                    emissiveIntensity={0.25 * intensity}
                    metalness={0.7}
                    roughness={0.3}
                  />
                </mesh>
              </group>
            );
          })}
          <mesh>
            <torusGeometry args={[0.35, 0.003, 6, 32]} />
            <meshBasicMaterial color={techColors.typescript} transparent opacity={0.35 * intensity} />
          </mesh>
        </group>

        {/* ===== STAIRCASE 3 - Outer spiral (counter-rotate) - OPTIMIZED (every 3rd step) ===== */}
        <group ref={staircase3Ref} rotation={[0, -Math.PI / 6, 0]}>
          {staircaseSteps.filter((_, i) => i % 3 === 0).map((step, i) => {
            const outerPos: [number, number, number] = [step.pos[0] * 1.8, step.pos[1] * 0.8, step.pos[2] * 1.8];
            return (
              <group key={`s3-${i}`} position={outerPos} rotation={[0, step.rot, 0]}>
                <mesh>
                  <boxGeometry args={[0.06, 0.008, 0.025]} />
                  <meshStandardMaterial
                    color={techColors.vite}
                    emissive={techColors.vite}
                    emissiveIntensity={0.2 * intensity}
                    metalness={0.7}
                    roughness={0.3}
                  />
                </mesh>
              </group>
            );
          })}
          <mesh>
            <torusGeometry args={[0.45, 0.002, 6, 32]} />
            <meshBasicMaterial color={techColors.vite} transparent opacity={0.3 * intensity} />
          </mesh>
        </group>

        {/* ===== DATA FLOW PACKETS ===== */}
        <group ref={dataFlowRef}>
          {dataPacketsConfig.map((dp, i) => (
            <mesh key={i}>
              <sphereGeometry args={[dp.size, 6, 6]} />
              <meshBasicMaterial
                color={colorArray[dp.colorIndex]}
                transparent
                opacity={0.9}
              />
            </mesh>
          ))}
        </group>

        {/* ===== CONNECTOR BEAMS (pre-computed geometry) ===== */}
        <group ref={connectorsRef}>
          {connectors.map((conn, i) => (
            <mesh key={i} position={conn.mid} quaternion={conn.quaternion}>
              <cylinderGeometry args={[0.002, 0.002, conn.length, 4]} />
              <meshBasicMaterial
                color={colorArray[i % 7]}
                transparent
                opacity={0.3}
              />
            </mesh>
          ))}
        </group>

        {/* ===== FLOATING TECH PLATFORMS (pre-computed beam geometry) ===== */}
        <group ref={platformsRef}>
          {platforms.map((platform, i) => (
            <group key={i} position={platform.pos}>
              {/* Platform base */}
              <mesh>
                <cylinderGeometry args={[platform.size, platform.size * 0.8, 0.015, 6]} />
                <meshStandardMaterial
                  color={techColors[platform.tech]}
                  emissive={techColors[platform.tech]}
                  emissiveIntensity={0.5 * intensity}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
              {/* Platform glow ring */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[platform.size * 0.9, platform.size * 1.2, 6]} />
                <meshBasicMaterial
                  color={techColors[platform.tech]}
                  transparent
                  opacity={0.25 * intensity}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Connection beam to center (pre-computed) */}
              <mesh position={platform.beamMid} quaternion={platform.beamQuat}>
                <cylinderGeometry args={[0.002, 0.002, platform.beamLength, 4]} />
                <meshBasicMaterial color={techColors[platform.tech]} transparent opacity={0.2 * intensity} />
              </mesh>
            </group>
          ))}
        </group>

        {/* ===== MODERN FRAMEWORK ICONS ===== */}
        <group ref={frameworksRef}>
          {frameworkIcons.map((fw, i) => (
            <group key={fw.name} position={fw.pos}>
              {/* Framework shape */}
              <mesh>
                {fw.shape === 'box' && <boxGeometry args={[fw.size, fw.size, fw.size]} />}
                {fw.shape === 'octa' && <octahedronGeometry args={[fw.size * 0.7, 0]} />}
                {fw.shape === 'tetra' && <tetrahedronGeometry args={[fw.size * 0.8, 0]} />}
                {fw.shape === 'ico' && <icosahedronGeometry args={[fw.size * 0.6, 0]} />}
                {fw.shape === 'dodeca' && <dodecahedronGeometry args={[fw.size * 0.6, 0]} />}
                <meshStandardMaterial
                  color={fw.color}
                  emissive={fw.color}
                  emissiveIntensity={0.6 * intensity}
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
              {/* Glow sphere */}
              <mesh>
                <sphereGeometry args={[fw.size * 1.3, 8, 8]} />
                <meshBasicMaterial
                  color={fw.color}
                  transparent
                  opacity={0.15 * intensity}
                />
              </mesh>
              {/* Trailing particle */}
              <mesh position={[-fw.size * 1.5, 0, 0]}>
                <sphereGeometry args={[fw.size * 0.3, 6, 6]} />
                <meshBasicMaterial
                  color={fw.color}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* ===== PATH NODES WITH CONNECTIONS ===== */}
        {pathNodes.map((node, i) => (
          <group key={`node-${i}`}>
            {/* Node sphere */}
            <mesh position={node.pos}>
              <icosahedronGeometry args={[0.018, 0]} />
              <meshStandardMaterial
                color={colorArray[i % 7]}
                emissive={colorArray[i % 7]}
                emissiveIntensity={0.4 * intensity}
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Connections to other nodes (pre-computed geometry) */}
            {node.connections.map((conn, ci) => (
              <mesh key={`conn-${i}-${ci}`} position={conn.mid} quaternion={conn.quaternion}>
                <cylinderGeometry args={[0.0015, 0.0015, conn.length, 4]} />
                <meshBasicMaterial color={project.color} transparent opacity={0.25 * intensity} />
              </mesh>
            ))}
          </group>
        ))}

        {/* ===== VERTICAL DATA STREAMS (static particles) ===== */}
        {dataStreams.map((stream, i) => (
          <mesh key={`stream-${i}`} position={[stream.x, (stream.offset % 1) * 0.8 - 0.4, stream.z]}>
            <sphereGeometry args={[stream.size, 4, 4]} />
            <meshBasicMaterial
              color={colorArray[i % 7]}
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}

        {/* ===== OUTER BOUNDARY RINGS - OPTIMIZED (reduced to 1 ring, 32 segments) ===== */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.004, 6, 32]} />
          <meshBasicMaterial color={project.color} transparent opacity={0.3 * intensity} />
        </mesh>

        {/* ===== HEXAGONAL BASE ===== */}
        <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.4, 6]} />
          <meshBasicMaterial color={project.color} transparent opacity={0.25 * intensity} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
          <ringGeometry args={[0.3, 0.33, 6]} />
          <meshBasicMaterial color={techColors.react} transparent opacity={0.15 * intensity} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </BaseNode>
  );
}

export default BrowserNode;
