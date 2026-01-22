// apps/web/src/components/showcase/ExpandedHobbiesPanel.tsx
import React from 'react';
import { ExpandableFrame } from '../ExpandableFrame';

interface ExpandedHobbiesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HobbyDetail {
  name: string;
  icon: string;
  tagline: string;
  description: string;
  highlights: string[];
  color: string;
  imagePlaceholder: string;
  imageDesc: string;
}

const hobbiesDetailed: HobbyDetail[] = [
  {
    name: 'Chess',
    icon: '♟️',
    tagline: 'The Game of Kings',
    description: 'Chess has been my mental gymnasium for years. The endless complexity, pattern recognition, and strategic depth mirror the challenges of software architecture.',
    highlights: [
      'Rapid & blitz online games',
      'Opening theory enthusiast',
      'Endgame technique practice',
    ],
    color: '#f59e0b',
    imagePlaceholder: 'hobby-chess.jpg',
    imageDesc: 'Chess board setup or playing position',
  },
  {
    name: 'Poker',
    icon: '🃏',
    tagline: 'Calculated Risk',
    description: 'Poker taught me to make decisions with incomplete information, manage risk, and read situations - skills that translate directly to business and engineering.',
    highlights: [
      'Texas Hold\'em tournaments',
      'Probability & pot odds',
      'Reading opponent patterns',
    ],
    color: '#ef4444',
    imagePlaceholder: 'hobby-poker.jpg',
    imageDesc: 'Poker chips or cards arrangement',
  },
  {
    name: 'Fitness',
    icon: '💪',
    tagline: 'Mind & Body',
    description: 'A strong body supports a clear mind. Consistent training builds discipline that carries into every aspect of life and work.',
    highlights: [
      'Strength training',
      'HIIT workouts',
      'Active recovery',
    ],
    color: '#3b82f6',
    imagePlaceholder: 'hobby-fitness.jpg',
    imageDesc: 'Gym or workout environment',
  },
  {
    name: 'Hiking',
    icon: '🥾',
    tagline: 'Nature\'s Reset',
    description: 'There\'s nothing like a mountain trail to clear the mind and gain perspective. The desert Southwest offers endless exploration.',
    highlights: [
      'Southwest desert trails',
      'Mountain summits',
      'Nature photography',
    ],
    color: '#10b981',
    imagePlaceholder: 'hobby-hiking.jpg',
    imageDesc: 'Trail or mountain landscape photo',
  },
];

const readingList = [
  { title: 'The Iliad', author: 'Homer', category: 'Classic' },
  { title: 'Republic', author: 'Plato', category: 'Philosophy' },
  { title: 'The Wheel of Time', author: 'Robert Jordan', category: 'Fantasy' },
  { title: 'The Dark Tower', author: 'Stephen King', category: 'Fantasy' },
  { title: 'Transcendental Magic', author: 'Eliphas Levi', category: 'Esoteric' },
  { title: 'The Kybalion', author: 'Three Initiates', category: 'Philosophy' },
];

const musicTastes = [
  { genre: 'Classical', artists: 'Chopin, Paganini, Liszt', color: '#8b5cf6' },
  { genre: 'Country', artists: 'Classic & modern', color: '#f59e0b' },
  { genre: '90s Hip Hop', artists: 'Tupac, Biggie, Nas', color: '#ef4444' },
  { genre: 'Grunge', artists: 'Nirvana, Pearl Jam, Soundgarden', color: '#10b981' },
  { genre: 'Oldies', artists: '50s-70s classics', color: '#3b82f6' },
];

export function ExpandedHobbiesPanel({ isOpen, onClose }: ExpandedHobbiesPanelProps) {
  if (!isOpen) return null;

  const accentColor = '#f97316';

  return (
    <ExpandableFrame
      title="Beyond The Code"
      subtitle="What keeps me inspired outside of work"
      accentColor={accentColor}
      onClose={onClose}
    >
      {/* Hobbies Grid */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>01</span>
          Pursuits & Passions
        </h2>
        <div style={styles.hobbiesGrid}>
          {hobbiesDetailed.map((hobby, i) => (
            <div key={i} style={styles.hobbyCard}>
              <div style={styles.hobbyImageContainer}>
                {/* PLACEHOLDER IMAGE */}
                <div style={styles.hobbyImagePlaceholder}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span style={styles.placeholderName}>{hobby.imagePlaceholder}</span>
                  <span style={styles.placeholderDesc}>{hobby.imageDesc}</span>
                </div>
              </div>
              <div style={styles.hobbyContent}>
                <div style={styles.hobbyHeader}>
                  <span style={styles.hobbyIcon}>{hobby.icon}</span>
                  <div>
                    <h3 style={{ ...styles.hobbyName, color: hobby.color }}>{hobby.name}</h3>
                    <span style={styles.hobbyTagline}>{hobby.tagline}</span>
                  </div>
                </div>
                <p style={styles.hobbyDescription}>{hobby.description}</p>
                <div style={styles.hobbyHighlights}>
                  {hobby.highlights.map((h, j) => (
                    <span key={j} style={{ ...styles.highlight, borderColor: `${hobby.color}40` }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reading Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>02</span>
          Reading List
        </h2>
        <div style={styles.readingIntro}>
          <span style={styles.readingIcon}>📚</span>
          <p style={styles.readingText}>
            From ancient epics to modern fantasy, esoteric philosophy to timeless classics.
            Books shape thinking and expand horizons.
          </p>
        </div>
        <div style={styles.booksGrid}>
          {readingList.map((book, i) => (
            <div key={i} style={styles.bookCard}>
              <span style={styles.bookCategory}>{book.category}</span>
              <h4 style={styles.bookTitle}>{book.title}</h4>
              <span style={styles.bookAuthor}>{book.author}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Music Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>03</span>
          Music
        </h2>
        <div style={styles.musicIntro}>
          <span style={styles.musicIcon}>🎧</span>
          <p style={styles.musicText}>
            Eclectic taste spanning centuries and genres. Music fuels focus and creativity.
          </p>
        </div>
        <div style={styles.musicGrid}>
          {musicTastes.map((music, i) => (
            <div
              key={i}
              style={{
                ...styles.musicCard,
                borderColor: `${music.color}40`,
              }}
            >
              <h4 style={{ ...styles.musicGenre, color: music.color }}>{music.genre}</h4>
              <span style={styles.musicArtists}>{music.artists}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>04</span>
          Gallery
        </h2>
        <div style={styles.gallery}>
          {[
            { name: 'hobby-trail-vista.jpg', desc: 'Scenic hiking trail view' },
            { name: 'hobby-chess-tournament.jpg', desc: 'Chess game or tournament' },
            { name: 'hobby-gym-setup.jpg', desc: 'Training environment' },
            { name: 'hobby-nature.jpg', desc: 'Desert/mountain landscape' },
            { name: 'hobby-books-shelf.jpg', desc: 'Book collection or reading corner' },
            { name: 'hobby-outdoors-action.jpg', desc: 'Active outdoor moment' },
          ].map((img, i) => (
            <div key={i} style={styles.galleryItem}>
              <div style={styles.imagePlaceholder}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span style={styles.galleryPlaceholderName}>{img.name}</span>
                <span style={styles.galleryPlaceholderDesc}>{img.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Quote */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <span style={styles.sectionIcon}>05</span>
          Life Philosophy
        </h2>
        <blockquote style={styles.quote}>
          "Chess and poker taught me that the best decisions come from patience, pattern recognition,
          and knowing when to take calculated risks. The gym taught me discipline. The trails taught me
          perspective. Together, they shape how I approach every challenge."
        </blockquote>
      </section>
    </ExpandableFrame>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginBottom: 48,
    paddingTop: 32,
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#f97316',
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
  hobbiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
  },
  hobbyCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  hobbyImageContainer: {
    height: 140,
    overflow: 'hidden',
  },
  hobbyImagePlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  placeholderName: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'monospace',
  },
  placeholderDesc: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  hobbyContent: {
    padding: 20,
  },
  hobbyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  hobbyIcon: {
    fontSize: 32,
  },
  hobbyName: {
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
  },
  hobbyTagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  hobbyDescription: {
    fontSize: 14,
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.75)',
    margin: '0 0 14px 0',
  },
  hobbyHighlights: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  highlight: {
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid',
    background: 'rgba(255, 255, 255, 0.03)',
  },
  readingIntro: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    padding: 16,
    background: 'rgba(139, 92, 246, 0.08)',
    borderRadius: 12,
    border: '1px solid rgba(139, 92, 246, 0.15)',
  },
  readingIcon: {
    fontSize: 32,
  },
  readingText: {
    fontSize: 14,
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
  },
  booksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  bookCard: {
    padding: 16,
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  bookCategory: {
    fontSize: 10,
    color: '#8b5cf6',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    margin: '6px 0 4px 0',
  },
  bookAuthor: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  musicIntro: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    padding: 16,
    background: 'rgba(236, 72, 153, 0.08)',
    borderRadius: 12,
    border: '1px solid rgba(236, 72, 153, 0.15)',
  },
  musicIcon: {
    fontSize: 32,
  },
  musicText: {
    fontSize: 14,
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
  },
  musicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 12,
  },
  musicCard: {
    padding: 14,
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    border: '1px solid',
    textAlign: 'center',
  },
  musicGenre: {
    fontSize: 13,
    fontWeight: 600,
    margin: '0 0 4px 0',
  },
  musicArtists: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 1.4,
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  galleryItem: {
    aspectRatio: '4/3',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
    border: '1px dashed rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
  },
  galleryPlaceholderName: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  galleryPlaceholderDesc: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
  },
  quote: {
    fontSize: 18,
    lineHeight: 1.8,
    color: 'rgba(255, 255, 255, 0.85)',
    fontStyle: 'italic',
    margin: 0,
    padding: '24px 28px',
    borderLeft: '3px solid #f97316',
    background: 'rgba(249, 115, 22, 0.06)',
    borderRadius: '0 12px 12px 0',
  },
};

export default ExpandedHobbiesPanel;
