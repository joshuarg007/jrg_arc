// apps/web/src/components/showcase/HobbiesPanel.tsx
import React, { useState } from 'react';
import { ExpandedHobbiesPanel } from './ExpandedHobbiesPanel';

interface HobbiesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Hobby {
  name: string;
  icon: string;
  description: string;
  color: string;
}

const hobbies: Hobby[] = [
  {
    name: 'Hiking',
    icon: '🥾',
    description: 'Exploring trails, clearing the mind, and finding perspective in nature.',
    color: '#10b981',
  },
  {
    name: 'Working Out',
    icon: '💪',
    description: 'Staying strong and disciplined — a clear body supports a clear mind.',
    color: '#3b82f6',
  },
  {
    name: 'Reading',
    icon: '📚',
    description: 'Homer, Plato, Wheel of Time, Dark Tower, and the esoteric works of Eliphas Levi.',
    color: '#8b5cf6',
  },
  {
    name: 'Chess',
    icon: '♟️',
    description: 'Strategy, pattern recognition, and the endless pursuit of the perfect move.',
    color: '#f59e0b',
  },
  {
    name: 'Poker',
    icon: '🃏',
    description: 'Reading people, managing risk, and making decisions with incomplete information.',
    color: '#ef4444',
  },
  {
    name: 'Music',
    icon: '🎧',
    description: 'Chopin, Paganini, country, 90s rap, Grunge, and timeless oldies.',
    color: '#ec4899',
  },
];

export function HobbiesPanel({ isOpen, onClose }: HobbiesPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen) return null;

  // If expanded, show the full-screen panel
  if (isExpanded) {
    return <ExpandedHobbiesPanel isOpen={true} onClose={() => setIsExpanded(false)} />;
  }

  const accentColor = '#ff6b6b';

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
            Beyond Code
          </div>
          <h1 style={styles.title}>Hobbies & Interests</h1>
          <p style={styles.subtitle}>What keeps me inspired outside of work</p>
        </div>

        {/* Hobbies grid */}
        <div style={styles.section}>
          <div style={styles.hobbiesGrid}>
            {hobbies.map((hobby, index) => (
              <div
                key={index}
                style={{
                  ...styles.hobbyCard,
                  borderColor: hobby.color,
                }}
              >
                <div style={styles.hobbyHeader}>
                  <span style={styles.hobbyIcon}>{hobby.icon}</span>
                  <h4 style={{ ...styles.hobbyName, color: hobby.color }}>{hobby.name}</h4>
                </div>
                <p style={styles.hobbyDescription}>{hobby.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current interests */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Currently Exploring</h3>
          <ul style={styles.featureList}>
            {[
              'New hiking trails and outdoor adventures',
              'Esoteric philosophy and hermetic traditions',
              'Advanced chess openings and endgame theory',
              'Tournament poker strategy',
            ].map((item, index) => (
              <li key={index} style={styles.featureItem}>
                <span style={{ ...styles.bullet, background: accentColor }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Fun fact */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Fun Fact</h3>
          <p style={styles.funFact}>
            Chess and poker taught me that the best decisions come from patience,
            pattern recognition, and knowing when to take calculated risks.
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
    background: 'rgba(255, 107, 107, 0.1)',
    border: '1px solid rgba(255, 107, 107, 0.3)',
    borderRadius: '10px',
    padding: '10px',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#ff6b6b',
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
  hobbiesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  hobbyCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid',
    borderRadius: '10px',
    padding: '14px',
    transition: 'background 0.2s',
  },
  hobbyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  hobbyIcon: {
    fontSize: '20px',
  },
  hobbyName: {
    fontSize: '14px',
    fontWeight: '600',
    margin: 0,
  },
  hobbyDescription: {
    fontSize: '13px',
    lineHeight: '1.5',
    color: 'rgba(255, 255, 255, 0.6)',
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
  funFact: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
    padding: '12px',
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 107, 107, 0.2)',
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

export default HobbiesPanel;
