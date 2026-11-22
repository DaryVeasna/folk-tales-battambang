'use client';
import { useEffect, useRef } from 'react';
import { useApp } from './Providers';

// Replace `art` with <Image src="/illustrations/..." /> when your Khmer-style art is ready
const cards = [
  { key: 'trending',   color: 'var(--card-yellow)', art: '🔥' },
  { key: 'fun',        color: 'var(--card-orange)', art: '🎉' },
  { key: 'convenient', color: 'var(--card-pink)',   art: '⚡' },
];

export default function FeatureCards() {
  const { t } = useApp();
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
      { threshold: 0.2 }
    );
    ref.current.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="features" ref={ref}>
      {cards.map((c, i) => (
        <div key={c.key} className="feature reveal" style={{ '--i': i }}>
          <div className="feature-card" style={{ '--c': c.color }}>
            <span className="feature-art">{c.art}</span>
          </div>
          <span className="feature-label">{t(c.key)}</span>
        </div>
      ))}
    </section>
  );
}