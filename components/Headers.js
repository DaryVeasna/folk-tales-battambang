'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from './Providers';
import { createClient } from '../lib/supabase/client';

export default function Header() {
  const { t, theme, lang, toggleTheme, toggleLang } = useApp();
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(undefined); // undefined = checking, null = logged out

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="nav">
      <Link className="nav-link" href="/" aria-current={path === '/' ? 'page' : undefined}>
        {t('home')}
      </Link>
      <span className="nav-spacer" />
      <div className="nav-right">
        {user && (
          <>
            <Link
              className="nav-link"
              href="/my-entries"
              aria-current={path === '/my-entries' ? 'page' : undefined}
            >
              {t('myEntries')}
            </Link>
            <button className="nav-link nav-button" onClick={handleLogout}>
              {t('logout')}
            </button>
          </>
        )}
        {user === null && (
          <>
            <Link className="nav-link" href="/login">{t('login')}</Link>
            <Link className="nav-link" href="/signup">{t('signup')}</Link>
          </>
        )}
        <Link className="pill" href="/contribute">{t('contribute')}</Link>
        <button className="round" onClick={toggleLang} aria-label="Switch language">
          {lang === 'en' ? 'kh' : 'en'}
        </button>
        <button className="round" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === 'light' ? (
            <svg width="55%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
          ) : (
            <svg width="55%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          )}
        </button>
      </div>
    </nav>
  );
}