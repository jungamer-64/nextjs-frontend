// src/components/PostCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types';
import { API_URL } from '@/constants';

type Props = {
  post: Post;
  priority?: boolean;
  variant?: 'default' | 'compact';
};

const PostCard = ({ post, priority = false, variant = 'default' }: Props) => {
  const imageUrl = post.heroImage?.url
    ? String(post.heroImage.url).startsWith('http')
      ? post.heroImage.url
      : `${API_URL}${post.heroImage.url}`
    : '/placeholder-image.svg'; // プレースホルダー画像

  const titleId = `post-title-${post.id}`;
  return (
  <article aria-labelledby={titleId} className={`group bg-card-background border border-card-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col ${variant === 'compact' ? 'p-0' : ''}`}>
      <Link href={`/posts/${post.slug}`} className="block">
        <div className={`relative w-full ${variant === 'compact' ? 'aspect-[4/3]' : 'aspect-video'} overflow-hidden`}>
          <Image
            src={imageUrl}
            alt={post.heroImage?.alt || post.title}
            fill
            sizes={variant === 'compact' ? '(max-width: 640px) 100vw, 33vw' : '(max-width: 1024px) 100vw, 50vw'}
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 group-hover:scale-105"
            priority={priority}
            {...(!priority ? { loading: 'lazy' as const } : {})}
          />
        </div>
      </Link>

      <div className={`${variant === 'compact' ? 'p-4' : 'p-5'} flex flex-col flex-grow`}>
        <div className="flex-grow">
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.map((category) => (
                <Link href={`/categories/${category.slug}`} key={category.id} className="text-xs font-semibold bg-foreground/5 text-foreground px-2.5 py-1 rounded-full hover:bg-foreground/10 transition-colors" aria-label={`View posts in ${category.name}`}>
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          <h2 id={titleId} className={`${variant === 'compact' ? 'text-base md:text-lg' : 'text-lg md:text-xl'} font-semibold mb-2 leading-tight`}>
            <Link
              href={`/posts/${post.slug}`}
              className="text-link hover:underline transition-colors"
            >
              {post.title}
            </Link>
          </h2>

          <p className="text-foreground/70 text-sm mb-4 line-clamp-3">
            {post.summary}
          </p>
        </div>

  <div className="text-xs text-foreground/60 mt-auto pt-4 border-t border-card-border flex items-center justify-between">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <Link href={`/posts/${post.slug}`} className="text-sm text-link hover:underline" aria-label={`Read more about ${post.title}`}>
            続きを読む →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;