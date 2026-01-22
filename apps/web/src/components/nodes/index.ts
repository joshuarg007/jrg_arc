// apps/web/src/components/nodes/index.ts
export { BaseNode } from './BaseNode';
export { CrystalNode } from './CrystalNode';
export { FunnelNode } from './FunnelNode';
export { ExplodedNode } from './ExplodedNode';
export { NeuralNode } from './NeuralNode';
export { CloudNode } from './CloudNode';
export { GearsNode } from './GearsNode';
export { HeadsetNode } from './HeadsetNode';
export { BrowserNode } from './BrowserNode';
export { LockedNode } from './LockedNode';
export { HobbiesNode } from './HobbiesNode';
export { HydraNode } from './HydraNode';

// Node component mapping by model type
import type { ProjectNode } from '@core/types/project';
import { CrystalNode } from './CrystalNode';
import { FunnelNode } from './FunnelNode';
import { ExplodedNode } from './ExplodedNode';
import { NeuralNode } from './NeuralNode';
import { CloudNode } from './CloudNode';
import { GearsNode } from './GearsNode';
import { HeadsetNode } from './HeadsetNode';
import { BrowserNode } from './BrowserNode';
import { LockedNode } from './LockedNode';
import { HobbiesNode } from './HobbiesNode';
import { HydraNode } from './HydraNode';

export const NodeComponents = {
  crystal: CrystalNode,
  funnel: FunnelNode,
  exploded: ExplodedNode,
  neural: NeuralNode,
  cloud: CloudNode,
  gears: GearsNode,
  headset: HeadsetNode,
  browser: BrowserNode,
  locked: LockedNode,
  hobbies: HobbiesNode,
  hydra: HydraNode,
} as const;

export type NodeComponentType = typeof NodeComponents[keyof typeof NodeComponents];

export interface NodeProps {
  project: ProjectNode;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}
