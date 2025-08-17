// src/app/posts/[slug]/page.tsx

import RichTextRenderer from '@/components/RichTextRenderer';
import type { RTContent } from '@/types';
import Image from 'next/image';
import { fetchPageBySlugSafe } from '@/lib/api';
import { API_URL } from '@/constants';
import ErrorMessage from '@/components/ErrorMessage';

type PostPageProps = {
  params?: Promise<{ slug: string }> | undefined;
};

export default async function PostPage(props: PostPageProps) {
  const { params } = props;
  // Support both direct params and Promise-wrapped params from Next.js runtime
  const resolvedParams = (await params) as { slug: string };
  const { slug } = resolvedParams;

  if (!slug) return <div>Post not found</div>;

  const result = await fetchPageBySlugSafe(slug);
  if (result.error) {
    return <ErrorMessage title="記事の読み込みエラー" message={result.error} />;
  }
  const post = result.data!.docs[0];

  if (!post) {
    return <div>Post not found</div>;
  }

  const imageUrl = post.heroImage?.url ? `${API_URL}${post.heroImage.url}` : undefined;

  return (
    <article className="max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          {post.title}
        </h1>
        <div className="text-foreground/60 text-sm">
          <time dateTime={post.publishedAt}>
            公開日: {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
          </time>
        </div>
      </header>

      {imageUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
          <Image
            src={imageUrl as string}
            alt={post.heroImage?.alt || post.title}
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
  <RichTextRenderer content={post.content as RTContent} headingOffset={1} />
      </div>
    </article>
  );
}