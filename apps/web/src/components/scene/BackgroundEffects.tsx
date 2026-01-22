// apps/web/src/components/scene/BackgroundEffects.tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BackgroundEffectsProps {
  starCount?: number;
  particleCount?: number;
  color?: string;
}

export function BackgroundEffects({
  starCount = 1500,
  particleCount = 100,
  color = '#00f0ff',
}: BackgroundEffectsProps) {
  const starsRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate star field
  const starData = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Distribute stars in a sphere around the scene
      const radius = 30 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    return { positions, sizes };
  }, [starCount]);

  // Generate floating particles
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Distribute particles around the center
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      // Random slow velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities };
  }, [particleCount]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Slowly rotate star field
    if (starsRef.current) {
      starsRef.current.rotation.y = t * 0.01;
      starsRef.current.rotation.x = Math.sin(t * 0.005) * 0.1;
    }

    // Animate floating particles
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      if (!posAttr) return;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        // Add velocity
        const vx = particleData.velocities[idx] ?? 0;
        const vy = particleData.velocities[idx + 1] ?? 0;
        const vz = particleData.velocities[idx + 2] ?? 0;
        const px = (positions[idx] ?? 0) + vx;
        const py = (positions[idx + 1] ?? 0) + vy;
        const pz = (positions[idx + 2] ?? 0) + vz;
        positions[idx] = px;
        positions[idx + 1] = py;
        positions[idx + 2] = pz;

        // Wrap around bounds
        if (Math.abs(px) > 8) positions[idx] = px * -0.9;
        if (Math.abs(py) > 6) positions[idx + 1] = py * -0.9;
        if (Math.abs(pz) > 8) positions[idx + 2] = pz * -0.9;
      }

      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Star field */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starCount}
            array={starData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={starCount}
            array={starData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.15}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Floating ambient particles */}
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
          color={color}
          size={0.05}
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>

      {/* Ambient fog for depth */}
      <fog attach="fog" args={['#000000', 15, 60]} />

      {/* Subtle ambient light */}
      <ambientLight intensity={0.3} />

      {/* Main directional light */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        color="#ffffff"
      />

      {/* Accent colored light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={0.5}
        color={color}
        distance={20}
        decay={2}
      />

      {/* Rim lights */}
      <pointLight
        position={[-10, 5, -10]}
        intensity={0.3}
        color="#ff00ff"
        distance={25}
        decay={2}
      />
      <pointLight
        position={[10, -5, 10]}
        intensity={0.3}
        color="#00ffff"
        distance={25}
        decay={2}
      />
    </>
  );
}

export default BackgroundEffects;
