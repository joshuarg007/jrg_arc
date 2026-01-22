// apps/web/src/components/ExpandableFrame.tsx
import React, { useState, useEffect, ReactNode } from 'react';

interface ExpandableFrameProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  accentColor?: string;
  onClose: () => void;
}

export function ExpandableFrame({
  children,
  title,
  subtitle,
  accentColor = '#00f0ff',
  onClose,
}: ExpandableFrameProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scanLinePos, setScanLinePos] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Scan line animation
    const scanInterval = setInterval(() => {
      setScanLinePos((prev) => (prev + 1) % 100);
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(scanInterval);
    };
  }, [onClose]);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        opacity: isVisible ? 1 : 0,
      }}
      onClick={handleBackgroundClick}
    >
      {/* Animated background with grid */}
      <div style={styles.backgroundGrid} />
      <div style={styles.backgroundGradient} />

      {/* Scan line effect */}
      <div
        style={{
          ...styles.scanLine,
          top: `${scanLinePos}%`,
          background: `linear-gradient(90deg, transparent, ${accentColor}15, transparent)`,
        }}
      />

      {/* Corner accents */}
      <div style={{ ...styles.cornerAccent, ...styles.cornerTL, borderColor: accentColor }} />
      <div style={{ ...styles.cornerAccent, ...styles.cornerTR, borderColor: accentColor }} />
      <div style={{ ...styles.cornerAccent, ...styles.cornerBL, borderColor: accentColor }} />
      <div style={{ ...styles.cornerAccent, ...styles.cornerBR, borderColor: accentColor }} />

      {/* Floating particles */}
      <div style={styles.particles}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.particle,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${20 + Math.random() * 15}s`,
              background: i % 3 === 0 ? accentColor : i % 3 === 1 ? '#8b5cf6' : '#10b981',
              opacity: 0.15,
            }}
          />
        ))}
      </div>

      {/* Exit button */}
      <button
        onClick={onClose}
        style={{
          ...styles.exitButton,
          borderColor: `${accentColor}50`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${accentColor}20`;
          e.currentTarget.style.borderColor = accentColor;
          e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
          e.currentTarget.style.borderColor = `${accentColor}50`;
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Gallery</span>
      </button>

      {/* Main content frame */}
      <div style={styles.frameWrapper}>
        {/* Animated border glow */}
        <div
          style={{
            ...styles.borderGlow,
            background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
          }}
        />

        <div style={styles.contentFrame}>
          {/* Header with animated underline */}
          <header style={styles.header}>
            <div
              style={{
                ...styles.headerGlow,
                background: `radial-gradient(ellipse, ${accentColor}20 0%, transparent 70%)`,
              }}
            />
            <h1 style={styles.title}>{title}</h1>
            {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
            <div
              style={{
                ...styles.headerLine,
                background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              }}
            />
          </header>

          {/* Scrollable content */}
          <div style={styles.content}>{children}</div>

          {/* Footer */}
          <footer style={styles.footer}>
            <div
              style={{
                ...styles.footerLine,
                background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`,
              }}
            />
            <p style={styles.footerText}>
              Press <kbd style={styles.kbd}>ESC</kbd> or click outside to close
            </p>
          </footer>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes frameFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.2; }
        }
        @keyframes borderPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes cornerGlow {
          0%, 100% { box-shadow: 0 0 5px currentColor; }
          50% { box-shadow: 0 0 15px currentColor, 0 0 30px currentColor; }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(135deg, #05050a 0%, #0a0a12 50%, #050508 100%)',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: '#fff',
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'opacity 0.4s ease-out',
    zIndex: 1000,
  },
  backgroundGrid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
  },
  backgroundGradient: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(ellipse at 30% 20%, rgba(0, 240, 255, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.04) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  scanLine: {
    position: 'fixed',
    left: 0,
    right: 0,
    height: 2,
    pointerEvents: 'none',
    zIndex: 1,
  },
  cornerAccent: {
    position: 'fixed',
    width: 40,
    height: 40,
    borderStyle: 'solid',
    borderWidth: 2,
    zIndex: 2,
    animation: 'cornerGlow 3s ease-in-out infinite',
  },
  cornerTL: {
    top: 20,
    left: 20,
    borderRight: 'none',
    borderBottom: 'none',
  },
  cornerTR: {
    top: 20,
    right: 20,
    borderLeft: 'none',
    borderBottom: 'none',
  },
  cornerBL: {
    bottom: 20,
    left: 20,
    borderRight: 'none',
    borderTop: 'none',
  },
  cornerBR: {
    bottom: 20,
    right: 20,
    borderLeft: 'none',
    borderTop: 'none',
  },
  particles: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: '50%',
    animation: 'frameFloat 25s infinite ease-in-out',
  },
  exitButton: {
    position: 'fixed',
    top: 24,
    left: 24,
    zIndex: 1001,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid',
    borderRadius: 8,
    color: '#00f0ff',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  frameWrapper: {
    maxWidth: 1000,
    margin: '80px auto 40px',
    position: 'relative',
    zIndex: 1,
  },
  borderGlow: {
    position: 'absolute',
    top: -1,
    left: '10%',
    right: '10%',
    height: 2,
    animation: 'borderPulse 2s ease-in-out infinite',
    borderRadius: 1,
  },
  contentFrame: {
    background: '#0a0a12',
    borderRadius: 20,
    border: '1px solid rgba(0, 240, 255, 0.12)',
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 240, 255, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
    animation: 'slideIn 0.5s ease-out',
  },
  header: {
    textAlign: 'center',
    padding: '48px 48px 32px',
    position: 'relative',
  },
  headerGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 200,
    pointerEvents: 'none',
    animation: 'glowPulse 4s ease-in-out infinite',
  },
  title: {
    fontSize: 42,
    fontWeight: 700,
    margin: 0,
    background: 'linear-gradient(135deg, #ffffff 0%, #00f0ff 50%, #8b5cf6 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
    textShadow: '0 0 40px rgba(0, 240, 255, 0.3)',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '8px 0 0',
    letterSpacing: '0.05em',
  },
  headerLine: {
    width: 120,
    height: 2,
    margin: '24px auto 0',
    borderRadius: 1,
  },
  content: {
    padding: '0 48px 48px',
  },
  footer: {
    padding: '24px 48px 32px',
    textAlign: 'center',
  },
  footerLine: {
    width: 60,
    height: 2,
    margin: '0 auto 20px',
    borderRadius: 1,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  kbd: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    fontFamily: 'monospace',
    fontSize: 12,
  },
};

export default ExpandableFrame;
