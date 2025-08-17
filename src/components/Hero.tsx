// src/components/Hero.tsx

import Image from 'next/image';
import Link from 'next/link';

type Props = {
  title: string;
  subtitle: string;
  imageUrl: string;
};

const Hero = ({ title, subtitle, imageUrl }: Props) => {
  return (
    <section aria-label="Site introduction" className="bg-card-background border border-card-border rounded-2xl p-6 md:p-10 shadow-sm">
      <div className="md:flex md:items-center md:gap-8">
        <div className="w-28 h-28 md:w-36 md:h-36 flex-shrink-0 mx-auto md:mx-0">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-white/5 p-2">
            <Image
              src={imageUrl}
              alt={title}
              fill
              style={{ objectFit: 'contain' }}
              className="drop-shadow-md"
              priority
            />
          </div>
        </div>

        <div className="text-center md:text-left mt-4 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-2">
            {title}
          </h1>
          <p className="max-w-2xl text-foreground/70">{subtitle}</p>

          <div className="mt-4 flex justify-center md:justify-start gap-3">
            <a href="#latest" className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition-colors" aria-label="Jump to latest posts">
              最新記事を見る
            </a>
            <Link href="/collections" className="inline-flex items-center px-4 py-2 rounded-full border border-card-border text-sm text-link hover:bg-card-background/80 transition-colors" aria-label="View categories">
              カテゴリを見る
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;