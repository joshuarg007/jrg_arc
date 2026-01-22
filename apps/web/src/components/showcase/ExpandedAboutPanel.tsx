// apps/web/src/components/showcase/ExpandedAboutPanel.tsx
import React from 'react';
import { ExpandableFrame } from '../ExpandableFrame';

interface ExpandedAboutPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpandedAboutPanel({ isOpen, onClose }: ExpandedAboutPanelProps) {
  if (!isOpen) return null;

  const accentColor = '#00f0ff';

  return (
    <ExpandableFrame
      title="Joshua Gutierrez"
      subtitle="Software Engineer & Technology Architect"
      accentColor={accentColor}
      onClose={onClose}
    >
      {/* Hero Section with Photo */}
      <section style={styles.heroSection}>
        <div style={styles.photoContainer}>
          {/* PLACEHOLDER: profile-photo.jpg - Professional headshot, 400x400px */}
          <div style={styles.photoPlaceholder}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <span style={styles.placeholderText}>profile-photo.jpg</span>
          </div>
        </div>
        <div style={styles.heroContent}>
          <p style={styles.heroText}>
            Full-stack software engineer and entrepreneur with 10+ years building AI-powered SaaS platforms,
            security automation tools, and enterprise solutions. Founder of Axion Deep Labs, developing products
            spanning quantum computing education, autonomous penetration testing, and B2B integrations.
          </p>
          <div style={styles.quickStats}>
            <div style={styles.stat}>
              <span style={styles.statNumber}>10+</span>
              <span style={styles.statLabel}>Years Experience</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>50+</span>
              <span style={styles.statLabel}>Projects Shipped</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>4.0</span>
              <span style={styles.statLabel}>MS GPA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Background Story */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>01</span>
          Background
        </h2>
        <div style={styles.storyGrid}>
          <div style={styles.storyCard}>
            <h4 style={styles.storyTitle}>The Beginning</h4>
            <p style={styles.storyText}>
              My journey into technology started with curiosity about how systems work. What began as tinkering
              with computers evolved into a deep passion for software engineering and system design.
            </p>
          </div>
          <div style={styles.storyCard}>
            <h4 style={styles.storyTitle}>Education</h4>
            <p style={styles.storyText}>
              MS in AI & Data Science and BS in Computer Science from Colorado State University provided the
              theoretical foundation, while hands-on projects developed practical expertise.
            </p>
          </div>
          <div style={styles.storyCard}>
            <h4 style={styles.storyTitle}>Today</h4>
            <p style={styles.storyText}>
              Through Axion Deep Labs, I design and develop technology solutions that push boundaries while
              maintaining focus on user experience and technical excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Deep Dive */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>02</span>
          Technical Expertise
        </h2>
        <div style={styles.skillsDeep}>
          {[
            {
              category: 'Languages',
              skills: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Go'],
              color: '#00f0ff',
            },
            {
              category: 'Frontend',
              skills: ['React', 'Vite', 'Next.js', 'Tailwind CSS', 'Three.js'],
              color: '#8b5cf6',
            },
            {
              category: 'Backend',
              skills: ['FastAPI', 'Node.js', 'SQLAlchemy', 'REST APIs', 'PostgreSQL'],
              color: '#10b981',
            },
            {
              category: 'DevOps',
              skills: ['Docker', 'AWS', 'GitHub Actions', 'Nginx', 'CI/CD'],
              color: '#f59e0b',
            },
            {
              category: 'AI/ML',
              skills: ['Claude AI', 'LangChain', 'Ollama', 'RAG Systems', 'Qiskit'],
              color: '#ec4899',
            },
            {
              category: 'Security',
              skills: ['AES-256', 'JWT Auth', 'OAuth', 'Penetration Testing'],
              color: '#3b82f6',
            },
          ].map((group, i) => (
            <div key={i} style={styles.skillGroup}>
              <h4 style={{ ...styles.skillCategory, color: group.color }}>{group.category}</h4>
              <div style={styles.skillTags}>
                {group.skills.map((skill, j) => (
                  <span
                    key={j}
                    style={{
                      ...styles.skillTag,
                      borderColor: `${group.color}50`,
                      color: group.color,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>03</span>
          Gallery
        </h2>
        <div style={styles.gallery}>
          {/* PLACEHOLDER IMAGES */}
          {[
            { name: 'about-workspace.jpg', desc: 'Workspace/office setup photo' },
            { name: 'about-conference.jpg', desc: 'Speaking at conference or team meeting' },
            { name: 'about-coding.jpg', desc: 'Working on code/multiple monitors' },
            { name: 'about-outdoors.jpg', desc: 'Hiking or outdoor activity' },
          ].map((img, i) => (
            <div key={i} style={styles.galleryItem}>
              <div style={styles.imagePlaceholder}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span style={styles.imagePlaceholderText}>{img.name}</span>
                <span style={styles.imagePlaceholderDesc}>{img.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>04</span>
          Philosophy
        </h2>
        <blockquote style={styles.quote}>
          "Build fast, build secure, build with intention. Technology should serve humanity's potential, not complicate it."
        </blockquote>
        <div style={styles.values}>
          {[
            { icon: '🎯', title: 'Precision', desc: 'Every line of code matters. Quality over quantity.' },
            { icon: '🚀', title: 'Innovation', desc: 'Push boundaries while maintaining stability.' },
            { icon: '🤝', title: 'Collaboration', desc: 'Best solutions emerge from diverse perspectives.' },
            { icon: '📚', title: 'Growth', desc: 'Continuous learning is non-negotiable.' },
          ].map((value, i) => (
            <div key={i} style={styles.valueCard}>
              <span style={styles.valueIcon}>{value.icon}</span>
              <h4 style={styles.valueTitle}>{value.title}</h4>
              <p style={styles.valueDesc}>{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </ExpandableFrame>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heroSection: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    gap: 32,
    marginBottom: 40,
    alignItems: 'start',
  },
  photoContainer: {
    position: 'relative',
  },
  photoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 16,
    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    border: '2px dashed rgba(255, 255, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'monospace',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  heroText: {
    fontSize: 17,
    lineHeight: 1.8,
    color: 'rgba(255, 255, 255, 0.9)',
    margin: 0,
  },
  quickStats: {
    display: 'flex',
    gap: 32,
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 700,
    color: '#00f0ff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  section: {
    marginBottom: 40,
    paddingTop: 32,
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#00f0ff',
    margin: '0 0 24px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: 'monospace',
  },
  storyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 20,
  },
  storyCard: {
    padding: 20,
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  storyTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 8px 0',
  },
  storyText: {
    fontSize: 14,
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
  },
  skillsDeep: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
  },
  skillGroup: {
    padding: 16,
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
  },
  skillCategory: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: '0 0 12px 0',
  },
  skillTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    padding: '5px 10px',
    borderRadius: 5,
    fontSize: 12,
    border: '1px solid',
    background: 'transparent',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  galleryItem: {
    aspectRatio: '1',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
    border: '1px dashed rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
  },
  imagePlaceholderText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  imagePlaceholderDesc: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
  },
  quote: {
    fontSize: 18,
    lineHeight: 1.7,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    margin: '0 0 24px 0',
    padding: '20px 24px',
    borderLeft: '3px solid #00f0ff',
    background: 'rgba(0, 240, 255, 0.05)',
    borderRadius: '0 8px 8px 0',
  },
  values: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  valueCard: {
    padding: 20,
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    textAlign: 'center',
  },
  valueIcon: {
    fontSize: 28,
    display: 'block',
    marginBottom: 12,
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 6px 0',
  },
  valueDesc: {
    fontSize: 12,
    lineHeight: 1.5,
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
};

export default ExpandedAboutPanel;
