// src/app/page.tsx

import { fetchPosts } from '@/lib/api';
import Hero from '@/components/Hero';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
// Post type imported from shared types when needed in components

const POSTS_PER_PAGE = 3;

type HomeProps = {
  // Keep this as a Promise to satisfy Next's PageProps constraint. Next may pass a Promise or a plain object at runtime; `await` handles both.
  searchParams?: Promise<Record<string, string | undefined>> | undefined;
};

export default async function Home(props: HomeProps) {
  const { searchParams } = props;
  // Resolve searchParams which may be a Promise in some Next runtimes (or a plain object at runtime)
  const resolved = (await searchParams) as Record<string, string | undefined> | undefined;
  const { page } = resolved ?? {};
  const currentPage = Number(page) || 1;

  const { docs: posts, ...paginationInfo } = await fetchPosts({
    limit: POSTS_PER_PAGE,
    page: currentPage,
  });

  return (
    <main className="bg-gradient-to-b from-background via-background/95 to-background min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Hero
          title="適当に作ったブログです。"
          subtitle="とりあえずテストで作ってみました。"
          imageUrl="/globe.svg" // この画像は適宜変更してください
        />

        <section className="mt-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              最新記事
            </h2>
            <span className="text-sm text-foreground/60">全{paginationInfo.totalDocs ?? posts.length}件</span>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, idx: number) => (
              <PostCard key={post.id} post={post} priority={idx < 2} />
            ))}
          </div>
        </section>

        <Pagination basePath="/" {...paginationInfo} />
      </div>
    </main>
  );
}