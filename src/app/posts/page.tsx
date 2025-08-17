// src/app/posts/page.tsx

import { fetchPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
// Post type imported indirectly via API helpers; no direct import needed here

const POSTS_PER_PAGE = 9; // 1ページあたりの表示件数を変更

type PostsPageProps = {
  searchParams?: Promise<Record<string, string | undefined>> | undefined;
};

export default async function AllPostsPage(props: PostsPageProps) {
  const { searchParams } = props;
  const resolved = (await searchParams) as Record<string, string | undefined> | undefined;
  const { page } = resolved ?? {};
  const currentPage = Number(page) || 1;

  const { docs: posts, ...paginationInfo } = await fetchPosts({
    limit: POSTS_PER_PAGE,
    page: currentPage,
  });

  return (
    <section>
      <header className="border-b border-card-border pb-4 mb-8">
        <h1 className="text-3xl font-bold">すべての記事</h1>
        <p className="text-foreground/60 mt-2">
          これまでに公開されたすべての記事一覧です。
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, idx) => (
          <PostCard key={post.id} post={post} priority={idx < 6} variant="compact" />
        ))}
      </div>

      <Pagination basePath="/posts" {...paginationInfo} />
    </section>
  );
}