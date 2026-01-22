// apps/web/src/components/showcase/ContactPanel.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ExpandedContactPanel } from './ExpandedContactPanel';

interface ContactPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeadData {
  email: string;
  phone: string;
  name: string;
  message: string;
  source: string;
  capturedAt: string;
}

// Site2CRM API endpoint - configure via env or use default
const SITE2CRM_ENDPOINT = import.meta.env.VITE_SITE2CRM_ENDPOINT || 'https://site2crm.io/api/leads';
const SITE2CRM_API_KEY = import.meta.env.VITE_SITE2CRM_API_KEY || '';

async function pushToSite2CRM(data: Partial<LeadData>): Promise<boolean> {
  try {
    const payload = {
      ...data,
      source: 'quantum-gallery',
      capturedAt: new Date().toISOString(),
    };

    // If no API key configured, log to console (dev mode)
    if (!SITE2CRM_API_KEY) {
      console.log('[Site2CRM] Lead captured:', payload);
      return true;
    }

    const response = await fetch(SITE2CRM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SITE2CRM_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error) {
    console.error('[Site2CRM] Failed to push lead:', error);
    return false;
  }
}

export function ContactPanel({ isOpen, onClose }: ContactPanelProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [capturedEmail, setCapturedEmail] = useState(false);
  const [capturedPhone, setCapturedPhone] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const phoneTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validate email format
  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // Validate phone format (basic - at least 10 digits)
  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10;
  };

  // Capture email immediately when valid
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);

    // Clear previous timeout
    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current);
    }

    // Debounce and capture when valid
    if (isValidEmail(value) && !capturedEmail) {
      emailTimeoutRef.current = setTimeout(() => {
        pushToSite2CRM({ email: value });
        setCapturedEmail(true);
      }, 500);
    }
  }, [capturedEmail]);

  // Capture phone immediately when valid
  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value);

    // Clear previous timeout
    if (phoneTimeoutRef.current) {
      clearTimeout(phoneTimeoutRef.current);
    }

    // Debounce and capture when valid
    if (isValidPhone(value) && !capturedPhone) {
      phoneTimeoutRef.current = setTimeout(() => {
        pushToSite2CRM({ phone: value, email: email || undefined });
        setCapturedPhone(true);
      }, 500);
    }
  }, [capturedPhone, email]);

  // Full form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email && !phone) return;

    await pushToSite2CRM({
      email: email || undefined,
      phone: phone || undefined,
      name: name || undefined,
      message: message || undefined,
    });

    setSubmitted(true);
  };

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      // Don't reset captured flags - we don't want to recapture same session
      setSubmitted(false);
    }
  }, [isOpen]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (emailTimeoutRef.current) clearTimeout(emailTimeoutRef.current);
      if (phoneTimeoutRef.current) clearTimeout(phoneTimeoutRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // If expanded, show the full-screen panel
  if (isExpanded) {
    return <ExpandedContactPanel isOpen={true} onClose={() => setIsExpanded(false)} />;
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
            Open Channel
          </div>
          <h1 style={styles.title}>Get In Touch</h1>
          <p style={styles.subtitle}>Let's build something amazing together</p>
        </div>

        {submitted ? (
          /* Success state */
          <div style={styles.section}>
            <div style={styles.successBox}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h3 style={{ ...styles.sectionTitle, marginTop: 16, color: accentColor }}>
                Message Received
              </h3>
              <p style={styles.description}>
                Thanks for reaching out! I'll get back to you within 24 hours.
              </p>
            </div>
          </div>
        ) : (
          /* Contact form */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Email field - captures immediately */}
            <div style={styles.section}>
              <label style={styles.label}>
                Email {capturedEmail && <span style={styles.capturedBadge}>Saved</span>}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="your@email.com"
                style={{
                  ...styles.input,
                  borderColor: capturedEmail ? accentColor : 'rgba(255,255,255,0.2)',
                }}
              />
            </div>

            {/* Phone field - captures immediately */}
            <div style={styles.section}>
              <label style={styles.label}>
                Phone {capturedPhone && <span style={styles.capturedBadge}>Saved</span>}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+1 (555) 123-4567"
                style={{
                  ...styles.input,
                  borderColor: capturedPhone ? accentColor : 'rgba(255,255,255,0.2)',
                }}
              />
            </div>

            {/* Name field */}
            <div style={styles.section}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={styles.input}
              />
            </div>

            {/* Message field */}
            <div style={styles.section}>
              <label style={styles.label}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your project..."
                rows={4}
                style={{ ...styles.input, resize: 'vertical', minHeight: 100 }}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!email && !phone}
              style={{
                ...styles.submitButton,
                background: (email || phone) ? accentColor : 'rgba(255,255,255,0.1)',
                color: (email || phone) ? '#000' : 'rgba(255,255,255,0.4)',
                cursor: (email || phone) ? 'pointer' : 'not-allowed',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Send Message
            </button>

            {/* Quick actions */}
            <div style={styles.quickActions}>
              <a
                href="mailto:labs@axiondeep.com"
                style={styles.quickLink}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                labs@axiondeep.com
              </a>
              <a
                href="https://linkedin.com/in/joshua-gutierrez-b198117a"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.quickLink}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </form>
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
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255, 255, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  capturedBadge: {
    fontSize: '9px',
    padding: '2px 6px',
    borderRadius: '4px',
    background: 'rgba(0, 240, 255, 0.2)',
    color: '#00f0ff',
    textTransform: 'uppercase',
  },
  input: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '14px 16px',
    fontSize: '15px',
    color: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.3s, background 0.3s',
    fontFamily: 'inherit',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    transition: 'all 0.3s',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  successBox: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  description: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: '12px 0 0 0',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: '0',
  },
  quickActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    paddingTop: '8px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  quickLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    textDecoration: 'none',
    transition: 'color 0.2s',
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

export default ContactPanel;
