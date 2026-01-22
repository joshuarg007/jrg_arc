// apps/web/src/components/showcase/ExpandedContactPanel.tsx
import React, { useState } from 'react';
import { ExpandableFrame } from '../ExpandableFrame';

interface ExpandedContactPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpandedContactPanel({ isOpen, onClose }: ExpandedContactPanelProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const accentColor = '#10b981';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Contact] Form submitted:', formData);
    setSubmitted(true);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ExpandableFrame
      title="Get In Touch"
      subtitle="Let's build something amazing together"
      accentColor={accentColor}
      onClose={onClose}
    >
      <div style={styles.container}>
        {/* Left: Contact Info */}
        <div style={styles.infoColumn}>
          {/* Direct Contact */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Direct Contact</h3>
            <div style={styles.contactMethods}>
              <a href="mailto:labs@axiondeep.com" style={styles.contactMethod}>
                <div style={{ ...styles.contactIcon, background: `${accentColor}20` }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <span style={styles.contactLabel}>Email</span>
                  <span style={styles.contactValue}>labs@axiondeep.com</span>
                </div>
              </a>

              <a href="tel:+15753471862" style={styles.contactMethod}>
                <div style={{ ...styles.contactIcon, background: 'rgba(139, 92, 246, 0.2)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <span style={styles.contactLabel}>Phone</span>
                  <span style={styles.contactValue}>(575) 347-1862</span>
                </div>
              </a>

              <div style={styles.contactMethod}>
                <div style={{ ...styles.contactIcon, background: 'rgba(245, 158, 11, 0.2)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <span style={styles.contactLabel}>Location</span>
                  <span style={styles.contactValue}>Las Cruces, NM</span>
                </div>
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Connect</h3>
            <div style={styles.socialGrid}>
              {[
                { name: 'LinkedIn', url: 'https://linkedin.com/in/joshuargutierrez', color: '#0077b5' },
                { name: 'GitHub', url: 'https://github.com/joshuarg007', color: '#fff' },
                { name: 'Twitter/X', url: 'https://twitter.com/axiondeep', color: '#1da1f2' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...styles.socialLink,
                    borderColor: `${social.color}40`,
                  }}
                >
                  <span style={{ color: social.color }}>{social.name}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              ))}
            </div>
          </section>

          {/* Availability */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Availability</h3>
            <div style={styles.availabilityCard}>
              <div style={styles.statusIndicator}>
                <span style={styles.statusDot} />
                <span style={styles.statusText}>Available for new projects</span>
              </div>
              <p style={styles.availabilityText}>
                Currently accepting select consulting engagements and full-stack development projects.
                Response time: typically within 24 hours.
              </p>
            </div>
          </section>

          {/* Services Quick List */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Services</h3>
            <div style={styles.servicesList}>
              {[
                'Full-Stack Development',
                'Cloud Architecture',
                'AI/ML Integration',
                'Technical Consulting',
                'VR/AR Development',
                'API Design & Development',
              ].map((service, i) => (
                <div key={i} style={styles.serviceItem}>
                  <span style={{ ...styles.serviceDot, background: accentColor }} />
                  {service}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Contact Form */}
        <div style={styles.formColumn}>
          {submitted ? (
            <div style={styles.successState}>
              <div style={styles.successIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 style={styles.successTitle}>Message Sent!</h3>
              <p style={styles.successText}>
                Thank you for reaching out. I'll review your message and get back to you within 24 hours.
              </p>
              <button
                style={styles.resetButton}
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', company: '', projectType: '', budget: '', message: '' });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              <h3 style={styles.formTitle}>Start a Conversation</h3>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your name"
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Company name"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Project Type</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => handleChange('projectType', e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select type...</option>
                    <option value="web">Web Application</option>
                    <option value="mobile">Mobile App</option>
                    <option value="ai">AI/ML Project</option>
                    <option value="cloud">Cloud Architecture</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Budget Range</label>
                <div style={styles.budgetOptions}>
                  {['< $10k', '$10k - $25k', '$25k - $50k', '$50k - $100k', '$100k+'].map((budget, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleChange('budget', budget)}
                      style={{
                        ...styles.budgetOption,
                        background: formData.budget === budget ? accentColor : 'transparent',
                        color: formData.budget === budget ? '#000' : 'rgba(255,255,255,0.7)',
                        borderColor: formData.budget === budget ? accentColor : 'rgba(255,255,255,0.2)',
                      }}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Project Details *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Tell me about your project, goals, timeline, and any specific requirements..."
                  required
                  rows={6}
                  style={{ ...styles.input, resize: 'vertical' }}
                />
              </div>

              <button type="submit" style={styles.submitButton}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </ExpandableFrame>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: 40,
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
  formColumn: {
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 32,
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
  },
  contactMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  contactMethod: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    textDecoration: 'none',
    transition: 'background 0.2s',
    cursor: 'pointer',
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: {
    display: 'block',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  contactValue: {
    display: 'block',
    fontSize: 15,
    color: '#fff',
    fontWeight: 500,
  },
  socialGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderRadius: 8,
    border: '1px solid',
    textDecoration: 'none',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    transition: 'all 0.2s',
  },
  availabilityCard: {
    padding: 16,
    background: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 10,
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 8px #10b981',
    animation: 'pulse 2s infinite',
  },
  statusText: {
    fontSize: 13,
    fontWeight: 600,
    color: '#10b981',
  },
  availabilityText: {
    fontSize: 13,
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
  },
  servicesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 8,
  },
  serviceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  serviceDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 24px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    padding: '14px 16px',
    fontSize: 15,
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  },
  select: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    padding: '14px 16px',
    fontSize: 15,
    color: '#fff',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  budgetOptions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  budgetOption: {
    padding: '8px 14px',
    borderRadius: 6,
    border: '1px solid',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '16px 24px',
    background: '#10b981',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    color: '#000',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: 8,
  },
  successState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '60px 40px',
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#10b981',
    margin: '0 0 12px 0',
  },
  successText: {
    fontSize: 15,
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.7)',
    margin: '0 0 24px 0',
  },
  resetButton: {
    padding: '12px 20px',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default ExpandedContactPanel;
