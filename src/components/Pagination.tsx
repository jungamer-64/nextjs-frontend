// src/components/Pagination.tsx

"use client";

import Link from 'next/link';

type Props = {
  basePath: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

const Pagination = ({
  basePath,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
}: Props) => {
  // CSS handles smooth transitions on theme change; no JS re-render required
  return (
    <nav aria-label="Pagination" className="flex justify-center mt-10">
      <div className="inline-flex items-center gap-3">
        { !hasPrevPage ? (
          <button
            disabled
            aria-disabled
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors border bg-card-background text-foreground/40 border-card-border`}
            aria-label="No previous page"
          >
            &larr; 前へ
          </button>
        ) : (
          <Link
            href={`${basePath}?page=${prevPage}`}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors border bg-card-background text-foreground hover:bg-card-background/80 border-card-border`}
            aria-label="Go to previous page"
          >
            &larr; 前へ
          </Link>
        ) }

        { !hasNextPage ? (
          <button
            disabled
            aria-disabled
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors border bg-card-background text-foreground/40 border-card-border`}
            aria-label="No next page"
          >
            次へ &rarr;
          </button>
        ) : (
          <Link
            href={`${basePath}?page=${nextPage}`}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors border bg-card-background text-foreground hover:bg-card-background/80 border-card-border`}
            aria-label="Go to next page"
          >
            次へ &rarr;
          </Link>
        ) }
      </div>
    </nav>
  );
};

export default Pagination;