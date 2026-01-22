// apps/web/src/components/ui/NodeLabel.tsx
import React from 'react';
import type { ProjectNode } from '@core/types/project';

interface NodeLabelProps {
  project: ProjectNode;
  isVisible: boolean;
  screenPosition?: { x: number; y: number };
}

export function NodeLabel({ project, isVisible, screenPosition }: NodeLabelProps) {
  if (!isVisible || !screenPosition) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: screenPosition.x,
        top: screenPosition.y,
        transform: 'translate(-50%, -100%) translateY(-20px)',
        pointerEvents: 'none',
        zIndex: 50,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease-out',
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${project.color}`,
          borderRadius: '8px',
          padding: '8px 14px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: project.color,
            marginBottom: '2px',
          }}
        >
          {project.title}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {project.subtitle}
        </div>
      </div>
      {/* Arrow pointing down */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: `8px solid ${project.color}`,
          margin: '0 auto',
        }}
      />
    </div>
  );
}

export default NodeLabel;
