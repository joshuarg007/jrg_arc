// apps/web/src/components/scene/GalaxyScene.tsx
import React, { useState, useCallback } from 'react';
import { NodeComponents } from '../nodes';
import { projects } from '../../data/projects';
import type { ProjectNode } from '@core/types/project';

interface GalaxySceneProps {
  onNodeSelect: (project: ProjectNode | null) => void;
  activeProjectId: string | null;
}

export function GalaxyScene({ onNodeSelect, activeProjectId }: GalaxySceneProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleNodeClick = useCallback((project: ProjectNode) => {
    if (activeProjectId === project.id) {
      onNodeSelect(null);
    } else {
      onNodeSelect(project);
    }
  }, [activeProjectId, onNodeSelect]);

  const handleNodeHover = useCallback((projectId: string, hovered: boolean) => {
    setHoveredId(hovered ? projectId : null);
  }, []);

  return (
    <group>
      {projects.map((project) => {
        const NodeComponent = NodeComponents[project.modelType];

        if (!NodeComponent) {
          console.warn(`No component found for model type: ${project.modelType}`);
          return null;
        }

        return (
          <NodeComponent
            key={project.id}
            project={project}
            isActive={activeProjectId === project.id}
            isHovered={hoveredId === project.id}
            onClick={() => handleNodeClick(project)}
            onHover={(hovered) => handleNodeHover(project.id, hovered)}
          />
        );
      })}
    </group>
  );
}

export default GalaxyScene;
