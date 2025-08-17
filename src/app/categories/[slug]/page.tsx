// src/app/categories/[slug]/page.tsx

import PostCard from '@/components/PostCard'; // PostCardをインポート
import type { Category, Post } from '@/types';
import { fetchCategoryBySlugSafe, fetchPagesByCategorySafe } from '@/lib/api';
import ErrorMessage from '@/components/ErrorMessage';

type CategoryPageProps = {
  params?: Promise<{ slug: string }> | undefined;
};

export default async function CategoryPage(props: CategoryPageProps) {
  const { params } = props;
  // params may be a Promise in some runtimes; resolve safely
  const resolved = (await params) as { slug: string } | undefined;
  const { slug } = resolved ?? {};

  if (!slug) return <div>Category not found</div>;

  const categoryResult = await fetchCategoryBySlugSafe(slug);
  if (categoryResult.error) {
    return <ErrorMessage title="カテゴリ取得エラー" message={categoryResult.error} />;
  }
  const category = categoryResult.data!.docs[0] as Category | undefined;

  let posts: Post[] = [];
  if (category) {
    const pagesResult = await fetchPagesByCategorySafe(category.id);
    if (pagesResult.error) {
      return <ErrorMessage title="投稿一覧取得エラー" message={pagesResult.error} />;
    }
    posts = pagesResult.data!.docs;
  }

  return (
    <section>
      <header className="border-b border-card-border pb-4 mb-8">
        <h1 className="text-3xl font-bold">
          Category: {category ? category.name : 'Unknown'}
        </h1>
        <p className="text-foreground/60 mt-2">
          {posts.length} posts found in this category.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}