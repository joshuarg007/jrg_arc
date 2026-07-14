// packages/core/src/types/project.ts

export type ModelType =
  | 'crystal'    // AxionDeep - central hub
  | 'funnel'     // SLMS - lead pipeline
  | 'exploded'   // SciVista - component selector
  | 'neural'     // AI/ML projects
  | 'cloud'      // Cloud architecture
  | 'gears'      // Automation
  | 'headset'    // VR/AR
  | 'browser'    // Web Apps
  | 'hobbies'    // Hobbies - chess, poker, fitness
  | 'locked'     // Coming Soon
  | 'hydra';     // Vesper Hydra - AI pentesting

export type ProjectStatus = 'live' | 'coming-soon' | 'archived';

export interface ProjectLink {
  label: string;
  url: string;
  icon?: 'github' | 'external' | 'demo' | 'docs';
}

export interface ProjectMedia {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  thumbnail?: string;
}

export interface ProjectShowcase {
  description: string;
  role: string;
  techStack: string[];
  features: string[];
  links: ProjectLink[];
  media: ProjectMedia[];
}

export interface ProjectNode {
  id: string;
  title: string;
  subtitle: string;
  modelType: ModelType;
  position: [number, number, number];
  color: string;
  glowColor?: string;
  showcase: ProjectShowcase;
  status: ProjectStatus;
  orbitRadius?: number;
  orbitSpeed?: number;
  rotationSpeed?: number;
}

export interface GalleryState {
  activeNodeId: string | null;
  hoveredNodeId: string | null;
  cameraTarget: [number, number, number];
  isTransitioning: boolean;
}

export interface NodeInteractionProps {
  isHovered: boolean;
  isActive: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}
