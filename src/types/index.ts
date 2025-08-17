// src/types/index.ts

export type Category = {
  // id may be coerced from number -> string by zod
  id: string;
  // normalized by zod transform to always be a string
  name: string;
  slug: string;
};

export type Media = {
  url: string;
  width?: number;
  height?: number;
  // alt is normalized to string by the zod transform
  alt: string;
};

// Rich text node types used by the CMS content
export type RTNode = {
  type?: string;
  tag?: string;
  children?: RTNode[];
  text?: string;
  fields?: { url?: string };
  format?: number;
  ordered?: boolean;
};

export type RTContent = {
  root?: {
    children?: RTNode[];
  };
};

export type Post = {
  id: string;
  title: string;
  slug?: string;
  summary?: string;
  publishedAt: string;
  heroImage?: Media;
  categories?: Category[];
  content?: RTContent;
};

// Generic API response returned by the CMS endpoints
export type ApiResponse<T = Post> = {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
};