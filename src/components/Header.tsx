// src/components/Header.tsx

"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

const Header = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 初期状態: prefers-color-scheme または保存された設定を反映
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (saved) {
      setIsDark(saved === 'dark');
      document.documentElement.classList.toggle('dark', saved === 'dark');
      // set inline vars to ensure user preference overrides OS preference
      if (saved === 'dark') {
        document.documentElement.style.setProperty('--color-background', '#111827');
        document.documentElement.style.setProperty('--color-foreground', '#f9fafb');
        document.documentElement.style.setProperty('--color-card-background', '#1f2937');
        document.documentElement.style.setProperty('--color-card-border', '#374151');
      } else {
        document.documentElement.style.setProperty('--color-background', '#fff');
        document.documentElement.style.setProperty('--color-foreground', '#111827');
        document.documentElement.style.setProperty('--color-card-background', '#fff');
        document.documentElement.style.setProperty('--color-card-border', '#e5e7eb');
      }
    } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      // do not set inline vars here so system preference still controls unless user chooses
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    if (typeof window !== 'undefined') localStorage.setItem('theme', next ? 'dark' : 'light');
    // apply inline css vars to make user choice take precedence over prefers-color-scheme
    if (next) {
      document.documentElement.style.setProperty('--color-background', '#111827');
      document.documentElement.style.setProperty('--color-foreground', '#f9fafb');
      document.documentElement.style.setProperty('--color-card-background', '#1f2937');
      document.documentElement.style.setProperty('--color-card-border', '#374151');
    } else {
      document.documentElement.style.setProperty('--color-background', '#fff');
      document.documentElement.style.setProperty('--color-foreground', '#111827');
      document.documentElement.style.setProperty('--color-card-background', '#fff');
      document.documentElement.style.setProperty('--color-card-border', '#e5e7eb');
    }
    // Notify other client components that theme changed so they can react immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themechange', { detail: { isDark: next } }));
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" aria-label="Go to homepage" className="text-2xl font-bold text-foreground hover:text-blue-500 transition-colors">
            jungamers Blog
          </Link>
          <nav role="navigation" aria-label="Main navigation">
            <ul className="flex items-center space-x-4">
              <li>
                <Link href="/posts" className="text-foreground/80 hover:text-foreground transition-colors" aria-label="View all posts">
                  All Posts
                </Link>
              </li>
              <li>
                <button
                  onClick={toggle}
                  aria-label="Toggle dark mode"
                  className="p-2 rounded hover:bg-card-background/50"
                >
                  {isDark ? '🌙' : '☀️'}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;