'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { useApp } from './Providers';

// d = parallax strength in px, t = float duration, fx/fy = float distance
const orbs = [
  { cls: 'orb-yellow', d: -30, t: '9s',  fx: '-30px', fy: '25px' },
  { cls: 'orb-orange', d: 55,  t: '7s',  fx: '25px',  fy: '-30px' },
  { cls: 'orb-pink',   d: -80, t: '5.5s', fx: '-20px', fy: '-35px' },
];

export default function Hero() {
  const { t } = useApp();
  const ref = useRef(null);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    ref.current.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const onLeave = () => {
    ref.current.style.setProperty('--mx', 0);
    ref.current.style.setProperty('--my', 0);
  };
  const pop = (e) => {
    const el = e.currentTarget;
    el.classList.remove('pop');
    void el.offsetWidth; // restart the animation
    el.classList.add('pop');
  };

  return (
    <section className="hero" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      {orbs.map((o) => (
        <div key={o.cls} className={`orb ${o.cls}`} style={{ '--d': o.d }}>
          <div
            className="orb-inner"
            style={{ '--t': o.t, '--fx': o.fx, '--fy': o.fy }}
            onClick={pop}
            onAnimationEnd={(e) => e.currentTarget.classList.remove('pop')}
          />
        </div>
      ))}

      <h1 className="hero-title">{t('title')}</h1>
      <div className="hero-buttons">
        <a className="btn" href="#entries">{t('explore')}</a>
        <Link className="btn" href="/practice">{t('practice')}</Link>
      </div>

      <svg className="wave" viewBox="0 0 2244 160" preserveAspectRatio="none" aria-hidden="true">
        <rect width="2244" height="160" className="wave-cream" />
        <rect width="2244" height="80" className="wave-green" />
        <ellipse cx="245" cy="80" rx="245" ry="80" className="wave-green" />
        <ellipse cx="1120" cy="80" rx="220" ry="80" className="wave-green" />
        <ellipse cx="2000" cy="80" rx="244" ry="80" className="wave-green" />
        <ellipse cx="695" cy="80" rx="215" ry="75" className="wave-cream" />
        <ellipse cx="1550" cy="80" rx="215" ry="75" className="wave-cream" />
      </svg>
    </section>
  );
}