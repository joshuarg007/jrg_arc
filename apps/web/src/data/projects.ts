// apps/web/src/data/projects.ts
import type { ProjectNode } from '@core/types/project';

// Orbital positions calculated for symmetric arrangement
// Inner ring: 3 nodes at 120° intervals
// Outer ring: 6 nodes at 60° intervals
const ORBIT_RADIUS = 5.5;
const INNER_ORBIT = 3.2;

// Eyeball orbital shape parameters
// Front (close to user, +z) = well below center
// Back (far from user, -z) = well above center
const Z_SCALE = 1.2;      // +20% wider on z-axis
const TILT_FACTOR = 0.35; // How tilted the disc is (y = -z * TILT_FACTOR)
const MARGIN = 0.85;      // 15% margin from extremes

// Helper for circular positions with tilted disc shape
const toRad = (deg: number) => (deg * Math.PI) / 180;
const innerPos = (deg: number): [number, number, number] => {
  const rad = toRad(deg);
  const x = Math.cos(rad) * INNER_ORBIT;
  const z = Math.sin(rad) * INNER_ORBIT * Z_SCALE;
  const y = -z * TILT_FACTOR * MARGIN;  // y directly proportional to z
  return [x, y, z];
};
const outerPos = (deg: number): [number, number, number] => {
  const rad = toRad(deg);
  const x = Math.cos(rad) * ORBIT_RADIUS;
  const z = Math.sin(rad) * ORBIT_RADIUS * Z_SCALE;
  const y = -z * TILT_FACTOR * MARGIN;  // same tilt angle, outer has more displacement
  return [x, y, z];
};

export const projects: ProjectNode[] = [
  // === INNER RING (3 live projects at 120° intervals) ===
  {
    id: 'axiondeep',
    title: 'Axion Deep Labs',
    subtitle: 'Technology Studio',
    modelType: 'crystal',
    position: innerPos(0),
    color: '#00f0ff',
    glowColor: '#00f0ff',
    status: 'live',
    orbitRadius: INNER_ORBIT,
    orbitSpeed: 0.12,
    rotationSpeed: 0.3,
    showcase: {
      description:
        'Axion Deep Labs is the home for advanced software engineering, cloud architecture, and AI-driven systems. It represents an approach to building technology that is fast, secure, and deeply integrated across platforms. Through Axion Deep Labs, I design and develop full-stack applications, automation tools, and scalable cloud solutions that reflect both technical expertise and commitment to thoughtful, modern engineering.',
      role: 'Founder & CEO',
      techStack: [
        'TypeScript',
        'Python',
        'React',
        'Node.js',
        'AWS',
        'PostgreSQL',
        'Docker',
        'Kubernetes',
      ],
      features: [
        'Full-stack application development',
        'Cloud architecture & DevOps',
        'AI/ML integration',
        'Automation & tooling',
        'Scalable system design',
      ],
      links: [
        { label: 'Website', url: 'https://axiondeep.com', icon: 'external' },
      ],
      media: [
        { type: 'image', src: '/assets/projects/axiondeep-hero.png', alt: 'Axion Deep Labs Homepage' },
      ],
    },
  },

  {
    id: 'slms',
    title: 'SLMS',
    subtitle: 'Lead Management System',
    modelType: 'funnel',
    position: innerPos(120),
    color: '#10b981',
    glowColor: '#34d399',
    status: 'live',
    orbitRadius: INNER_ORBIT,
    orbitSpeed: 0.12,
    rotationSpeed: 0.5,
    showcase: {
      description:
        'Site2CRM (SLMS) is a comprehensive SaaS lead management system engineered from the ground up. It features real-time lead capture, intelligent routing, automated follow-ups, and deep analytics. Built with a modern stack and integrated with Stripe for subscription billing.',
      role: 'Solo Engineer',
      techStack: [
        'TypeScript',
        'React',
        'Node.js',
        'PostgreSQL',
        'Stripe',
        'AWS',
        'Docker',
      ],
      features: [
        'Real-time lead capture & routing',
        'Automated email sequences',
        'Stripe billing integration',
        'Role-based access control',
        'Analytics dashboard',
        'Webhook integrations',
      ],
      links: [
        { label: 'Live Demo', url: 'https://site2crm.io', icon: 'demo' },
      ],
      media: [
        { type: 'image', src: '/assets/projects/slms-dashboard.png', alt: 'SLMS Dashboard' },
        { type: 'image', src: '/assets/projects/slms-leads.png', alt: 'SLMS Lead Management' },
      ],
    },
  },

  {
    id: 'scivista',
    title: 'SciVista',
    subtitle: 'VR Component Selector',
    modelType: 'exploded',
    position: innerPos(240),
    color: '#f59e0b',
    glowColor: '#fbbf24',
    status: 'live',
    orbitRadius: INNER_ORBIT,
    orbitSpeed: 0.12,
    rotationSpeed: 0.4,
    showcase: {
      description:
        'SciVista Component Selector is part of a VR ecosystem that revolutionizes 3D model interaction. Load any model and it automatically tags every component, allowing users to scroll through parts, grab selected components, and visualize hierarchies through intelligent translucency — the whole model fades to one shade while component groups highlight in distinct colors.',
      role: 'Lead Developer',
      techStack: [
        'Unity',
        'C#',
        'VR SDK',
        'Custom Shaders',
        '3D Model Processing',
      ],
      features: [
        'Automatic component tagging',
        'Intuitive scroll-based selection',
        'Grab & inspect interactions',
        'Smart translucency visualization',
        'Component group highlighting',
        'Cross-platform VR support',
      ],
      links: [],
      media: [
        { type: 'image', src: '/assets/projects/scivista-vr.png', alt: 'SciVista VR Interface' },
        { type: 'video', src: '/assets/projects/scivista-demo.mp4', alt: 'SciVista Demo Video' },
      ],
    },
  },

  // === OUTER RING (6 nodes at 60° intervals) ===
  {
    id: 'langchain',
    title: 'LangChain Apps',
    subtitle: 'LLM-Powered Solutions',
    modelType: 'neural',
    position: outerPos(30),
    color: '#8b5cf6',
    glowColor: '#a78bfa',
    status: 'live',
    orbitRadius: ORBIT_RADIUS,
    orbitSpeed: 0.08,
    rotationSpeed: 0.6,
    showcase: {
      description:
        'A collection of AI-powered applications built with LangChain and modern LLM frameworks. From intelligent document processing to conversational agents, these projects demonstrate practical applications of large language models in production environments.',
      role: 'AI Engineer',
      techStack: [
        'Python',
        'LangChain',
        'OpenAI API',
        'Anthropic Claude',
        'FastAPI',
        'Vector DBs',
        'RAG',
      ],
      features: [
        'Retrieval-augmented generation (RAG)',
        'Document Q&A systems',
        'Conversational AI agents',
        'Structured output parsing',
        'Multi-model orchestration',
        'Production-ready deployments',
      ],
      links: [],
      media: [
        { type: 'image', src: '/assets/projects/langchain-rag.png', alt: 'LangChain RAG Architecture' },
        { type: 'image', src: '/assets/projects/langchain-agent.png', alt: 'AI Agent Interface' },
      ],
    },
  },

  {
    id: 'quanta',
    title: 'QUANTA',
    subtitle: 'Quantum Computing Platform',
    modelType: 'cloud',
    position: outerPos(90),
    color: '#3b82f6',
    glowColor: '#60a5fa',
    status: 'live',
    orbitRadius: ORBIT_RADIUS,
    orbitSpeed: 0.08,
    rotationSpeed: 0.35,
    showcase: {
      description:
        'QUANTA (Quantum Unified Abstraction for Next-gen Algorithmics) is a visual quantum computing learning platform that makes quantum mechanics accessible through interactive simulation. Turn abstract quantum concepts into concrete, visual, and explorable experiences — learn quantum computing like learning to code.',
      role: 'Solo Engineer',
      techStack: [
        'React',
        'TypeScript',
        'Python',
        'FastAPI',
        'Qiskit',
        'Zustand',
        'PostgreSQL',
      ],
      features: [
        'Visual drag-and-drop circuit builder',
        'Real-time Bloch sphere visualization',
        'Guided curriculum from qubits to Grover\'s',
        'Up to 16-qubit simulation (Qiskit Aer)',
        'Bidirectional code sync',
        'Sandbox mode for experimentation',
      ],
      links: [
        { label: 'Website', url: 'https://axiondeep.com/solutions#quanta', icon: 'external' },
      ],
      media: [
        { type: 'image', src: '/assets/projects/quanta-builder.png', alt: 'QUANTA Circuit Builder' },
        { type: 'image', src: '/assets/projects/quanta-bloch.png', alt: 'Bloch Sphere Visualization' },
        { type: 'video', src: '/assets/projects/quanta-demo.mp4', alt: 'QUANTA Demo Video' },
      ],
    },
  },

  {
    id: 'forma',
    title: 'Forma',
    subtitle: 'Visual Page Builder',
    modelType: 'gears',
    position: outerPos(150),
    color: '#ef4444',
    glowColor: '#f87171',
    status: 'live',
    orbitRadius: ORBIT_RADIUS,
    orbitSpeed: 0.08,
    rotationSpeed: 0.7,
    showcase: {
      description:
        'Forma is a visual page builder similar to Elementor and Webflow. Users can drag-and-drop from 100+ pre-built components to create stunning web pages without writing code. Features AI-powered component generation using Claude for intelligent assistance.',
      role: 'Solo Engineer',
      techStack: [
        'Next.js',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'FastAPI',
        'Anthropic Claude',
        'Zustand',
        'Framer Motion',
      ],
      features: [
        'Drag-and-drop visual canvas',
        '100+ pre-built components',
        'AI-powered component generation',
        'Real-time preview (desktop/tablet/mobile)',
        'Undo/redo history management',
        'Component alignment & positioning',
        'Export-ready pages',
      ],
      links: [
        { label: 'Beta', url: 'https://made4founders.com', icon: 'external' },
      ],
      media: [
        { type: 'image', src: '/assets/projects/forma-builder.png', alt: 'Forma Visual Builder' },
        { type: 'image', src: '/assets/projects/forma-components.png', alt: 'Component Library' },
        { type: 'video', src: '/assets/projects/forma-demo.mp4', alt: 'Forma Demo Video' },
      ],
    },
  },

  {
    id: 'founderos',
    title: 'FounderOS',
    subtitle: 'Founder Command Center',
    modelType: 'browser',
    position: outerPos(210),
    color: '#06b6d4',
    glowColor: '#22d3ee',
    status: 'live',
    orbitRadius: ORBIT_RADIUS,
    orbitSpeed: 0.08,
    rotationSpeed: 0.5,
    showcase: {
      description:
        'FounderOS is an all-in-one dashboard for first-time founders to manage their startup formation, compliance, and operations. Features a secure credential vault with AES-256 encryption, daily AI-generated briefs, compliance tracking, and document management — everything a founder needs in one place.',
      role: 'Solo Engineer',
      techStack: [
        'React',
        'TypeScript',
        'Vite',
        'Tailwind CSS',
        'FastAPI',
        'SQLAlchemy',
        'JWT Auth',
        'AES-256 Encryption',
      ],
      features: [
        'AI-powered daily founder brief',
        'Encrypted credential vault (Fernet + PBKDF2)',
        'Business formation checklist',
        'Compliance deadline tracking',
        'Document management system',
        'Contact & service provider CRM',
        'Getting started wizard',
      ],
      links: [
        { label: 'Website', url: 'https://made4founders.com', icon: 'external' },
      ],
      media: [
        { type: 'image', src: '/assets/projects/founderos-dashboard.png', alt: 'FounderOS Dashboard' },
        { type: 'image', src: '/assets/projects/founderos-vault.png', alt: 'Credential Vault' },
        { type: 'image', src: '/assets/projects/founderos-brief.png', alt: 'Daily Brief' },
      ],
    },
  },

  {
    id: 'vesper-hydra',
    title: 'Vesper Hydra',
    subtitle: 'AI Bug Bounty Copilot',
    modelType: 'hydra',
    position: outerPos(270),
    color: '#00ff00',
    glowColor: '#00ff88',
    status: 'live',
    orbitRadius: ORBIT_RADIUS,
    orbitSpeed: 0.08,
    rotationSpeed: 0.45,
    showcase: {
      description:
        'Vesper Hydra is an AI-powered bug bounty hunting platform featuring dual-agent architecture. The Hunt agent aggressively searches for vulnerabilities while the Advise agent provides strategic guidance. Built with persistent memory (NLMN), HTTP proxy, fuzzer, scanner integration, and OOB detection — a complete pentesting suite enhanced by Claude AI.',
      role: 'Solo Engineer',
      techStack: [
        'Python',
        'PyQt6',
        'Claude API',
        'mitmproxy',
        'Nuclei',
        'SQLite',
        'interactsh',
        'Flask',
      ],
      features: [
        'Dual AI agents (Hunt + Advise)',
        'Neural Local Memory Network (NLMN)',
        'HTTP intercepting proxy',
        'Burp-style request editor & repeater',
        'Nuclei scanner integration (11K+ templates)',
        'Intruder-style fuzzer with 4 attack modes',
        'OOB detection via interactsh',
        'Automated recon workflows',
        'CVE/EPSS/Exploit-DB integration',
        'Finding deduplication & verification',
      ],
      links: [
        { label: 'Website', url: 'https://axiondeep.com/solutions#vesper', icon: 'external' },
        { label: 'GitHub', url: 'https://github.com/joshuarg007/pentestAI', icon: 'github' },
      ],
      media: [
        { type: 'image', src: '/assets/projects/vesper-gui.png', alt: 'Vesper Hydra GUI' },
        { type: 'image', src: '/assets/projects/vesper-hunt.png', alt: 'Hunt Agent Interface' },
        { type: 'image', src: '/assets/projects/vesper-advise.png', alt: 'Advise Agent Interface' },
        { type: 'image', src: '/assets/projects/vesper-proxy.png', alt: 'HTTP Proxy' },
        { type: 'image', src: '/assets/projects/vesper-scanner.png', alt: 'Scanner Tab' },
        { type: 'image', src: '/assets/projects/vesper-fuzzer.png', alt: 'Fuzzer Tab' },
        { type: 'video', src: '/assets/projects/vesper-demo.webm', alt: 'Vesper Hydra Demo' },
      ],
    },
  },

  // === CENTER NODE: HOBBIES ===
  {
    id: 'hobbies',
    title: 'Hobbies',
    subtitle: 'Beyond the Code',
    modelType: 'hobbies',
    position: [0, 0, 0],
    color: '#f97316',
    glowColor: '#fb923c',
    status: 'live',
    rotationSpeed: 0.4,
    showcase: {
      description:
        'When I\'m not engineering software, you\'ll find me at the chess board strategizing, at the poker table reading opponents, or in the gym pushing limits. These pursuits sharpen the same skills I bring to development: strategic thinking, pattern recognition, discipline, and the drive to continuously improve.',
      role: 'Enthusiast',
      techStack: ['Chess', 'Poker', 'Fitness', 'Strategy Games'],
      features: [
        'Chess: Strategic thinking & pattern recognition',
        'Poker: Probability & reading situations',
        'Fitness: Discipline & consistent improvement',
        'Competition: Drive to excel',
      ],
      links: [],
      media: [],
    },
  },

  {
    id: 'coming-soon',
    title: 'Coming Soon',
    subtitle: 'Future Projects',
    modelType: 'locked',
    position: outerPos(330),
    color: '#6b7280',
    glowColor: '#9ca3af',
    status: 'coming-soon',
    orbitRadius: ORBIT_RADIUS,
    orbitSpeed: 0.08,
    rotationSpeed: 0.2,
    showcase: {
      description:
        'New projects are always in development. Check back soon for more innovations from Axion Deep Labs.',
      role: 'In Development',
      techStack: [],
      features: ['More projects coming soon...'],
      links: [],
      media: [],
    },
  },
];

// Helper to get project by ID
export const getProjectById = (id: string): ProjectNode | undefined =>
  projects.find((p) => p.id === id);

// Get center node (Hobbies)
export const getCenterNode = (): ProjectNode =>
  projects.find((p) => p.id === 'hobbies')!;

// Get orbital nodes (everything except center)
export const getOrbitalNodes = (): ProjectNode[] =>
  projects.filter((p) => p.id !== 'hobbies');
