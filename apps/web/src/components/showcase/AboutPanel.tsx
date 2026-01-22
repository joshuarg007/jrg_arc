// apps/web/src/components/showcase/AboutPanel.tsx
import React, { useState } from 'react';
import { ExpandedAboutPanel } from './ExpandedAboutPanel';

interface AboutPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutPanel({ isOpen, onClose }: AboutPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen) return null;

  // If expanded, show the full-screen panel
  if (isExpanded) {
    return <ExpandedAboutPanel isOpen={true} onClose={() => setIsExpanded(false)} />;
  }

  const accentColor = '#00f0ff';

  return (
    <div className="panel-overlay" style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button style={styles.closeButton} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Expand button */}
        <button
          style={styles.expandButton}
          onClick={() => setIsExpanded(true)}
          title="Expand to full view"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>

        {/* Header */}
        <div style={styles.header}>
          <div style={{ ...styles.statusBadge, background: accentColor }}>
            About Me
          </div>
          <h1 style={styles.title}>Joshua Gutierrez</h1>
          <p style={styles.subtitle}>Software Engineer & Technology Architect</p>
        </div>

        {/* Bio */}
        <div style={styles.section}>
          <p style={styles.description}>
            Full-stack software engineer and entrepreneur with 10+ years building AI-powered SaaS platforms,
            security automation tools, and enterprise solutions. Founder of Axion Deep Labs.
          </p>
          <p style={styles.description}>
            I build products spanning quantum computing education, autonomous penetration testing, and B2B integrations.
            Deep expertise in React, Python, and cloud infrastructure with hands-on leadership to ship production-grade systems.
          </p>
        </div>

        {/* Skills */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Core Skills</h3>
          <div style={styles.skillGrid}>
            {[
              'Python', 'TypeScript', 'React', 'FastAPI',
              'Claude AI', 'LangChain', 'PostgreSQL', 'Docker',
              'AWS', 'Three.js', 'Qiskit', 'RAG Systems'
            ].map((skill, index) => (
              <span
                key={index}
                style={{
                  ...styles.skillBadge,
                  borderColor: accentColor,
                  color: accentColor,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience highlights */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Focus Areas</h3>
          <ul style={styles.featureList}>
            {[
              'AI-powered SaaS development',
              'Security automation & pentesting tools',
              'Quantum computing education platforms',
              'Cloud architecture & DevOps',
              'LLM integration & RAG systems',
            ].map((item, index) => (
              <li key={index} style={styles.featureItem}>
                <span style={{ ...styles.bullet, background: accentColor }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Philosophy */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Philosophy</h3>
          <p style={styles.quote}>
            "Build fast, build secure, build with intention. Technology should serve
            humanity's potential, not complicate it."
          </p>
        </div>

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
  expandButton: {
    position: 'absolute',
    top: '12px',
    right: '64px',
    background: 'rgba(0, 240, 255, 0.1)',
    border: '1px solid rgba(0, 240, 255, 0.3)',
    borderRadius: '10px',
    padding: '10px',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#00f0ff',
    transition: 'all 0.2s',
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
    margin: '0',
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
    margin: '0 0 12px 0',
  },
  skillGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  skillBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    border: '1px solid',
    background: 'transparent',
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
  quote: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    margin: 0,
    paddingLeft: '16px',
    borderLeft: '2px solid rgba(0, 240, 255, 0.4)',
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

export default AboutPanel;
