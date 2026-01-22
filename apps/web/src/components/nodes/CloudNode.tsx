// apps/web/src/components/nodes/CloudNode.tsx
// Cloud Architecture - Ultimate connectivity visualization
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BaseNode } from './BaseNode';
import type { ProjectNode } from '@core/types/project';

interface CloudNodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function CloudNode({ project, isActive, isHovered, onClick, onHover }: CloudNodeProps) {
  // Core refs
  const mainGroupRef = useRef<THREE.Group>(null);
  const networkMeshRef = useRef<THREE.Group>(null);
  const dataPacketsRef = useRef<THREE.Group>(null);
  const globalRingsRef = useRef<THREE.Group>(null);
  const serverClustersRef = useRef<THREE.Group>(null);
  const connectionBeamsRef = useRef<THREE.Group>(null);
  const pulseWavesRef = useRef<THREE.Group>(null);
  const apiEndpointsRef = useRef<THREE.Group>(null);
  const bandwidthLinesRef = useRef<THREE.Group>(null);

  // Cloud provider brand colors
  const cloudColors = {
    hub: null, // Uses project color
    aws: '#FF9900',      // AWS Orange
    azure: '#0078D4',    // Microsoft Azure Blue
    gcp: '#4285F4',      // Google Cloud Blue
    oracle: '#F80000',   // Oracle Red
    alibaba: '#FF6A00',  // Alibaba Cloud Orange
    ibm: '#0530AD',      // IBM Cloud Blue
    digitalocean: '#0080FF', // DigitalOcean Blue
    edge: '#00D4AA',     // Edge/CDN Teal
  };

  // Network nodes - positioned in 3D space representing servers/regions
  const networkNodes = useMemo(() => {
    const nodes: Array<{ pos: [number, number, number]; size: number; region: string; provider: keyof typeof cloudColors }> = [
      // Central hub - your infrastructure
      { pos: [0, 0, 0], size: 0.12, region: 'hub', provider: 'hub' },
      // Primary cloud providers (inner ring)
      { pos: [0.35, 0.1, 0], size: 0.08, region: 'AWS', provider: 'aws' },
      { pos: [-0.35, 0.1, 0], size: 0.08, region: 'Azure', provider: 'azure' },
      { pos: [0, 0.1, 0.35], size: 0.08, region: 'GCP', provider: 'gcp' },
      { pos: [0, 0.1, -0.35], size: 0.08, region: 'Oracle', provider: 'oracle' },
      // Secondary providers (outer ring)
      { pos: [0.45, -0.1, 0.25], size: 0.06, region: 'Alibaba', provider: 'alibaba' },
      { pos: [-0.45, -0.1, 0.25], size: 0.06, region: 'IBM', provider: 'ibm' },
      { pos: [0.45, -0.1, -0.25], size: 0.06, region: 'DigitalOcean', provider: 'digitalocean' },
      { pos: [-0.45, -0.1, -0.25], size: 0.06, region: 'Azure-EU', provider: 'azure' },
      // Edge/CDN nodes
      { pos: [0.25, 0.35, 0.15], size: 0.04, region: 'CDN-1', provider: 'edge' },
      { pos: [-0.25, 0.35, -0.15], size: 0.04, region: 'CDN-2', provider: 'edge' },
      { pos: [0.15, 0.35, -0.25], size: 0.04, region: 'CDN-3', provider: 'edge' },
      { pos: [-0.15, 0.35, 0.25], size: 0.04, region: 'CDN-4', provider: 'edge' },
    ];
    return nodes;
  }, []);

  // Connection paths between nodes
  const connections = useMemo(() => {
    const conns: Array<{ from: number; to: number; bandwidth: number }> = [
      // Hub to primary regions
      { from: 0, to: 1, bandwidth: 1.0 },
      { from: 0, to: 2, bandwidth: 1.0 },
      { from: 0, to: 3, bandwidth: 1.0 },
      { from: 0, to: 4, bandwidth: 1.0 },
      // Primary to secondary
      { from: 1, to: 5, bandwidth: 0.7 },
      { from: 2, to: 6, bandwidth: 0.7 },
      { from: 3, to: 6, bandwidth: 0.6 },
      { from: 4, to: 7, bandwidth: 0.7 },
      { from: 4, to: 8, bandwidth: 0.6 },
      // Cross-region
      { from: 1, to: 3, bandwidth: 0.5 },
      { from: 2, to: 4, bandwidth: 0.5 },
      { from: 3, to: 4, bandwidth: 0.6 },
      // Edge connections
      { from: 0, to: 9, bandwidth: 0.4 },
      { from: 0, to: 10, bandwidth: 0.4 },
      { from: 0, to: 11, bandwidth: 0.4 },
      { from: 0, to: 12, bandwidth: 0.4 },
      { from: 1, to: 9, bandwidth: 0.3 },
      { from: 2, to: 10, bandwidth: 0.3 },
      { from: 3, to: 11, bandwidth: 0.3 },
      { from: 4, to: 12, bandwidth: 0.3 },
    ];
    return conns;
  }, []);

  // Data packets traveling between nodes - OPTIMIZED (reduced from 40 to 20)
  const dataPackets = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      connectionIndex: i % connections.length,
      progress: Math.random(),
      speed: 0.3 + Math.random() * 0.5,
      size: 0.015 + Math.random() * 0.01,
      color: i % 3, // 0 = primary, 1 = secondary, 2 = white
    }));
  }, [connections.length]);

  // Pulse waves emanating from hub - OPTIMIZED (reduced from 5 to 3)
  const pulseWaves = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      delay: i * 0.5,
      speed: 0.8,
    }));
  }, []);

  // API endpoint markers
  const apiEndpoints = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 0.55;
      return {
        pos: [Math.cos(angle) * radius, 0.05, Math.sin(angle) * radius] as [number, number, number],
        angle,
      };
    });
  }, []);

  // Floating cloud formations
  const cloudBlobs = useMemo(() => [
    { pos: [0, 0.5, 0] as [number, number, number], scale: 0.15 },
    { pos: [0.12, 0.55, 0.08] as [number, number, number], scale: 0.1 },
    { pos: [-0.1, 0.52, -0.05] as [number, number, number], scale: 0.12 },
  ], []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = isHovered || isActive ? 2 : 1;

    // Main group gentle rotation
    if (mainGroupRef.current) {
      mainGroupRef.current.rotation.y += 0.002 * speed;
    }

    // Network mesh pulse
    if (networkMeshRef.current) {
      networkMeshRef.current.children.forEach((node, i) => {
        const pulse = 1 + Math.sin(t * 3 + i * 0.5) * 0.15;
        node.scale.setScalar(pulse);
      });
    }

    // Animate data packets along connections
    if (dataPacketsRef.current) {
      dataPacketsRef.current.children.forEach((packet, i) => {
        const dp = dataPackets[i];
        if (!dp) return;
        dp.progress += dp.speed * 0.016 * speed;
        if (dp.progress > 1) dp.progress = 0;

        const conn = connections[dp.connectionIndex];
        if (!conn) return;
        const fromNode = networkNodes[conn.from];
        const toNode = networkNodes[conn.to];
        if (!fromNode || !toNode) return;

        // Interpolate position with slight arc
        const arcHeight = 0.1 * Math.sin(dp.progress * Math.PI);
        packet.position.set(
          fromNode.pos[0] + (toNode.pos[0] - fromNode.pos[0]) * dp.progress,
          fromNode.pos[1] + (toNode.pos[1] - fromNode.pos[1]) * dp.progress + arcHeight,
          fromNode.pos[2] + (toNode.pos[2] - fromNode.pos[2]) * dp.progress
        );

        // Pulse size
        const sizePulse = 1 + Math.sin(t * 8 + i) * 0.3;
        packet.scale.setScalar(sizePulse);
      });
    }

    // Global rings rotation
    if (globalRingsRef.current) {
      globalRingsRef.current.children.forEach((ring, i) => {
        ring.rotation.z += (0.01 + i * 0.003) * speed * (i % 2 ? 1 : -1);
        ring.rotation.x += 0.002 * speed;
      });
    }

    // Server clusters animation
    if (serverClustersRef.current) {
      serverClustersRef.current.children.forEach((cluster, i) => {
        const bob = Math.sin(t * 2 + i * 1.2) * 0.02;
        cluster.position.y = -0.45 + bob;
      });
    }

    // Connection beams pulse
    if (connectionBeamsRef.current) {
      connectionBeamsRef.current.children.forEach((beam, i) => {
        const pulse = 0.3 + Math.sin(t * 4 + i * 0.3) * 0.2;
        ((beam as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = pulse * (isHovered ? 1.5 : isActive ? 1.8 : 1);
      });
    }

    // Pulse waves expansion
    if (pulseWavesRef.current) {
      pulseWavesRef.current.children.forEach((wave, i) => {
        const pw = pulseWaves[i];
        if (!pw) return;
        const waveT = (t * pw.speed + pw.delay) % 2;
        const scale = waveT * 0.6;
        wave.scale.setScalar(scale);
        ((wave as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1 - waveT / 2) * 0.3);
      });
    }

    // API endpoints pulse
    if (apiEndpointsRef.current) {
      apiEndpointsRef.current.children.forEach((endpoint, i) => {
        const pulse = 1 + Math.sin(t * 5 + i * 0.8) * 0.2;
        endpoint.scale.setScalar(pulse);
      });
    }

    // Bandwidth lines animation
    if (bandwidthLinesRef.current) {
      bandwidthLinesRef.current.children.forEach((line, i) => {
        const flowOffset = (t * 2 + i * 0.2) % 1;
        // Animate dash offset for flow effect
        const mat = (line as THREE.Line).material as THREE.LineDashedMaterial & { dashOffset?: number };
        if (mat.dashSize !== undefined) {
          mat.dashOffset = -flowOffset * 0.5;
        }
      });
    }
  });

  const intensity = isHovered ? 1.3 : isActive ? 1.6 : 1;

  return (
    <BaseNode
      project={project}
      isActive={isActive}
      isHovered={isHovered}
      onClick={onClick}
      onHover={onHover}
    >
      <group ref={mainGroupRef}>
        {/* Network nodes - the backbone with cloud provider colors */}
        <group ref={networkMeshRef}>
          {networkNodes.map((node, i) => {
            const nodeColor = cloudColors[node.provider] ?? project.color;
            const isHub = node.provider === 'hub';
            return (
              <group key={i} position={node.pos}>
                {/* Node core */}
                <mesh>
                  <icosahedronGeometry args={[node.size, 1]} />
                  <meshStandardMaterial
                    color={isHub ? project.color : nodeColor}
                    emissive={isHub ? project.color : nodeColor}
                    emissiveIntensity={isHub ? 0.8 * intensity : 0.5 * intensity}
                    metalness={0.8}
                    roughness={0.2}
                    transparent
                    opacity={0.9}
                  />
                </mesh>
                {/* Node wireframe */}
                <mesh>
                  <icosahedronGeometry args={[node.size * 1.2, 1]} />
                  <meshBasicMaterial
                    color={isHub ? project.color : nodeColor}
                    wireframe
                    transparent
                    opacity={0.5 * intensity}
                  />
                </mesh>
                {/* Node glow */}
                <mesh>
                  <sphereGeometry args={[node.size * 1.5, 8, 8]} />
                  <meshBasicMaterial
                    color={isHub ? project.color : nodeColor}
                    transparent
                    opacity={0.15 * intensity}
                  />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Connection beams between nodes - colored by destination */}
        <group ref={connectionBeamsRef}>
          {connections.map((conn, i) => {
            const fromNode = networkNodes[conn.from];
            const toNode = networkNodes[conn.to];
            if (!fromNode || !toNode) return null;
            const from = fromNode.pos;
            const to = toNode.pos;
            // Use destination node's color for the beam
            const beamColor = cloudColors[toNode.provider] ?? project.color;
            const midpoint: [number, number, number] = [
              (from[0] + to[0]) / 2,
              (from[1] + to[1]) / 2 + 0.05,
              (from[2] + to[2]) / 2,
            ];
            const length = Math.sqrt(
              Math.pow(to[0] - from[0], 2) +
              Math.pow(to[1] - from[1], 2) +
              Math.pow(to[2] - from[2], 2)
            );
            const angle = Math.atan2(to[2] - from[2], to[0] - from[0]);
            const pitch = Math.asin((to[1] - from[1]) / length);

            return (
              <mesh
                key={i}
                position={midpoint}
                rotation={[0, -angle, pitch]}
              >
                <cylinderGeometry args={[0.004 * conn.bandwidth, 0.004 * conn.bandwidth, length, 6]} />
                <meshBasicMaterial
                  color={beamColor}
                  transparent
                  opacity={0.5 * conn.bandwidth * intensity}
                />
              </mesh>
            );
          })}
        </group>

        {/* Data packets traveling - colored by destination */}
        <group ref={dataPacketsRef}>
          {dataPackets.map((dp, i) => {
            const conn = connections[dp.connectionIndex];
            if (!conn) return null;
            const destNode = networkNodes[conn.to];
            if (!destNode) return null;
            const packetColor = cloudColors[destNode.provider] ?? project.color;
            return (
              <mesh key={i}>
                <boxGeometry args={[dp.size, dp.size, dp.size]} />
                <meshBasicMaterial
                  color={packetColor}
                  transparent
                  opacity={0.95}
                />
              </mesh>
            );
          })}
        </group>

        {/* Global connectivity rings - OPTIMIZED (reduced to 2 rings, 32 segments) */}
        <group ref={globalRingsRef}>
          <mesh rotation={[Math.PI / 6, 0, 0]}>
            <torusGeometry args={[0.6, 0.005, 6, 32]} />
            <meshBasicMaterial color={project.color} transparent opacity={0.5 * intensity} />
          </mesh>
          <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
            <torusGeometry args={[0.65, 0.004, 6, 32]} />
            <meshBasicMaterial color={project.glowColor ?? project.color} transparent opacity={0.35 * intensity} />
          </mesh>
        </group>

        {/* Pulse waves from center */}
        <group ref={pulseWavesRef}>
          {pulseWaves.map((_, i) => (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.95, 1, 32]} />
              <meshBasicMaterial
                color={project.color}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>

        {/* API Endpoints around perimeter */}
        <group ref={apiEndpointsRef}>
          {apiEndpoints.map((ep, i) => (
            <group key={i} position={ep.pos}>
              <mesh>
                <octahedronGeometry args={[0.035, 0]} />
                <meshStandardMaterial
                  color={i % 2 === 0 ? project.color : (project.glowColor ?? '#00ff88')}
                  emissive={i % 2 === 0 ? project.color : (project.glowColor ?? '#00ff88')}
                  emissiveIntensity={0.6 * intensity}
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
              {/* Endpoint beam to hub */}
              <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.002, 0.002, 0.2, 4]} />
                <meshBasicMaterial color={project.color} transparent opacity={0.3 * intensity} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Server clusters at bottom */}
        <group ref={serverClustersRef}>
          {[-0.25, 0, 0.25].map((x, clusterIdx) => (
            <group key={clusterIdx} position={[x, -0.45, 0]}>
              {[0, 1, 2].map((i) => (
                <mesh key={i} position={[0, -i * 0.06, 0]}>
                  <boxGeometry args={[0.12, 0.04, 0.08]} />
                  <meshStandardMaterial
                    color="#1a1a2e"
                    emissive={project.color}
                    emissiveIntensity={0.2 * intensity}
                    metalness={0.9}
                    roughness={0.1}
                  />
                </mesh>
              ))}
              {/* Status LEDs */}
              {[0, 1, 2].map((i) => (
                <mesh key={`led-${i}`} position={[0.05, -i * 0.06, 0.041]}>
                  <circleGeometry args={[0.008, 8]} />
                  <meshBasicMaterial color={i === 1 ? '#00ff00' : project.color} />
                </mesh>
              ))}
            </group>
          ))}
        </group>

        {/* Floating cloud formations at top */}
        <group>
          {cloudBlobs.map((blob, index) => (
            <mesh key={index} position={blob.pos}>
              <sphereGeometry args={[blob.scale, 12, 12]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive={project.color}
                emissiveIntensity={0.15 * intensity}
                metalness={0.1}
                roughness={0.8}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </group>

        {/* Vertical data streams to/from cloud */}
        {[-0.08, 0, 0.08].map((x, i) => (
          <group key={i}>
            {Array.from({ length: 6 }).map((_, j) => {
              const y = 0.15 + j * 0.05;
              return (
                <mesh key={j} position={[x, y, 0]}>
                  <boxGeometry args={[0.008, 0.02, 0.008]} />
                  <meshBasicMaterial
                    color={project.color}
                    transparent
                    opacity={(1 - j / 6) * 0.7 * intensity}
                  />
                </mesh>
              );
            })}
          </group>
        ))}

        {/* Hexagonal platform base */}
        <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.4, 6]} />
          <meshBasicMaterial color={project.color} transparent opacity={0.3 * intensity} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
          <ringGeometry args={[0.42, 0.45, 6]} />
          <meshBasicMaterial color={project.glowColor ?? project.color} transparent opacity={0.2 * intensity} side={THREE.DoubleSide} />
        </mesh>

        {/* Ambient particle field - REMOVED for performance */}
      </group>
    </BaseNode>
  );
}

export default CloudNode;
