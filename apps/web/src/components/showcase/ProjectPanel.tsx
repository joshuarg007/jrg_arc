// apps/web/src/components/showcase/ProjectPanel.tsx
import React from 'react';
import type { ProjectNode } from '@core/types/project';

interface ProjectPanelProps {
  project: ProjectNode | null;
  onClose: () => void;
}

export function ProjectPanel({ project, onClose }: ProjectPanelProps) {
  if (!project) return null;

  const isComingSoon = project.status === 'coming-soon';

  return (
    <div className="panel-overlay" style={styles.overlay}>
      <div style={styles.panel}>
        {/* Close button */}
        <button style={styles.closeButton} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div style={styles.header}>
          <div style={{ ...styles.statusBadge, background: isComingSoon ? '#6b7280' : project.color }}>
            {isComingSoon ? 'Coming Soon' : 'Live'}
          </div>
          <h1 style={styles.title}>{project.title}</h1>
          <p style={styles.subtitle}>{project.subtitle}</p>
          <p style={styles.role}>{project.showcase.role}</p>
        </div>

        {/* Description */}
        <div style={styles.section}>
          <p style={styles.description}>{project.showcase.description}</p>
        </div>

        {/* Features */}
        {project.showcase.features.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Features</h3>
            <ul style={styles.featureList}>
              {project.showcase.features.map((feature, index) => (
                <li key={index} style={styles.featureItem}>
                  <span style={{ ...styles.bullet, background: project.color }} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        {project.showcase.techStack.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Tech Stack</h3>
            <div style={styles.techGrid}>
              {project.showcase.techStack.map((tech, index) => (
                <span
                  key={index}
                  style={{
                    ...styles.techBadge,
                    borderColor: project.color,
                    color: project.color,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {project.showcase.links.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Links</h3>
            <div style={styles.linkGrid}>
              {project.showcase.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...styles.linkButton,
                    background: project.color,
                  }}
                >
                  {link.icon === 'github' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  )}
                  {link.icon === 'external' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  )}
                  {link.icon === 'demo' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  )}
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Back hint */}
        <div style={styles.backHint}>
          Press <kbd style={styles.kbd}>ESC</kbd> or click outside to return
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '380px',
    maxWidth: '100vw',
    zIndex: 100,
    pointerEvents: 'auto',
  },
  panel: {
    height: '100%',
    background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.98) 0%, rgba(20, 20, 30, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '32px',
    overflowY: 'auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  closeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#ffffff',
    transition: 'background 0.2s',
  },
  header: {
    marginTop: '24px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#000000',
    marginBottom: '12px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 8px 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '0 0 8px 0',
  },
  role: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: 0,
    fontStyle: 'italic',
  },
  section: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '20px',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: '0 0 12px 0',
  },
  description: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: 'rgba(255, 255, 255, 0.85)',
    margin: 0,
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bullet: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  techGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  techBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid',
    background: 'transparent',
  },
  linkGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  linkButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#000000',
    textDecoration: 'none',
    transition: 'transform 0.2s, opacity 0.2s',
  },
  backHint: {
    marginTop: 'auto',
    paddingTop: '20px',
    textAlign: 'center',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  kbd: {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    fontFamily: 'monospace',
    fontSize: '11px',
  },
};

export default ProjectPanel;
