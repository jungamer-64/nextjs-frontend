// src/app/layout.tsx

import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google'; // Noto Sans JPをインポート
import './globals.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Noto Sans JPのフォント設定
const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'], // 通常と太字のウェイトを読み込む
});

export const metadata: Metadata = {
  title: 'Modern Tech Blog', // タイトルをモダンに
  description: 'A modern blog built with Next.js and Payload CMS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* フォント設定を適用 */}
      <body
        className={`${notoSansJp.className} bg-background text-foreground transition-colors duration-300`}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}