// apps/web/src/pages/ResumePage.tsx
import React, { useState, useEffect } from 'react';

interface ResumePageProps {
  onExit: () => void;
}

export function ResumePage({ onExit }: ResumePageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    // Fade in animation
    requestAnimationFrame(() => setIsVisible(true));

    // Handle ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  const skills = [
    { name: 'Python', category: 'language' },
    { name: 'TypeScript', category: 'language' },
    { name: 'React', category: 'framework' },
    { name: 'FastAPI', category: 'framework' },
    { name: 'Claude AI', category: 'ai' },
    { name: 'LangChain', category: 'ai' },
    { name: 'PostgreSQL', category: 'skill' },
    { name: 'Docker', category: 'devops' },
    { name: 'AWS', category: 'cloud' },
    { name: 'RAG Systems', category: 'ai' },
    { name: 'Qiskit', category: 'skill' },
    { name: 'Three.js', category: 'framework' },
  ];

  const categoryColors: Record<string, string> = {
    language: '#00f0ff',
    framework: '#8b5cf6',
    cloud: '#f59e0b',
    skill: '#10b981',
    devops: '#3b82f6',
    ai: '#ec4899',
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only trigger if clicking directly on the container (not content)
    if (e.target === e.currentTarget) {
      onExit();
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
      {/* Animated background gradient */}
      <div style={styles.backgroundGradient} />

      {/* Floating particles effect - subtle */}
      <div style={styles.particles}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.particle,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Exit button */}
      <button
        onClick={onExit}
        style={styles.exitButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 240, 255, 0.2)';
          e.currentTarget.style.borderColor = '#00f0ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
          e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Gallery</span>
      </button>

      {/* Main content with frame */}
      <div style={styles.contentFrame}>
        <div style={styles.content}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerGlow} />
          <h1 style={styles.name}>Joshua R. Gutierrez</h1>
          <div style={styles.contactRow}>
            <span style={styles.contactItem}>Las Cruces, NM 88007</span>
            <span style={styles.contactDivider}>|</span>
            <span style={styles.contactItem}>(575) 347-1862</span>
            <span style={styles.contactDivider}>|</span>
            <a href="mailto:labs@axiondeep.com" style={styles.contactLink}>labs@axiondeep.com</a>
          </div>
        </header>

        {/* Objective */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>&#9670;</span>
            Objective
          </h2>
          <p style={styles.objective}>
            Full-stack software engineer and entrepreneur with 10+ years building AI-powered SaaS platforms,
            security automation tools, and enterprise solutions. Founder of Axion Deep Labs, developing products
            spanning quantum computing education, autonomous penetration testing, and B2B integrations. Combines
            deep technical expertise in React, Python, and cloud infrastructure with hands-on leadership to ship
            production-grade systems that solve real problems.
          </p>
        </section>

        {/* Skills */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>&#9670;</span>
            Skills
          </h2>
          <div style={styles.skillsGrid}>
            {skills.map((skill) => (
              <span
                key={skill.name}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                style={{
                  ...styles.skillBadge,
                  borderColor: hoveredSkill === skill.name ? categoryColors[skill.category] : 'rgba(255, 255, 255, 0.2)',
                  color: hoveredSkill === skill.name ? categoryColors[skill.category] : 'rgba(255, 255, 255, 0.8)',
                  background: hoveredSkill === skill.name ? `${categoryColors[skill.category]}15` : 'transparent',
                  boxShadow: hoveredSkill === skill.name ? `0 0 20px ${categoryColors[skill.category]}30` : 'none',
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>

        {/* Employment */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>&#9670;</span>
            Employment
          </h2>

          <div style={styles.job}>
            <div style={styles.jobHeader}>
              <div>
                <h3 style={styles.jobTitle}>Founder & Lead Developer</h3>
                <div style={styles.company}>Axion Deep Labs</div>
              </div>
              <span style={styles.dateRange}>February 2019 - Present</span>
            </div>
            <p style={styles.jobDescription}>
              Building AI-powered software products across quantum computing education, security automation, and B2B SaaS.
              Developed QUANTA (quantum computing education), Vesper Hydra (autonomous pentesting with 11,697 templates),
              Site2CRM (AI lead capture with CRM sync), and Forma (visual React builder with AI generation).
            </p>
          </div>

          <div style={styles.job}>
            <div style={styles.jobHeader}>
              <div>
                <h3 style={styles.jobTitle}>Sales & Systems Integration Specialist</h3>
                <div style={styles.company}>Verizon</div>
              </div>
              <span style={styles.dateRange}>July 2021 - January 2026</span>
            </div>
            <p style={styles.jobDescription}>
              Combined technical knowledge with consultative sales to help customers adopt advanced network solutions.
              Diagnosed coverage concerns, optimized device and plan configurations, and delivered solutions improving
              reliability and performance.
            </p>
          </div>

          <div style={styles.job}>
            <div style={styles.jobHeader}>
              <div>
                <h3 style={styles.jobTitle}>Independent Software Consultant</h3>
                <div style={styles.company}>Custom Programming Ltd.</div>
              </div>
              <span style={styles.dateRange}>November 2014 - September 2023</span>
            </div>
            <p style={styles.jobDescription}>
              Built and collaborated to design and implement end-to-end software systems across diverse frameworks and cloud
              environments, creating full-stack applications with modern APIs, scalable databases, and AI-driven automation
              tailored to individual client's operational needs.
            </p>
          </div>
        </section>

        {/* Education */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>&#9670;</span>
            Education
          </h2>

          <div style={styles.educationGrid}>
            <div style={styles.educationItem}>
              <div style={styles.degree}>MS, Artificial Intelligence and Data Science</div>
              <div style={styles.school}>Colorado State University</div>
              <div style={styles.gpa}>GPA: 4.0</div>
            </div>
            <div style={styles.educationItem}>
              <div style={styles.degree}>BS, Computer Science</div>
              <div style={styles.school}>Colorado State University</div>
              <div style={styles.gpa}>GPA: 3.85</div>
            </div>
            <div style={styles.educationItem}>
              <div style={styles.degree}>AS, Mathematics</div>
              <div style={styles.school}>Community College of Denver</div>
              <div style={styles.gpa}>GPA: 3.80</div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>&#9670;</span>
            Projects
          </h2>

          {/* Projects Grid - 2 columns for better layout */}
          <div className="projects-grid" style={styles.projectsGrid}>
            <div style={styles.project}>
              <div style={styles.projectHeader}>
                <h3 style={styles.projectTitle}>Site2CRM (SLMS)</h3>
                <span style={styles.projectRole}>Solo Engineer</span>
              </div>
              <p style={styles.projectDescription}>
                Multi-tenant SaaS lead management system with real-time capture, intelligent routing, automated follow-ups,
                Stripe billing integration, and deep analytics dashboard.
              </p>
              <div style={styles.techStack}>
                <span style={styles.techLabel}>Stack:</span>
                <span style={styles.techItems}>TypeScript, React, FastAPI, PostgreSQL, Stripe, AWS, Docker</span>
              </div>
              <div style={styles.projectLinks}>
                <a href="https://site2crm.io" target="_blank" rel="noopener noreferrer" style={styles.liveLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                  Live
                </a>
                <a href="https://github.com/joshuarg007/slms" target="_blank" rel="noopener noreferrer" style={styles.githubLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>

            <div style={styles.project}>
              <div style={styles.projectHeader}>
                <h3 style={styles.projectTitle}>Vesper Hydra</h3>
                <span style={styles.projectRole}>Solo Engineer</span>
              </div>
              <p style={styles.projectDescription}>
                AI-powered bug bounty hunting platform with dual-agent architecture (Hunt + Advise), Neural Local Memory Network,
                HTTP proxy, fuzzer, Nuclei scanner integration, and OOB detection.
              </p>
              <div style={styles.techStack}>
                <span style={styles.techLabel}>Stack:</span>
                <span style={styles.techItems}>Python, PyQt6, Claude API, mitmproxy, Nuclei, interactsh</span>
              </div>
              <div style={styles.projectLinks}>
                <a href="https://axiondeep.com/solutions#vesper" target="_blank" rel="noopener noreferrer" style={styles.liveLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                  Live
                </a>
                <a href="https://github.com/joshuarg007/pentestAI" target="_blank" rel="noopener noreferrer" style={styles.githubLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>

            <div style={styles.project}>
              <div style={styles.projectHeader}>
                <h3 style={styles.projectTitle}>Forma</h3>
                <span style={styles.projectRole}>Solo Engineer</span>
              </div>
              <p style={styles.projectDescription}>
                Visual page builder like Elementor/Webflow with 100+ drag-and-drop components, AI-powered component generation
                using Claude, real-time preview, and export-ready pages.
              </p>
              <div style={styles.techStack}>
                <span style={styles.techLabel}>Stack:</span>
                <span style={styles.techItems}>Next.js, React, TypeScript, FastAPI, Claude API, Framer Motion</span>
              </div>
              <div style={styles.projectLinks}>
                <a href="https://made4founders.com" target="_blank" rel="noopener noreferrer" style={styles.liveLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                  Beta
                </a>
              </div>
            </div>

            <div style={styles.project}>
              <div style={styles.projectHeader}>
                <h3 style={styles.projectTitle}>QUANTA</h3>
                <span style={styles.projectRole}>Solo Engineer</span>
              </div>
              <p style={styles.projectDescription}>
                Visual quantum computing learning platform with drag-and-drop circuit builder, real-time Bloch sphere visualization,
                guided curriculum, and up to 16-qubit simulation powered by Qiskit.
              </p>
              <div style={styles.techStack}>
                <span style={styles.techLabel}>Stack:</span>
                <span style={styles.techItems}>React, TypeScript, Python, FastAPI, Qiskit, PostgreSQL</span>
              </div>
              <div style={styles.projectLinks}>
                <a href="https://axiondeep.com/solutions#quanta" target="_blank" rel="noopener noreferrer" style={styles.liveLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                  Live
                </a>
              </div>
            </div>

            <div style={styles.project}>
              <div style={styles.projectHeader}>
                <h3 style={styles.projectTitle}>Made4Founders</h3>
                <span style={styles.projectRole}>Solo Engineer</span>
              </div>
              <p style={styles.projectDescription}>
                All-in-one dashboard for startup founders featuring encrypted credential vault (AES-256), AI daily briefs,
                compliance tracking, document management, and business formation checklist.
              </p>
              <div style={styles.techStack}>
                <span style={styles.techLabel}>Stack:</span>
                <span style={styles.techItems}>React, TypeScript, FastAPI, SQLAlchemy, JWT, AES-256</span>
              </div>
              <div style={styles.projectLinks}>
                <a href="https://made4founders.com" target="_blank" rel="noopener noreferrer" style={styles.liveLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                  Live
                </a>
              </div>
            </div>

            <div style={styles.project}>
              <div style={styles.projectHeader}>
                <h3 style={styles.projectTitle}>SciVista / SummitVR</h3>
                <span style={styles.projectRole}>VR Research Assistant</span>
              </div>
              <p style={styles.projectDescription}>
                Interactive VR scientific visualization platform through NM Consortium and NMSU. Automatic component tagging,
                scroll-based selection, smart translucency visualization, and cross-platform VR support.
              </p>
              <div style={styles.techStack}>
                <span style={styles.techLabel}>Stack:</span>
                <span style={styles.techItems}>Unity, C#, VR SDK, Custom Shaders, Photon PUN2</span>
              </div>
              <div style={styles.projectLinks}>
                <a href="https://github.com/SciVista/SummitVR.Launcher-Release" target="_blank" rel="noopener noreferrer" style={styles.githubLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>

            <div style={styles.project}>
              <div style={styles.projectHeader}>
                <h3 style={styles.projectTitle}>Runemaul: Legacy of the Duke</h3>
                <span style={styles.projectRole}>Game Developer</span>
              </div>
              <p style={styles.projectDescription}>
                Tower defense game with unique maze-building mechanic for mobile. Features dynamic pathfinding, wave-based
                progression, tower placement strategy, and real-time enemy AI that adapts to player-created mazes.
              </p>
              <div style={styles.techStack}>
                <span style={styles.techLabel}>Stack:</span>
                <span style={styles.techItems}>Unity, C#, A* Pathfinding, Mobile UI, Object Pooling</span>
              </div>
              <div style={styles.projectLinks}>
                <a href="https://github.com/joshuarg007/Runemaul_LegacyOfTheDuke" target="_blank" rel="noopener noreferrer" style={styles.githubLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>

            <div style={styles.project}>
              <div style={styles.projectHeader}>
                <h3 style={styles.projectTitle}>LangChain Applications</h3>
                <span style={styles.projectRole}>AI Engineer</span>
              </div>
              <p style={styles.projectDescription}>
                Collection of AI-powered applications using LangChain and modern LLM frameworks. RAG systems, document Q&A,
                conversational agents, and multi-model orchestration in production environments.
              </p>
              <div style={styles.techStack}>
                <span style={styles.techLabel}>Stack:</span>
                <span style={styles.techItems}>Python, LangChain, OpenAI, Claude, FastAPI, Vector DBs</span>
              </div>
              <div style={styles.projectLinks}>
                <a href="https://github.com/joshuarg007/langchain" target="_blank" rel="noopener noreferrer" style={styles.githubLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerDivider} />
          <p style={styles.footerText}>
            Press <kbd style={styles.kbd}>ESC</kbd> or click the button above to return to the gallery
          </p>
        </footer>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.05; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: 0.1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #0a0a0f 100%)',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: '#fff',
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'opacity 0.5s ease-out',
    zIndex: 1000,
  },
  contentFrame: {
    maxWidth: 1000,
    margin: '80px auto 40px',
    padding: '48px',
    background: '#0a0a12',
    borderRadius: 20,
    border: '1px solid rgba(0, 240, 255, 0.12)',
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 240, 255, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    position: 'relative',
    zIndex: 1,
  },
  backgroundGradient: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(ellipse at 20% 10%, rgba(0, 240, 255, 0.015) 0%, transparent 40%), radial-gradient(ellipse at 80% 90%, rgba(139, 92, 246, 0.015) 0%, transparent 40%)',
    pointerEvents: 'none',
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
    background: 'rgba(0, 240, 255, 0.08)',
    borderRadius: '50%',
    animation: 'float 25s infinite ease-in-out',
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
    border: '1px solid rgba(0, 240, 255, 0.3)',
    borderRadius: 8,
    color: '#00f0ff',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  content: {
    maxWidth: 900,
    margin: '0 auto',
    padding: 0,
    position: 'relative',
  },
  header: {
    textAlign: 'center',
    marginBottom: 60,
    position: 'relative',
  },
  headerGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 200,
    background: 'radial-gradient(ellipse, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  name: {
    fontSize: 48,
    fontWeight: 700,
    margin: 0,
    background: 'linear-gradient(135deg, #ffffff 0%, #00f0ff 50%, #8b5cf6 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },
  contactRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  contactItem: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
  },
  contactDivider: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  contactLink: {
    color: '#00f0ff',
    textDecoration: 'none',
    fontSize: 15,
    transition: 'color 0.2s',
  },
  section: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#00f0ff',
    margin: '0 0 20px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  sectionIcon: {
    fontSize: 10,
    opacity: 0.6,
  },
  objective: {
    fontSize: 17,
    lineHeight: 1.8,
    color: 'rgba(255, 255, 255, 0.92)',
    margin: 0,
    paddingLeft: 20,
    borderLeft: '2px solid rgba(0, 240, 255, 0.4)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
  },
  skillsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillBadge: {
    padding: '8px 16px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  job: {
    marginBottom: 32,
    padding: 24,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#ffffff',
    margin: 0,
  },
  company: {
    fontSize: 15,
    color: '#8b5cf6',
    marginTop: 4,
  },
  dateRange: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    whiteSpace: 'nowrap',
  },
  jobDescription: {
    fontSize: 15,
    lineHeight: 1.7,
    color: 'rgba(255, 255, 255, 0.88)',
    margin: 0,
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
  },
  educationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 20,
  },
  educationItem: {
    padding: 20,
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  degree: {
    fontSize: 16,
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: 6,
  },
  school: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  gpa: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: 500,
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 20,
  },
  project: {
    padding: 20,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(0, 240, 255, 0.02) 100%)',
    borderRadius: 12,
    border: '1px solid rgba(0, 240, 255, 0.12)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#ffffff',
    margin: 0,
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
  },
  projectRole: {
    fontSize: 10,
    color: '#00f0ff',
    background: 'rgba(0, 240, 255, 0.12)',
    padding: '3px 10px',
    borderRadius: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  projectDescription: {
    fontSize: 14,
    lineHeight: 1.65,
    color: 'rgba(255, 255, 255, 0.88)',
    margin: '0 0 12px 0',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
  },
  techStack: {
    fontSize: 12,
    marginBottom: 6,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
  },
  techLabel: {
    color: 'rgba(0, 240, 255, 0.7)',
    fontWeight: 600,
  },
  techItems: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  projectLinks: {
    display: 'flex',
    gap: 8,
    marginTop: 10,
  },
  liveLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 10px',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: 5,
    color: '#10b981',
    fontSize: 11,
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  githubLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 10px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: 5,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  footer: {
    marginTop: 60,
    textAlign: 'center',
  },
  footerDivider: {
    width: 60,
    height: 2,
    background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5), transparent)',
    margin: '0 auto 20px',
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

export default ResumePage;
