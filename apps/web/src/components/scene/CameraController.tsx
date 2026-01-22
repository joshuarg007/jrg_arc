// apps/web/src/components/scene/CameraController.tsx
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ProjectNode } from '@core/types/project';

interface CameraControllerProps {
  activeProject: ProjectNode | null;
  defaultPosition?: [number, number, number];
  defaultTarget?: [number, number, number];
  orbitEnabled?: boolean;
  controlsEnabled?: boolean; // Disable all controls when panels are open
  resetZoomKey?: number; // Increment to reset zoom to default
}

const BASE_RADIUS = 12; // Default orbit distance (wider to fit expanded nodes)
const DEFAULT_ZOOM_OFFSET = 1.5; // Mid-far zoom when returning from exhibit
const MAX_ZOOM_OUT = 5; // Max additional distance when zoomed out
const MAX_SPIN_SPEED = 2; // Max radians per second
const SPIN_FRICTION = 0.95; // Damping factor per frame
const DRAG_SENSITIVITY = 0.005;
const MAX_PITCH = (21 * Math.PI) / 180; // 21 degrees in radians
const PITCH_SENSITIVITY = 0.003;

export function CameraController({
  activeProject,
  defaultPosition = [0, 2, 8],
  defaultTarget = [0, 0, 0],
  orbitEnabled = true,
  controlsEnabled = true,
  resetZoomKey = 0,
}: CameraControllerProps) {
  const { camera, gl } = useThree();

  const targetPosition = useRef(new THREE.Vector3(...defaultPosition));
  const targetLookAt = useRef(new THREE.Vector3(...defaultTarget));
  const currentLookAt = useRef(new THREE.Vector3(...defaultTarget));
  const orbitAngle = useRef(0);
  const isTransitioning = useRef(false);
  const zoomOffset = useRef(0); // 0 = default, positive = zoomed out

  // Drag/pan state
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const spinVelocity = useRef(0.5); // Start with a gentle spin on load
  const pitchAngle = useRef(0); // Vertical angle, limited to ±MAX_PITCH

  // Handle scroll to zoom out (only when controls enabled and orbiting)
  useEffect(() => {
    const canvas = gl.domElement;

    const handleWheel = (e: WheelEvent) => {
      // Only allow zoom when controls enabled and not focused on a project
      if (!controlsEnabled || activeProject) return;

      e.preventDefault();

      // Scroll down (positive deltaY) = zoom out
      // Scroll up (negative deltaY) = zoom back in (but not past default)
      const delta = e.deltaY * 0.005;
      zoomOffset.current = Math.max(0, Math.min(MAX_ZOOM_OUT, zoomOffset.current + delta));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [gl, activeProject, controlsEnabled]);

  // Handle mouse drag to pan/spin the scene
  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      if (!controlsEnabled || activeProject) return;
      isDragging.current = true;
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !controlsEnabled || activeProject) return;

      const deltaX = e.clientX - lastMouseX.current;
      const deltaY = e.clientY - lastMouseY.current;
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;

      // Add to spin velocity (clamped to max speed)
      spinVelocity.current = Math.max(
        -MAX_SPIN_SPEED,
        Math.min(MAX_SPIN_SPEED, spinVelocity.current - deltaX * DRAG_SENSITIVITY)
      );

      // Update pitch angle (clamped to ±21 degrees)
      pitchAngle.current = Math.max(
        -MAX_PITCH,
        Math.min(MAX_PITCH, pitchAngle.current + deltaY * PITCH_SENSITIVITY)
      );
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [gl, activeProject, controlsEnabled]);

  // Touch controls for mobile (swipe to pan, pinch to zoom)
  const lastTouchDistance = useRef(0);
  const touchCount = useRef(0);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleTouchStart = (e: TouchEvent) => {
      if (!controlsEnabled || activeProject) return;
      touchCount.current = e.touches.length;

      if (e.touches.length === 1) {
        // Single touch - start drag
        const touch = e.touches[0];
        if (!touch) return;
        isDragging.current = true;
        lastMouseX.current = touch.clientX;
        lastMouseY.current = touch.clientY;
      } else if (e.touches.length === 2) {
        // Two fingers - start pinch zoom
        const touch0 = e.touches[0];
        const touch1 = e.touches[1];
        if (!touch0 || !touch1) return;
        const dx = touch0.clientX - touch1.clientX;
        const dy = touch0.clientY - touch1.clientY;
        lastTouchDistance.current = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!controlsEnabled || activeProject) return;
      e.preventDefault();

      if (e.touches.length === 1 && isDragging.current) {
        // Single finger swipe - pan/spin
        const touch = e.touches[0];
        if (!touch) return;
        const deltaX = touch.clientX - lastMouseX.current;
        const deltaY = touch.clientY - lastMouseY.current;
        lastMouseX.current = touch.clientX;
        lastMouseY.current = touch.clientY;

        spinVelocity.current = Math.max(
          -MAX_SPIN_SPEED,
          Math.min(MAX_SPIN_SPEED, spinVelocity.current - deltaX * DRAG_SENSITIVITY * 1.5)
        );

        pitchAngle.current = Math.max(
          -MAX_PITCH,
          Math.min(MAX_PITCH, pitchAngle.current + deltaY * PITCH_SENSITIVITY * 1.5)
        );
      } else if (e.touches.length === 2) {
        // Pinch zoom
        const touch0 = e.touches[0];
        const touch1 = e.touches[1];
        if (!touch0 || !touch1) return;
        const dx = touch0.clientX - touch1.clientX;
        const dy = touch0.clientY - touch1.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (lastTouchDistance.current > 0) {
          const delta = (lastTouchDistance.current - distance) * 0.02;
          zoomOffset.current = Math.max(0, Math.min(MAX_ZOOM_OUT, zoomOffset.current + delta));
        }
        lastTouchDistance.current = distance;
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      lastTouchDistance.current = 0;
      touchCount.current = 0;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [gl, activeProject, controlsEnabled]);

  // Reset zoom and pitch when key changes (panels close, etc.)
  const prevResetKey = useRef(resetZoomKey);
  useEffect(() => {
    if (resetZoomKey !== prevResetKey.current) {
      // Reset zoom to mid-far distance (not too close, not too far)
      zoomOffset.current = DEFAULT_ZOOM_OFFSET;
      spinVelocity.current = 0.3; // gentle spin
      pitchAngle.current = 0; // reset vertical angle
      prevResetKey.current = resetZoomKey;
    }
  }, [resetZoomKey]);

  // Track previous project to detect transitions
  const prevProject = useRef<ProjectNode | null>(null);

  // Update targets when active project changes
  useEffect(() => {
    // Only transition if actually changing to/from a project
    const wasOnProject = prevProject.current !== null;
    const isOnProject = activeProject !== null;

    if (isOnProject) {
      // Flying to a project
      isTransitioning.current = true;
      const nodePos = new THREE.Vector3(...activeProject.position);
      const offset = new THREE.Vector3(1.5, 0.5, 2);
      targetPosition.current.copy(nodePos).add(offset);
      targetLookAt.current.copy(nodePos);

      setTimeout(() => {
        isTransitioning.current = false;
      }, 800);
    } else if (wasOnProject && !isOnProject) {
      // Only reset camera when coming BACK from a project, not when panels close
      isTransitioning.current = true;
      targetLookAt.current.set(...defaultTarget);

      setTimeout(() => {
        isTransitioning.current = false;
      }, 600);
    }

    prevProject.current = activeProject;
  }, [activeProject, defaultPosition, defaultTarget]);

  useFrame((state, delta) => {
    // Orbit when no active project and orbiting is enabled
    if (!activeProject && orbitEnabled && !isTransitioning.current) {
      // Apply spin velocity (from drag) + base auto-rotation
      const baseSpeed = isDragging.current ? 0 : 0.1; // Pause auto-rotate while dragging
      orbitAngle.current += delta * (baseSpeed + spinVelocity.current);

      // Apply friction to spin velocity
      spinVelocity.current *= SPIN_FRICTION;
      if (Math.abs(spinVelocity.current) < 0.001) {
        spinVelocity.current = 0;
      }

      const radius = BASE_RADIUS + zoomOffset.current;
      // Height based on pitch angle (drag up = look down from above, drag down = look up from below)
      const baseHeight = 2 + zoomOffset.current * 0.4;
      const pitchOffset = Math.sin(pitchAngle.current) * radius;
      const height = baseHeight + pitchOffset;
      // Adjust horizontal radius based on pitch (camera moves on a sphere)
      const horizontalRadius = Math.cos(pitchAngle.current) * radius;

      targetPosition.current.set(
        Math.sin(orbitAngle.current) * horizontalRadius,
        height,
        Math.cos(orbitAngle.current) * horizontalRadius
      );
    }

    // Smoothly interpolate camera position (faster when transitioning back from panel)
    const lerpSpeed = isTransitioning.current ? 4 : 2;
    camera.position.lerp(targetPosition.current, delta * lerpSpeed);

    // Smoothly interpolate look-at target
    currentLookAt.current.lerp(targetLookAt.current, delta * lerpSpeed);

    // Force up vector before lookAt to prevent pole flipping
    camera.up.set(0, 1, 0);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

export default CameraController;
