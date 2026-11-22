'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const dict = {
  en: {
    home: 'Home', login: 'Log in', signup: 'Sign up', contribute: 'Contribute', myEntries: 'My Entries',
    title: 'Viral Khmer Slang', explore: 'Explore', practice: 'Practice',
    trending: 'Trending', fun: 'Fun', convenient: 'Convenient',myEntries: 'My entries',logout: 'Log out',
  },
  km: {
    home: 'ទំព័រដើម', login: 'ចូលគណនី', signup: 'ចុះឈ្មោះ', contribute: 'ចូលរួមចំណែក', myEntries: 'មុខងាររបស់ខ្ញុំ',
    title: 'ពាក្យស្លែងខ្មែរពេញនិយម', explore: 'ស្វែងរក', practice: 'អនុវត្ត',
    trending: 'កំពុងពេញនិយម', fun: 'កំសាន្ត', convenient: 'ងាយស្រួល', myEntries: 'ការចូលរួមរបស់ខ្ញុំ',logout: 'ចាកចេញ',
  },
};

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function Providers({ children }) {
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('en');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || 'light');
    setLang(localStorage.getItem('lang') || 'en');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'km' : 'en';
    setLang(next);
    document.documentElement.lang = next;
    localStorage.setItem('lang', next);
  };

  const t = (key) => dict[lang][key] ?? key;

  return <Ctx.Provider value={{ theme, lang, t, toggleTheme, toggleLang }}>{children}</Ctx.Provider>;
}